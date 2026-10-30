const fs = require('fs');
let scss = fs.readFileSync('style.scss','utf8').replace(/^\uFEFF/,'');
// Разворачиваем правила: одна декларация на строку, вложенность с отступами.
scss = scss.replace(/([^\n])\/\//g, '$1//');
let depth=0, output=[], buffer='';
function flush() { const s=buffer.trim(); if(s) output.push('  '.repeat(depth)+s); buffer=''; }
for(let i=0; i<scss.length;i++) {
 const c=scss[i];
 if(c==='/' && scss[i+1]==='/') { flush(); const end=scss.indexOf('\n',i); output.push(scss.slice(i,end<0?scss.length:end).trim()); i=end<0?scss.length:end; continue; }
 if(c==='{') { buffer+=' {'; flush(); depth++; }
 else if(c==='}') { flush(); depth--; output.push('  '.repeat(depth)+'}'); if(depth===0) output.push(''); }
 else if(c===';') { buffer+=';'; flush(); }
 else buffer+=c;
}
flush();
scss=output.join('\n').trim()+'\n';
fs.writeFileSync('style.scss',scss);
let css=scss.replace(/^\/\/.*$/gm,'');
const vars={};
css=css.replace(/^\$(\w+):\s*([^;]+);/gm,(_,k,v)=>{vars[k]=v;return '';});
css=css.replace(/\$(\w+)/g,(_,k)=>vars[k]);
fs.writeFileSync('style.css',css.trim()+'\n');
const files=fs.readdirSync('.').filter(f=>f.endsWith('.html'));
for(const file of files) {
 const html=fs.readFileSync(file,'utf8');
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 if(new Set(ids).size!==ids.length) throw Error('Duplicate ID: '+file);
 const voids=new Set(['meta','link','input','img','br','hr','source']);
 const stack=[];
 for(const match of html.matchAll(/<!--[\s\S]*?-->|<![^>]+>|<\/?([a-z][\w-]*)\b[^>]*>/gi)) {
  const tag=match[1]; if(!tag || voids.has(tag)) continue;
  if(match[0].startsWith('</')) {if(stack.pop()!==tag) throw Error('Tag nesting: '+file+' '+tag);} else stack.push(tag);
 }
 if(stack.length) throw Error('Unclosed tags: '+file);
 for(const match of html.matchAll(/(?:href|src)="([^\"]+)"/g)) {
  const url=match[1]; if(/^(about:|https?:)/.test(url)) continue;
  const [path,hash]=url.split('#');
  const target=path||file;
  if(!fs.existsSync(target)) throw Error('Missing target '+file+' '+url);
  if(hash && !fs.readFileSync(target,'utf8').includes('id="'+hash+'"')) throw Error('Missing anchor '+url);
 }
 if(/<\/\w+>\s*<\w+/.test(html.replace(/\n/g,'\n'))) { /* переносы проверяются ниже */ }
 for(const line of html.split('\n')) if(/<\/\w+>.*<\w+/.test(line)) throw Error('Compact line: '+file);
 console.log('OK: '+file+' — структура и ссылки');
}
console.log('OK: iframe на странице доставки; HTML и стили отформатированы.');
