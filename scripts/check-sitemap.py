"""Validate the exported canonical sitemap using Python's standard-library XML parser."""
from pathlib import Path
import json,xml.etree.ElementTree as ET
from datetime import datetime
from urllib.parse import urlsplit
origin='https://johnvexcoder.github.io'
def read(name):return json.loads(Path('content',name).read_text())
expected=['/','/services/']+[p['route'] for p in read('site-pages.json') if p['route']!='/']+[p['route'] for p in read('service-routes.json')]+['/work/'+p['id']+'/' for p in read('projects.json')]
raw=Path('out/sitemap.xml').read_bytes()
assert b'<!DOCTYPE' not in raw and b'<!ENTITY' not in raw,'Unexpected DTD/entity declaration'
root=ET.fromstring(raw)
ns='{http://www.sitemaps.org/schemas/sitemap/0.9}'
assert root.tag==ns+'urlset','Correct sitemap namespace required'
urls=[node.findtext(ns+'loc') for node in root]
# Preview builds deliberately publish no canonical entries.
import os
assert urls==([origin+p for p in expected] if os.environ.get('SITE_INDEXING','production')=='production' else []),'Canonical route inventory differs from sitemap'
assert len(urls)==len(set(urls)),'Duplicate canonical entries'
for node in root:
 assert node.tag==ns+'url','Unexpected sitemap child'
 url=node.findtext(ns+'loc');parts=urlsplit(url)
 assert parts.scheme=='https' and parts.netloc=='johnvexcoder.github.io' and not parts.query and not parts.fragment
 assert parts.path.endswith('/') and not parts.path.startswith('/markdown/')
 assert Path('out'+parts.path,'index.html').is_file(),url+' missing exported HTML'
 if (date:=node.findtext(ns+'lastmod')):datetime.fromisoformat(date.replace('Z','+00:00'))
print('Sitemap XML validated:',len(urls),'canonical HTML URLs; namespace, duplicates, dates and route coverage checked.')
