t=open('scripts/template.html').read()
out=t.replace('__DATA__',open('scripts/data.json').read()).replace('__EXTRA__',open('scripts/extra.json').read())
open('index.html','w').write(out); print(len(out)//1024,'KB')
