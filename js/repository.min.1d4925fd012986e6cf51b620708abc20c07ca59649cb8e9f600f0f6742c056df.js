function load_repository(target,uid){var parent=document.getElementById(uid);parent.innerHTML="... Loading data into the repository ...";var xhr=new XMLHttpRequest();xhr.responseType='json';xhr.onreadystatechange=function(){if(xhr.readyState==4&&xhr.status=="200"){build_repository(xhr.response,uid);}};xhr.open('GET',target,true);xhr.send(null);}
function build_repository(tabledata,uid){var repo=new Repository(uid,tabledata);}
function make_link(parent,text,fn){var link=document.createElement('a');link.href="#";link.onclick=fn;link.innerHTML=text;parent.append(link);parent.append(document.createTextNode(" "));}
class Repository{constructor(uid,rawdata){var parent=document.getElementById(uid);var handler=this;this.pagediv=document.createElement('div');this.pagediv.classList.add("pagination");this.data=rawdata;this.timeout=5;this.paginate=25;this.page=0;this.indices=Array.from(this.data.keys());this.filtered=this.indices;this.in_filter=document.createElement("input");this.in_filter.classList.add("filter");this.in_filter.oninput=function(){clearTimeout(handler.timeout);handler.timeout=setTimeout(function(){handler.update_filter();},500);};this.container=document.createElement("div");this.container.classList.add("repository");parent.innerHTML='Filter: ';parent.append(this.in_filter);parent.append(this.pagediv);parent.append(this.container);this.update_filter();}
update_filter(){this.container.innerHTML="Updating filter";if(!this.in_filter.value){this.filtered=this.indices;this.fill();return;}
var filtered=new Array(0);var s=this.in_filter.value;var allfilters=s.match(/(?:[^\s"]+|"[^"]*")+/g);var allregex=new Array(0);for(var curfilter in allfilters){allregex.push(new RegExp(allfilters[curfilter],"i"));}
loopm:for(var m in this.data){for(var curfilter in allfilters){var regexp=allregex[curfilter];try{if(!matches_filter(this.data[m],regexp)){continue loopm;}}catch(error){continue loopm;}}
filtered.push(m);}
this.filtered=filtered;this.fill();}
first_page(){this.set_page(0);}
prev_page(){this.set_page(this.page-1);}
next_page(){this.set_page(this.page+1);}
last_page(){this.set_page(this.filtered.length);}
set_page(page){if(page<0){page=0;}
if(page*this.paginate>=this.filtered.length){page=Math.ceil(this.filtered.length/this.paginate)-1;}
if(page!=this.page){this.page=page;this.fill();}}
fill(){var start=this.page*this.paginate;var end=start+this.paginate;var handler=this;this.pagecount=Math.ceil((this.filtered.length)/this.paginate);if(this.pagecount==1){this.pagediv.innerHTML=this.filtered.length+" elements.";}else{this.pagediv.innerHTML=this.filtered.length+" elements ("+this.pagecount+" pages of "+this.paginate+"). ";for(var p=0;p<this.pagecount;p++){var x=p;if(p==this.page){this.pagediv.append(document.createTextNode(" ["+(p+1)+"] "));}else{make_link(this.pagediv,""+(x+1),page_func(handler,p));}}}
this.container.innerHTML="";for(var m of this.filtered.slice(start,end)){var entry=this.data[m];var eelt=document.createElement("div");eelt.classList.add("entry");eelt.append(format_entry(entry));this.container.append(eelt);}}}
function page_func(handler,p){return function(){handler.set_page(p);}}
function value_matches_filter(v,regexp){if(v){return v.search(regexp)>=0;}
return false;}
function array_matches_filter(a,regexp){if(a){for(idx in a){if(value_matches_filter(a[idx],regexp))return true;}}
return false;}
function matches_filter(entry,regexp){return entry.title.search(regexp)>=0;}
function format_entry(entry){info=document.createElement("p")
info.innerHTML='<a href="'+entry.link+'"><b>'+entry.title+"</b></a>"+
'<br/><!--<time datetime="'+entry.date+'">'+entry.date+'</time>-->';return info;}