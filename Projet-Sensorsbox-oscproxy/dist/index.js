/**
 * @license
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
// @version: 0.3.3

window.Platform=window.Platform||{},window.logFlags=window.logFlags||{},function(a){var b=a.flags||{};location.search.slice(1).split("&").forEach(function(a){a=a.split("="),a[0]&&(b[a[0]]=a[1]||!0)});var c=document.currentScript||document.querySelector('script[src*="platform.js"]');if(c)for(var d,e=c.attributes,f=0;f<e.length;f++)d=e[f],"src"!==d.name&&(b[d.name]=d.value||!0);b.log&&b.log.split(",").forEach(function(a){window.logFlags[a]=!0}),b.shadow=b.shadow||b.shadowdom||b.polyfill,b.shadow="native"===b.shadow?!1:b.shadow||!HTMLElement.prototype.createShadowRoot,b.shadow&&document.querySelectorAll("script").length>1&&console.warn("platform.js is not the first script on the page. See http://www.polymer-project.org/docs/start/platform.html#setup for details."),b.register&&(window.CustomElements=window.CustomElements||{flags:{}},window.CustomElements.flags.register=b.register),b.imports&&(window.HTMLImports=window.HTMLImports||{flags:{}},window.HTMLImports.flags.imports=b.imports),a.flags=b}(Platform),"undefined"==typeof WeakMap&&!function(){var a=Object.defineProperty,b=Date.now()%1e9,c=function(){this.name="__st"+(1e9*Math.random()>>>0)+(b++ +"__")};c.prototype={set:function(b,c){var d=b[this.name];d&&d[0]===b?d[1]=c:a(b,this.name,{value:[b,c],writable:!0})},get:function(a){var b;return(b=a[this.name])&&b[0]===a?b[1]:void 0},"delete":function(a){this.set(a,void 0)}},window.WeakMap=c}(),function(global){"use strict";function detectObjectObserve(){function a(a){b=a}if("function"!=typeof Object.observe||"function"!=typeof Array.observe)return!1;var b=[],c={},d=[];return Object.observe(c,a),Array.observe(d,a),c.id=1,c.id=2,delete c.id,d.push(1,2),d.length=0,Object.deliverChangeRecords(a),5!==b.length?!1:"add"!=b[0].type||"update"!=b[1].type||"delete"!=b[2].type||"splice"!=b[3].type||"splice"!=b[4].type?!1:(Object.unobserve(c,a),Array.unobserve(d,a),!0)}function detectEval(){if("undefined"!=typeof chrome&&chrome.app&&chrome.app.runtime)return!1;try{var a=new Function("","return true;");return a()}catch(b){return!1}}function isIndex(a){return+a===a>>>0}function toNumber(a){return+a}function isObject(a){return a===Object(a)}function areSameValue(a,b){return a===b?0!==a||1/a===1/b:numberIsNaN(a)&&numberIsNaN(b)?!0:a!==a&&b!==b}function getPathCharType(a){if(void 0===a)return"eof";var b=a.charCodeAt(0);switch(b){case 91:case 93:case 46:case 34:case 39:case 48:return a;case 95:case 36:return"ident";case 32:case 9:case 10:case 13:case 160:case 65279:case 8232:case 8233:return"ws"}return b>=97&&122>=b||b>=65&&90>=b?"ident":b>=49&&57>=b?"number":"else"}function noop(){}function parsePath(a){function b(){if(!(k>=a.length)){var b=a[k+1];return"inSingleQuote"==l&&"'"==b||"inDoubleQuote"==l&&'"'==b?(k++,d=b,m.append(),!0):void 0}}for(var c,d,e,f,g,h,i,j=[],k=-1,l="beforePath",m={push:function(){void 0!==e&&(j.push(e),e=void 0)},append:function(){void 0===e?e=d:e+=d}};l;)if(k++,c=a[k],"\\"!=c||!b(l)){if(f=getPathCharType(c),i=pathStateMachine[l],g=i[f]||i["else"]||"error","error"==g)return;if(l=g[0],h=m[g[1]]||noop,d=void 0===g[2]?c:g[2],h(),"afterPath"===l)return j}}function isIdent(a){return identRegExp.test(a)}function Path(a,b){if(b!==constructorIsPrivate)throw Error("Use Path.get to retrieve path objects");a.length&&Array.prototype.push.apply(this,a.slice()),hasEval&&this.length&&(this.getValueFrom=this.compiledGetValueFromFn())}function getPath(a){if(a instanceof Path)return a;if((null==a||0==a.length)&&(a=""),"string"!=typeof a){if(isIndex(a.length))return new Path(a,constructorIsPrivate);a=String(a)}var b=pathCache[a];if(b)return b;var c=parsePath(a);if(!c)return invalidPath;var b=new Path(c,constructorIsPrivate);return pathCache[a]=b,b}function formatAccessor(a){return isIndex(a)?"["+a+"]":'["'+a.replace(/"/g,'\\"')+'"]'}function dirtyCheck(a){for(var b=0;MAX_DIRTY_CHECK_CYCLES>b&&a.check_();)b++;return global.testingExposeCycleCount&&(global.dirtyCheckCycleCount=b),b>0}function objectIsEmpty(a){for(var b in a)return!1;return!0}function diffIsEmpty(a){return objectIsEmpty(a.added)&&objectIsEmpty(a.removed)&&objectIsEmpty(a.changed)}function diffObjectFromOldObject(a,b){var c={},d={},e={};for(var f in b){var g=a[f];(void 0===g||g!==b[f])&&(f in a?g!==b[f]&&(e[f]=g):d[f]=void 0)}for(var f in a)f in b||(c[f]=a[f]);return Array.isArray(a)&&a.length!==b.length&&(e.length=a.length),{added:c,removed:d,changed:e}}function runEOMTasks(){if(!eomTasks.length)return!1;for(var a=0;a<eomTasks.length;a++)eomTasks[a]();return eomTasks.length=0,!0}function newObservedObject(){function a(a){b&&b.state_===OPENED&&!d&&b.check_(a)}var b,c,d=!1,e=!0;return{open:function(c){if(b)throw Error("ObservedObject in use");e||Object.deliverChangeRecords(a),b=c,e=!1},observe:function(b,d){c=b,d?Array.observe(c,a):Object.observe(c,a)},deliver:function(b){d=b,Object.deliverChangeRecords(a),d=!1},close:function(){b=void 0,Object.unobserve(c,a),observedObjectCache.push(this)}}}function getObservedObject(a,b,c){var d=observedObjectCache.pop()||newObservedObject();return d.open(a),d.observe(b,c),d}function newObservedSet(){function a(b,f){b&&(b===d&&(e[f]=!0),h.indexOf(b)<0&&(h.push(b),Object.observe(b,c)),a(Object.getPrototypeOf(b),f))}function b(a){for(var b=0;b<a.length;b++){var c=a[b];if(c.object!==d||e[c.name]||"setPrototype"===c.type)return!1}return!0}function c(c){if(!b(c)){for(var d,e=0;e<g.length;e++)d=g[e],d.state_==OPENED&&d.iterateObjects_(a);for(var e=0;e<g.length;e++)d=g[e],d.state_==OPENED&&d.check_()}}var d,e,f=0,g=[],h=[],i={object:void 0,objects:h,open:function(b,c){d||(d=c,e={}),g.push(b),f++,b.iterateObjects_(a)},close:function(){if(f--,!(f>0)){for(var a=0;a<h.length;a++)Object.unobserve(h[a],c),Observer.unobservedCount++;g.length=0,h.length=0,d=void 0,e=void 0,observedSetCache.push(this)}}};return i}function getObservedSet(a,b){return lastObservedSet&&lastObservedSet.object===b||(lastObservedSet=observedSetCache.pop()||newObservedSet(),lastObservedSet.object=b),lastObservedSet.open(a,b),lastObservedSet}function Observer(){this.state_=UNOPENED,this.callback_=void 0,this.target_=void 0,this.directObserver_=void 0,this.value_=void 0,this.id_=nextObserverId++}function addToAll(a){Observer._allObserversCount++,collectObservers&&allObservers.push(a)}function removeFromAll(){Observer._allObserversCount--}function ObjectObserver(a){Observer.call(this),this.value_=a,this.oldObject_=void 0}function ArrayObserver(a){if(!Array.isArray(a))throw Error("Provided object is not an Array");ObjectObserver.call(this,a)}function PathObserver(a,b){Observer.call(this),this.object_=a,this.path_=getPath(b),this.directObserver_=void 0}function CompoundObserver(a){Observer.call(this),this.reportChangesOnOpen_=a,this.value_=[],this.directObserver_=void 0,this.observed_=[]}function identFn(a){return a}function ObserverTransform(a,b,c,d){this.callback_=void 0,this.target_=void 0,this.value_=void 0,this.observable_=a,this.getValueFn_=b||identFn,this.setValueFn_=c||identFn,this.dontPassThroughSet_=d}function diffObjectFromChangeRecords(a,b,c){for(var d={},e={},f=0;f<b.length;f++){var g=b[f];expectedRecordTypes[g.type]?(g.name in c||(c[g.name]=g.oldValue),"update"!=g.type&&("add"!=g.type?g.name in d?(delete d[g.name],delete c[g.name]):e[g.name]=!0:g.name in e?delete e[g.name]:d[g.name]=!0)):(console.error("Unknown changeRecord type: "+g.type),console.error(g))}for(var h in d)d[h]=a[h];for(var h in e)e[h]=void 0;var i={};for(var h in c)if(!(h in d||h in e)){var j=a[h];c[h]!==j&&(i[h]=j)}return{added:d,removed:e,changed:i}}function newSplice(a,b,c){return{index:a,removed:b,addedCount:c}}function ArraySplice(){}function calcSplices(a,b,c,d,e,f){return arraySplice.calcSplices(a,b,c,d,e,f)}function intersect(a,b,c,d){return c>b||a>d?-1:b==c||d==a?0:c>a?d>b?b-c:d-c:b>d?d-a:b-a}function mergeSplice(a,b,c,d){for(var e=newSplice(b,c,d),f=!1,g=0,h=0;h<a.length;h++){var i=a[h];if(i.index+=g,!f){var j=intersect(e.index,e.index+e.removed.length,i.index,i.index+i.addedCount);if(j>=0){a.splice(h,1),h--,g-=i.addedCount-i.removed.length,e.addedCount+=i.addedCount-j;var k=e.removed.length+i.removed.length-j;if(e.addedCount||k){var c=i.removed;if(e.index<i.index){var l=e.removed.slice(0,i.index-e.index);Array.prototype.push.apply(l,c),c=l}if(e.index+e.removed.length>i.index+i.addedCount){var m=e.removed.slice(i.index+i.addedCount-e.index);Array.prototype.push.apply(c,m)}e.removed=c,i.index<e.index&&(e.index=i.index)}else f=!0}else if(e.index<i.index){f=!0,a.splice(h,0,e),h++;var n=e.addedCount-e.removed.length;i.index+=n,g+=n}}}f||a.push(e)}function createInitialSplices(a,b){for(var c=[],d=0;d<b.length;d++){var e=b[d];switch(e.type){case"splice":mergeSplice(c,e.index,e.removed.slice(),e.addedCount);break;case"add":case"update":case"delete":if(!isIndex(e.name))continue;var f=toNumber(e.name);if(0>f)continue;mergeSplice(c,f,[e.oldValue],1);break;default:console.error("Unexpected record type: "+JSON.stringify(e))}}return c}function projectArraySplices(a,b){var c=[];return createInitialSplices(a,b).forEach(function(b){return 1==b.addedCount&&1==b.removed.length?void(b.removed[0]!==a[b.index]&&c.push(b)):void(c=c.concat(calcSplices(a,b.index,b.index+b.addedCount,b.removed,0,b.removed.length)))}),c}var hasObserve=detectObjectObserve(),hasEval=detectEval(),numberIsNaN=global.Number.isNaN||function(a){return"number"==typeof a&&global.isNaN(a)},createObject="__proto__"in{}?function(a){return a}:function(a){var b=a.__proto__;if(!b)return a;var c=Object.create(b);return Object.getOwnPropertyNames(a).forEach(function(b){Object.defineProperty(c,b,Object.getOwnPropertyDescriptor(a,b))}),c},identStart="[$_a-zA-Z]",identPart="[$_a-zA-Z0-9]",identRegExp=new RegExp("^"+identStart+"+"+identPart+"*$"),pathStateMachine={beforePath:{ws:["beforePath"],ident:["inIdent","append"],"[":["beforeElement"],eof:["afterPath"]},inPath:{ws:["inPath"],".":["beforeIdent"],"[":["beforeElement"],eof:["afterPath"]},beforeIdent:{ws:["beforeIdent"],ident:["inIdent","append"]},inIdent:{ident:["inIdent","append"],0:["inIdent","append"],number:["inIdent","append"],ws:["inPath","push"],".":["beforeIdent","push"],"[":["beforeElement","push"],eof:["afterPath","push"]},beforeElement:{ws:["beforeElement"],0:["afterZero","append"],number:["inIndex","append"],"'":["inSingleQuote","append",""],'"':["inDoubleQuote","append",""]},afterZero:{ws:["afterElement","push"],"]":["inPath","push"]},inIndex:{0:["inIndex","append"],number:["inIndex","append"],ws:["afterElement"],"]":["inPath","push"]},inSingleQuote:{"'":["afterElement"],eof:["error"],"else":["inSingleQuote","append"]},inDoubleQuote:{'"':["afterElement"],eof:["error"],"else":["inDoubleQuote","append"]},afterElement:{ws:["afterElement"],"]":["inPath","push"]}},constructorIsPrivate={},pathCache={};Path.get=getPath,Path.prototype=createObject({__proto__:[],valid:!0,toString:function(){for(var a="",b=0;b<this.length;b++){var c=this[b];a+=isIdent(c)?b?"."+c:c:formatAccessor(c)}return a},getValueFrom:function(a){for(var b=0;b<this.length;b++){if(null==a)return;a=a[this[b]]}return a},iterateObjects:function(a,b){for(var c=0;c<this.length;c++){if(c&&(a=a[this[c-1]]),!isObject(a))return;b(a,this[0])}},compiledGetValueFromFn:function(){var a="",b="obj";a+="if (obj != null";for(var c,d=0;d<this.length-1;d++)c=this[d],b+=isIdent(c)?"."+c:formatAccessor(c),a+=" &&\n     "+b+" != null";a+=")\n";var c=this[d];return b+=isIdent(c)?"."+c:formatAccessor(c),a+="  return "+b+";\nelse\n  return undefined;",new Function("obj",a)},setValueFrom:function(a,b){if(!this.length)return!1;for(var c=0;c<this.length-1;c++){if(!isObject(a))return!1;a=a[this[c]]}return isObject(a)?(a[this[c]]=b,!0):!1}});var invalidPath=new Path("",constructorIsPrivate);invalidPath.valid=!1,invalidPath.getValueFrom=invalidPath.setValueFrom=function(){};var MAX_DIRTY_CHECK_CYCLES=1e3,eomTasks=[],runEOM=hasObserve?function(){var a={pingPong:!0},b=!1;return Object.observe(a,function(){runEOMTasks(),b=!1}),function(c){eomTasks.push(c),b||(b=!0,a.pingPong=!a.pingPong)}}():function(){return function(a){eomTasks.push(a)}}(),observedObjectCache=[],observedSetCache=[],lastObservedSet,UNOPENED=0,OPENED=1,CLOSED=2,RESETTING=3,nextObserverId=1;Observer.prototype={open:function(a,b){if(this.state_!=UNOPENED)throw Error("Observer has already been opened.");return addToAll(this),this.callback_=a,this.target_=b,this.connect_(),this.state_=OPENED,this.value_},close:function(){this.state_==OPENED&&(removeFromAll(this),this.disconnect_(),this.value_=void 0,this.callback_=void 0,this.target_=void 0,this.state_=CLOSED)},deliver:function(){this.state_==OPENED&&dirtyCheck(this)},report_:function(a){try{this.callback_.apply(this.target_,a)}catch(b){Observer._errorThrownDuringCallback=!0,console.error("Exception caught during observer callback: "+(b.stack||b))}},discardChanges:function(){return this.check_(void 0,!0),this.value_}};var collectObservers=!hasObserve,allObservers;Observer._allObserversCount=0,collectObservers&&(allObservers=[]);var runningMicrotaskCheckpoint=!1,hasDebugForceFullDelivery=hasObserve&&function(){try{return eval("%RunMicrotasks()"),!0}catch(ex){return!1}}();global.Platform=global.Platform||{},global.Platform.performMicrotaskCheckpoint=function(){if(!runningMicrotaskCheckpoint){if(hasDebugForceFullDelivery)return void eval("%RunMicrotasks()");if(collectObservers){runningMicrotaskCheckpoint=!0;var cycles=0,anyChanged,toCheck;do{cycles++,toCheck=allObservers,allObservers=[],anyChanged=!1;for(var i=0;i<toCheck.length;i++){var observer=toCheck[i];observer.state_==OPENED&&(observer.check_()&&(anyChanged=!0),allObservers.push(observer))}runEOMTasks()&&(anyChanged=!0)}while(MAX_DIRTY_CHECK_CYCLES>cycles&&anyChanged);global.testingExposeCycleCount&&(global.dirtyCheckCycleCount=cycles),runningMicrotaskCheckpoint=!1}}},collectObservers&&(global.Platform.clearObservers=function(){allObservers=[]}),ObjectObserver.prototype=createObject({__proto__:Observer.prototype,arrayObserve:!1,connect_:function(){hasObserve?this.directObserver_=getObservedObject(this,this.value_,this.arrayObserve):this.oldObject_=this.copyObject(this.value_)},copyObject:function(a){var b=Array.isArray(a)?[]:{};for(var c in a)b[c]=a[c];return Array.isArray(a)&&(b.length=a.length),b},check_:function(a){var b,c;if(hasObserve){if(!a)return!1;c={},b=diffObjectFromChangeRecords(this.value_,a,c)}else c=this.oldObject_,b=diffObjectFromOldObject(this.value_,this.oldObject_);return diffIsEmpty(b)?!1:(hasObserve||(this.oldObject_=this.copyObject(this.value_)),this.report_([b.added||{},b.removed||{},b.changed||{},function(a){return c[a]}]),!0)},disconnect_:function(){hasObserve?(this.directObserver_.close(),this.directObserver_=void 0):this.oldObject_=void 0},deliver:function(){this.state_==OPENED&&(hasObserve?this.directObserver_.deliver(!1):dirtyCheck(this))},discardChanges:function(){return this.directObserver_?this.directObserver_.deliver(!0):this.oldObject_=this.copyObject(this.value_),this.value_}}),ArrayObserver.prototype=createObject({__proto__:ObjectObserver.prototype,arrayObserve:!0,copyObject:function(a){return a.slice()},check_:function(a){var b;if(hasObserve){if(!a)return!1;b=projectArraySplices(this.value_,a)}else b=calcSplices(this.value_,0,this.value_.length,this.oldObject_,0,this.oldObject_.length);return b&&b.length?(hasObserve||(this.oldObject_=this.copyObject(this.value_)),this.report_([b]),!0):!1}}),ArrayObserver.applySplices=function(a,b,c){c.forEach(function(c){for(var d=[c.index,c.removed.length],e=c.index;e<c.index+c.addedCount;)d.push(b[e]),e++;Array.prototype.splice.apply(a,d)})},PathObserver.prototype=createObject({__proto__:Observer.prototype,get path(){return this.path_},connect_:function(){hasObserve&&(this.directObserver_=getObservedSet(this,this.object_)),this.check_(void 0,!0)},disconnect_:function(){this.value_=void 0,this.directObserver_&&(this.directObserver_.close(this),this.directObserver_=void 0)},iterateObjects_:function(a){this.path_.iterateObjects(this.object_,a)},check_:function(a,b){var c=this.value_;return this.value_=this.path_.getValueFrom(this.object_),b||areSameValue(this.value_,c)?!1:(this.report_([this.value_,c,this]),!0)},setValue:function(a){this.path_&&this.path_.setValueFrom(this.object_,a)}});var observerSentinel={};CompoundObserver.prototype=createObject({__proto__:Observer.prototype,connect_:function(){if(hasObserve){for(var a,b=!1,c=0;c<this.observed_.length;c+=2)if(a=this.observed_[c],a!==observerSentinel){b=!0;break}b&&(this.directObserver_=getObservedSet(this,a))}this.check_(void 0,!this.reportChangesOnOpen_)},disconnect_:function(){for(var a=0;a<this.observed_.length;a+=2)this.observed_[a]===observerSentinel&&this.observed_[a+1].close();this.observed_.length=0,this.value_.length=0,this.directObserver_&&(this.directObserver_.close(this),this.directObserver_=void 0)},addPath:function(a,b){if(this.state_!=UNOPENED&&this.state_!=RESETTING)throw Error("Cannot add paths once started.");var b=getPath(b);if(this.observed_.push(a,b),this.reportChangesOnOpen_){var c=this.observed_.length/2-1;this.value_[c]=b.getValueFrom(a)}},addObserver:function(a){if(this.state_!=UNOPENED&&this.state_!=RESETTING)throw Error("Cannot add observers once started.");if(this.observed_.push(observerSentinel,a),this.reportChangesOnOpen_){var b=this.observed_.length/2-1;this.value_[b]=a.open(this.deliver,this)}},startReset:function(){if(this.state_!=OPENED)throw Error("Can only reset while open");this.state_=RESETTING,this.disconnect_()},finishReset:function(){if(this.state_!=RESETTING)throw Error("Can only finishReset after startReset");return this.state_=OPENED,this.connect_(),this.value_},iterateObjects_:function(a){for(var b,c=0;c<this.observed_.length;c+=2)b=this.observed_[c],b!==observerSentinel&&this.observed_[c+1].iterateObjects(b,a)},check_:function(a,b){for(var c,d=0;d<this.observed_.length;d+=2){var e,f=this.observed_[d],g=this.observed_[d+1];if(f===observerSentinel){var h=g;e=this.state_===UNOPENED?h.open(this.deliver,this):h.discardChanges()}else e=g.getValueFrom(f);b?this.value_[d/2]=e:areSameValue(e,this.value_[d/2])||(c=c||[],c[d/2]=this.value_[d/2],this.value_[d/2]=e)}return c?(this.report_([this.value_,c,this.observed_]),!0):!1}}),ObserverTransform.prototype={open:function(a,b){return this.callback_=a,this.target_=b,this.value_=this.getValueFn_(this.observable_.open(this.observedCallback_,this)),this.value_},observedCallback_:function(a){if(a=this.getValueFn_(a),!areSameValue(a,this.value_)){var b=this.value_;this.value_=a,this.callback_.call(this.target_,this.value_,b)}},discardChanges:function(){return this.value_=this.getValueFn_(this.observable_.discardChanges()),this.value_},deliver:function(){return this.observable_.deliver()},setValue:function(a){return a=this.setValueFn_(a),!this.dontPassThroughSet_&&this.observable_.setValue?this.observable_.setValue(a):void 0},close:function(){this.observable_&&this.observable_.close(),this.callback_=void 0,this.target_=void 0,this.observable_=void 0,this.value_=void 0,this.getValueFn_=void 0,this.setValueFn_=void 0}};var expectedRecordTypes={add:!0,update:!0,"delete":!0},EDIT_LEAVE=0,EDIT_UPDATE=1,EDIT_ADD=2,EDIT_DELETE=3;ArraySplice.prototype={calcEditDistances:function(a,b,c,d,e,f){for(var g=f-e+1,h=c-b+1,i=new Array(g),j=0;g>j;j++)i[j]=new Array(h),i[j][0]=j;for(var k=0;h>k;k++)i[0][k]=k;for(var j=1;g>j;j++)for(var k=1;h>k;k++)if(this.equals(a[b+k-1],d[e+j-1]))i[j][k]=i[j-1][k-1];else{var l=i[j-1][k]+1,m=i[j][k-1]+1;i[j][k]=m>l?l:m}return i},spliceOperationsFromEditDistances:function(a){for(var b=a.length-1,c=a[0].length-1,d=a[b][c],e=[];b>0||c>0;)if(0!=b)if(0!=c){var f,g=a[b-1][c-1],h=a[b-1][c],i=a[b][c-1];f=i>h?g>h?h:g:g>i?i:g,f==g?(g==d?e.push(EDIT_LEAVE):(e.push(EDIT_UPDATE),d=g),b--,c--):f==h?(e.push(EDIT_DELETE),b--,d=h):(e.push(EDIT_ADD),c--,d=i)}else e.push(EDIT_DELETE),b--;else e.push(EDIT_ADD),c--;return e.reverse(),e},calcSplices:function(a,b,c,d,e,f){var g=0,h=0,i=Math.min(c-b,f-e);if(0==b&&0==e&&(g=this.sharedPrefix(a,d,i)),c==a.length&&f==d.length&&(h=this.sharedSuffix(a,d,i-g)),b+=g,e+=g,c-=h,f-=h,c-b==0&&f-e==0)return[];if(b==c){for(var j=newSplice(b,[],0);f>e;)j.removed.push(d[e++]);return[j]}if(e==f)return[newSplice(b,[],c-b)];for(var k=this.spliceOperationsFromEditDistances(this.calcEditDistances(a,b,c,d,e,f)),j=void 0,l=[],m=b,n=e,o=0;o<k.length;o++)switch(k[o]){case EDIT_LEAVE:j&&(l.push(j),j=void 0),m++,n++;break;case EDIT_UPDATE:j||(j=newSplice(m,[],0)),j.addedCount++,m++,j.removed.push(d[n]),n++;break;case EDIT_ADD:j||(j=newSplice(m,[],0)),j.addedCount++,m++;break;case EDIT_DELETE:j||(j=newSplice(m,[],0)),j.removed.push(d[n]),n++}return j&&l.push(j),l},sharedPrefix:function(a,b,c){for(var d=0;c>d;d++)if(!this.equals(a[d],b[d]))return d;return c},sharedSuffix:function(a,b,c){for(var d=a.length,e=b.length,f=0;c>f&&this.equals(a[--d],b[--e]);)f++;return f},calculateSplices:function(a,b){return this.calcSplices(a,0,a.length,b,0,b.length)},equals:function(a,b){return a===b}};var arraySplice=new ArraySplice;global.Observer=Observer,global.Observer.runEOM_=runEOM,global.Observer.observerSentinel_=observerSentinel,global.Observer.hasObjectObserve=hasObserve,global.ArrayObserver=ArrayObserver,global.ArrayObserver.calculateSplices=function(a,b){return arraySplice.calculateSplices(a,b)},global.ArraySplice=ArraySplice,global.ObjectObserver=ObjectObserver,global.PathObserver=PathObserver,global.CompoundObserver=CompoundObserver,global.Path=Path,global.ObserverTransform=ObserverTransform}("undefined"!=typeof global&&global&&"undefined"!=typeof module&&module?global:this||window),Platform.flags.shadow?(window.ShadowDOMPolyfill={},function(a){"use strict";function b(){if("undefined"!=typeof chrome&&chrome.app&&chrome.app.runtime)return!1;try{var a=new Function("return true;");return a()}catch(b){return!1}}function c(a){if(!a)throw new Error("Assertion failed")}function d(a,b){for(var c=L(b),d=0;d<c.length;d++){var e=c[d];K(a,e,M(b,e))}return a}function e(a,b){for(var c=L(b),d=0;d<c.length;d++){var e=c[d];switch(e){case"arguments":case"caller":case"length":case"name":case"prototype":case"toString":continue}K(a,e,M(b,e))}return a}function f(a,b){for(var c=0;c<b.length;c++)if(b[c]in a)return b[c]}function g(a,b,c){N.value=c,K(a,b,N)}function h(a){var b=a.__proto__||Object.getPrototypeOf(a),c=G.get(b);if(c)return c;var d=h(b),e=v(d);return s(b,e,a),e}function i(a,b){q(a,b,!0)}function j(a,b){q(b,a,!1)}function k(a){return/^on[a-z]+$/.test(a)}function l(a){return/^\w[a-zA-Z_0-9]*$/.test(a)}function m(a){return J&&l(a)?new Function("return this.impl."+a):function(){return this.impl[a]}}function n(a){return J&&l(a)?new Function("v","this.impl."+a+" = v"):function(b){this.impl[a]=b}}function o(a){return J&&l(a)?new Function("return this.impl."+a+".apply(this.impl, arguments)"):function(){return this.impl[a].apply(this.impl,arguments)}}function p(a,b){try{return Object.getOwnPropertyDescriptor(a,b)}catch(c){return P}}function q(b,c,d){for(var e=L(b),f=0;f<e.length;f++){var g=e[f];if("polymerBlackList_"!==g&&!(g in c||b.polymerBlackList_&&b.polymerBlackList_[g])){O&&b.__lookupGetter__(g);var h,i,j=p(b,g);if(d&&"function"==typeof j.value)c[g]=o(g);else{var l=k(g);h=l?a.getEventHandlerGetter(g):m(g),(j.writable||j.set)&&(i=l?a.getEventHandlerSetter(g):n(g)),K(c,g,{get:h,set:i,configurable:j.configurable,enumerable:j.enumerable})}}}}function r(a,b,c){var d=a.prototype;s(d,b,c),e(b,a)}function s(a,b,d){var e=b.prototype;c(void 0===G.get(a)),G.set(a,b),H.set(e,a),i(a,e),d&&j(e,d),g(e,"constructor",b),b.prototype=e}function t(a,b){return G.get(b.prototype)===a}function u(a){var b=Object.getPrototypeOf(a),c=h(b),d=v(c);return s(b,d,a),d}function v(a){function b(b){a.call(this,b)}var c=Object.create(a.prototype);return c.constructor=b,b.prototype=c,b}function w(a){return a instanceof I.EventTarget||a instanceof I.Event||a instanceof I.Range||a instanceof I.DOMImplementation||a instanceof I.CanvasRenderingContext2D||I.WebGLRenderingContext&&a instanceof I.WebGLRenderingContext}function x(a){return R&&a instanceof R||a instanceof T||a instanceof S||a instanceof U||a instanceof V||a instanceof Q||a instanceof W||X&&a instanceof X||Y&&a instanceof Y}function y(a){return null===a?null:(c(x(a)),a.polymerWrapper_||(a.polymerWrapper_=new(h(a))(a)))}function z(a){return null===a?null:(c(w(a)),a.impl)}function A(a){return a&&w(a)?z(a):a}function B(a){return a&&!w(a)?y(a):a}function C(a,b){null!==b&&(c(x(a)),c(void 0===b||w(b)),a.polymerWrapper_=b)}function D(a,b,c){Z.get=c,K(a.prototype,b,Z)}function E(a,b){D(a,b,function(){return y(this.impl[b])})}function F(a,b){a.forEach(function(a){b.forEach(function(b){a.prototype[b]=function(){var a=B(this);return a[b].apply(a,arguments)}})})}var G=new WeakMap,H=new WeakMap,I=Object.create(null),J=b(),K=Object.defineProperty,L=Object.getOwnPropertyNames,M=Object.getOwnPropertyDescriptor,N={value:void 0,configurable:!0,enumerable:!1,writable:!0};L(window);var O=/Firefox/.test(navigator.userAgent),P={get:function(){},set:function(){},configurable:!0,enumerable:!0},Q=window.DOMImplementation,R=window.EventTarget,S=window.Event,T=window.Node,U=window.Window,V=window.Range,W=window.CanvasRenderingContext2D,X=window.WebGLRenderingContext,Y=window.SVGElementInstance,Z={get:void 0,configurable:!0,enumerable:!0};a.assert=c,a.constructorTable=G,a.defineGetter=D,a.defineWrapGetter=E,a.forwardMethodsToWrapper=F,a.isWrapper=w,a.isWrapperFor=t,a.mixin=d,a.nativePrototypeTable=H,a.oneOf=f,a.registerObject=u,a.registerWrapper=r,a.rewrap=C,a.unwrap=z,a.unwrapIfNeeded=A,a.wrap=y,a.wrapIfNeeded=B,a.wrappers=I}(window.ShadowDOMPolyfill),function(a){"use strict";function b(){g=!1;var a=f.slice(0);f=[];for(var b=0;b<a.length;b++)a[b]()}function c(a){f.push(a),g||(g=!0,d(b,0))}var d,e=window.MutationObserver,f=[],g=!1;if(e){var h=1,i=new e(b),j=document.createTextNode(h);i.observe(j,{characterData:!0}),d=function(){h=(h+1)%2,j.data=h}}else d=window.setImmediate||window.setTimeout;a.setEndOfMicrotask=c}(window.ShadowDOMPolyfill),function(a){"use strict";function b(){p||(k(c),p=!0)}function c(){p=!1;do for(var a=o.slice(),b=!1,c=0;c<a.length;c++){var d=a[c],e=d.takeRecords();f(d),e.length&&(d.callback_(e,d),b=!0)}while(b)}function d(a,b){this.type=a,this.target=b,this.addedNodes=new m.NodeList,this.removedNodes=new m.NodeList,this.previousSibling=null,this.nextSibling=null,this.attributeName=null,this.attributeNamespace=null,this.oldValue=null}function e(a,b){for(;a;a=a.parentNode){var c=n.get(a);if(c)for(var d=0;d<c.length;d++){var e=c[d];e.options.subtree&&e.addTransientObserver(b)}}}function f(a){for(var b=0;b<a.nodes_.length;b++){var c=a.nodes_[b],d=n.get(c);if(!d)return;for(var e=0;e<d.length;e++){var f=d[e];f.observer===a&&f.removeTransientObservers()}}}function g(a,c,e){for(var f=Object.create(null),g=Object.create(null),h=a;h;h=h.parentNode){var i=n.get(h);if(i)for(var j=0;j<i.length;j++){var k=i[j],l=k.options;if((h===a||l.subtree)&&!("attributes"===c&&!l.attributes||"attributes"===c&&l.attributeFilter&&(null!==e.namespace||-1===l.attributeFilter.indexOf(e.name))||"characterData"===c&&!l.characterData||"childList"===c&&!l.childList)){var m=k.observer;f[m.uid_]=m,("attributes"===c&&l.attributeOldValue||"characterData"===c&&l.characterDataOldValue)&&(g[m.uid_]=e.oldValue)}}}var o=!1;for(var p in f){var m=f[p],q=new d(c,a);"name"in e&&"namespace"in e&&(q.attributeName=e.name,q.attributeNamespace=e.namespace),e.addedNodes&&(q.addedNodes=e.addedNodes),e.removedNodes&&(q.removedNodes=e.removedNodes),e.previousSibling&&(q.previousSibling=e.previousSibling),e.nextSibling&&(q.nextSibling=e.nextSibling),void 0!==g[p]&&(q.oldValue=g[p]),m.records_.push(q),o=!0}o&&b()}function h(a){if(this.childList=!!a.childList,this.subtree=!!a.subtree,this.attributes="attributes"in a||!("attributeOldValue"in a||"attributeFilter"in a)?!!a.attributes:!0,this.characterData="characterDataOldValue"in a&&!("characterData"in a)?!0:!!a.characterData,!this.attributes&&(a.attributeOldValue||"attributeFilter"in a)||!this.characterData&&a.characterDataOldValue)throw new TypeError;if(this.characterData=!!a.characterData,this.attributeOldValue=!!a.attributeOldValue,this.characterDataOldValue=!!a.characterDataOldValue,"attributeFilter"in a){if(null==a.attributeFilter||"object"!=typeof a.attributeFilter)throw new TypeError;this.attributeFilter=q.call(a.attributeFilter)}else this.attributeFilter=null}function i(a){this.callback_=a,this.nodes_=[],this.records_=[],this.uid_=++r,o.push(this)}function j(a,b,c){this.observer=a,this.target=b,this.options=c,this.transientObservedNodes=[]}var k=a.setEndOfMicrotask,l=a.wrapIfNeeded,m=a.wrappers,n=new WeakMap,o=[],p=!1,q=Array.prototype.slice,r=0;i.prototype={observe:function(a,b){a=l(a);var c,d=new h(b),e=n.get(a);e||n.set(a,e=[]);for(var f=0;f<e.length;f++)e[f].observer===this&&(c=e[f],c.removeTransientObservers(),c.options=d);c||(c=new j(this,a,d),e.push(c),this.nodes_.push(a))},disconnect:function(){this.nodes_.forEach(function(a){for(var b=n.get(a),c=0;c<b.length;c++){var d=b[c];if(d.observer===this){b.splice(c,1);break}}},this),this.records_=[]},takeRecords:function(){var a=this.records_;return this.records_=[],a}},j.prototype={addTransientObserver:function(a){if(a!==this.target){this.transientObservedNodes.push(a);var b=n.get(a);b||n.set(a,b=[]),b.push(this)}},removeTransientObservers:function(){var a=this.transientObservedNodes;this.transientObservedNodes=[];for(var b=0;b<a.length;b++)for(var c=a[b],d=n.get(c),e=0;e<d.length;e++)if(d[e]===this){d.splice(e,1);break}}},a.enqueueMutation=g,a.registerTransientObservers=e,a.wrappers.MutationObserver=i,a.wrappers.MutationRecord=d}(window.ShadowDOMPolyfill),function(a){"use strict";function b(a,b){this.root=a,this.parent=b}function c(a,b){if(a.treeScope_!==b){a.treeScope_=b;for(var d=a.shadowRoot;d;d=d.olderShadowRoot)d.treeScope_.parent=b;for(var e=a.firstChild;e;e=e.nextSibling)c(e,b)}}function d(c){if(c instanceof a.wrappers.Window,c.treeScope_)return c.treeScope_;var e,f=c.parentNode;return e=f?d(f):new b(c,null),c.treeScope_=e}b.prototype={get renderer(){return this.root instanceof a.wrappers.ShadowRoot?a.getRendererForHost(this.root.host):null},contains:function(a){for(;a;a=a.parent)if(a===this)return!0;return!1}},a.TreeScope=b,a.getTreeScope=d,a.setTreeScope=c}(window.ShadowDOMPolyfill),function(a){"use strict";function b(a){return a instanceof Q.ShadowRoot}function c(a){return L(a).root}function d(a,d){var h=[],i=a;for(h.push(i);i;){var j=g(i);if(j&&j.length>0){for(var k=0;k<j.length;k++){var m=j[k];if(f(m)){var n=c(m),o=n.olderShadowRoot;o&&h.push(o)}h.push(m)}i=j[j.length-1]}else if(b(i)){if(l(a,i)&&e(d))break;i=i.host,h.push(i)}else i=i.parentNode,i&&h.push(i)}return h}function e(a){if(!a)return!1;switch(a.type){case"abort":case"error":case"select":case"change":case"load":case"reset":case"resize":case"scroll":case"selectstart":return!0}return!1}function f(a){return a instanceof HTMLShadowElement}function g(b){return a.getDestinationInsertionPoints(b)}function h(a,b){if(0===a.length)return b;b instanceof Q.Window&&(b=b.document);for(var c=L(b),d=a[0],e=L(d),f=j(c,e),g=0;g<a.length;g++){var h=a[g];if(L(h)===f)return h}return a[a.length-1]}function i(a){for(var b=[];a;a=a.parent)b.push(a);return b}function j(a,b){for(var c=i(a),d=i(b),e=null;c.length>0&&d.length>0;){var f=c.pop(),g=d.pop();if(f!==g)break;e=f}return e}function k(a,b,c){b instanceof Q.Window&&(b=b.document);var e,f=L(b),g=L(c),h=d(c,a),e=j(f,g);e||(e=g.root);for(var i=e;i;i=i.parent)for(var k=0;k<h.length;k++){var l=h[k];if(L(l)===i)return l}return null}function l(a,b){return L(a)===L(b)}function m(a){if(!S.get(a)&&(S.set(a,!0),n(P(a),P(a.target)),J)){var b=J;throw J=null,b}}function n(b,c){if(T.get(b))throw new Error("InvalidStateError");T.set(b,!0),a.renderAllPending();var e,f,g,h=b.type;if("load"===h&&!b.bubbles){var i=c;i instanceof Q.Document&&(g=i.defaultView)&&(f=i,e=[])}if(!e)if(c instanceof Q.Window)g=c,e=[];else if(e=d(c,b),"load"!==b.type){var i=e[e.length-1];i instanceof Q.Document&&(g=i.defaultView)}return _.set(b,e),o(b,e,g,f)&&p(b,e,g,f)&&q(b,e,g,f),X.set(b,ab),V.delete(b,null),T.delete(b),b.defaultPrevented
}function o(a,b,c,d){var e=bb;if(c&&!r(c,a,e,b,d))return!1;for(var f=b.length-1;f>0;f--)if(!r(b[f],a,e,b,d))return!1;return!0}function p(a,b,c,d){var e=cb,f=b[0]||c;return r(f,a,e,b,d)}function q(a,b,c,d){for(var e=db,f=1;f<b.length;f++)if(!r(b[f],a,e,b,d))return;c&&b.length>0&&r(c,a,e,b,d)}function r(a,b,c,d,e){var f=R.get(a);if(!f)return!0;var g=e||h(d,a);if(g===a){if(c===bb)return!0;c===db&&(c=cb)}else if(c===db&&!b.bubbles)return!0;if("relatedTarget"in b){var i=O(b),j=i.relatedTarget;if(j){if(j instanceof Object&&j.addEventListener){var l=P(j),m=k(b,a,l);if(m===g)return!0}else m=null;W.set(b,m)}}X.set(b,c);var n=b.type,o=!1;U.set(b,g),V.set(b,a),f.depth++;for(var p=0,q=f.length;q>p;p++){var r=f[p];if(r.removed)o=!0;else if(!(r.type!==n||!r.capture&&c===bb||r.capture&&c===db))try{if("function"==typeof r.handler?r.handler.call(a,b):r.handler.handleEvent(b),Z.get(b))return!1}catch(s){J||(J=s)}}if(f.depth--,o&&0===f.depth){var t=f.slice();f.length=0;for(var p=0;p<t.length;p++)t[p].removed||f.push(t[p])}return!Y.get(b)}function s(a,b,c){this.type=a,this.handler=b,this.capture=Boolean(c)}function t(a,b){if(!(a instanceof eb))return P(x(eb,"Event",a,b));var c=a;return pb||"beforeunload"!==c.type?void(this.impl=c):new y(c)}function u(a){return a&&a.relatedTarget?Object.create(a,{relatedTarget:{value:O(a.relatedTarget)}}):a}function v(a,b,c){var d=window[a],e=function(b,c){return b instanceof d?void(this.impl=b):P(x(d,a,b,c))};if(e.prototype=Object.create(b.prototype),c&&M(e.prototype,c),d)try{N(d,e,new d("temp"))}catch(f){N(d,e,document.createEvent(a))}return e}function w(a,b){return function(){arguments[b]=O(arguments[b]);var c=O(this);c[a].apply(c,arguments)}}function x(a,b,c,d){if(nb)return new a(c,u(d));var e=O(document.createEvent(b)),f=mb[b],g=[c];return Object.keys(f).forEach(function(a){var b=null!=d&&a in d?d[a]:f[a];"relatedTarget"===a&&(b=O(b)),g.push(b)}),e["init"+b].apply(e,g),e}function y(a){t.call(this,a)}function z(a){return"function"==typeof a?!0:a&&a.handleEvent}function A(a){switch(a){case"DOMAttrModified":case"DOMAttributeNameChanged":case"DOMCharacterDataModified":case"DOMElementNameChanged":case"DOMNodeInserted":case"DOMNodeInsertedIntoDocument":case"DOMNodeRemoved":case"DOMNodeRemovedFromDocument":case"DOMSubtreeModified":return!0}return!1}function B(a){this.impl=a}function C(a){return a instanceof Q.ShadowRoot&&(a=a.host),O(a)}function D(a,b){var c=R.get(a);if(c)for(var d=0;d<c.length;d++)if(!c[d].removed&&c[d].type===b)return!0;return!1}function E(a,b){for(var c=O(a);c;c=c.parentNode)if(D(P(c),b))return!0;return!1}function F(a){K(a,rb)}function G(b,c,e,f){a.renderAllPending();var g=P(sb.call(c.impl,e,f));if(!g)return null;var i=d(g,null),j=i.lastIndexOf(b);return-1==j?null:(i=i.slice(0,j),h(i,b))}function H(a){return function(){var b=$.get(this);return b&&b[a]&&b[a].value||null}}function I(a){var b=a.slice(2);return function(c){var d=$.get(this);d||(d=Object.create(null),$.set(this,d));var e=d[a];if(e&&this.removeEventListener(b,e.wrapped,!1),"function"==typeof c){var f=function(b){var d=c.call(this,b);d===!1?b.preventDefault():"onbeforeunload"===a&&"string"==typeof d&&(b.returnValue=d)};this.addEventListener(b,f,!1),d[a]={value:c,wrapped:f}}}}var J,K=a.forwardMethodsToWrapper,L=a.getTreeScope,M=a.mixin,N=a.registerWrapper,O=a.unwrap,P=a.wrap,Q=a.wrappers,R=(new WeakMap,new WeakMap),S=new WeakMap,T=new WeakMap,U=new WeakMap,V=new WeakMap,W=new WeakMap,X=new WeakMap,Y=new WeakMap,Z=new WeakMap,$=new WeakMap,_=new WeakMap,ab=0,bb=1,cb=2,db=3;s.prototype={equals:function(a){return this.handler===a.handler&&this.type===a.type&&this.capture===a.capture},get removed(){return null===this.handler},remove:function(){this.handler=null}};var eb=window.Event;eb.prototype.polymerBlackList_={returnValue:!0,keyLocation:!0},t.prototype={get target(){return U.get(this)},get currentTarget(){return V.get(this)},get eventPhase(){return X.get(this)},get path(){var a=_.get(this);return a?a.slice():[]},stopPropagation:function(){Y.set(this,!0)},stopImmediatePropagation:function(){Y.set(this,!0),Z.set(this,!0)}},N(eb,t,document.createEvent("Event"));var fb=v("UIEvent",t),gb=v("CustomEvent",t),hb={get relatedTarget(){var a=W.get(this);return void 0!==a?a:P(O(this).relatedTarget)}},ib=M({initMouseEvent:w("initMouseEvent",14)},hb),jb=M({initFocusEvent:w("initFocusEvent",5)},hb),kb=v("MouseEvent",fb,ib),lb=v("FocusEvent",fb,jb),mb=Object.create(null),nb=function(){try{new window.FocusEvent("focus")}catch(a){return!1}return!0}();if(!nb){var ob=function(a,b,c){if(c){var d=mb[c];b=M(M({},d),b)}mb[a]=b};ob("Event",{bubbles:!1,cancelable:!1}),ob("CustomEvent",{detail:null},"Event"),ob("UIEvent",{view:null,detail:0},"Event"),ob("MouseEvent",{screenX:0,screenY:0,clientX:0,clientY:0,ctrlKey:!1,altKey:!1,shiftKey:!1,metaKey:!1,button:0,relatedTarget:null},"UIEvent"),ob("FocusEvent",{relatedTarget:null},"UIEvent")}var pb=window.BeforeUnloadEvent;y.prototype=Object.create(t.prototype),M(y.prototype,{get returnValue(){return this.impl.returnValue},set returnValue(a){this.impl.returnValue=a}}),pb&&N(pb,y);var qb=window.EventTarget,rb=["addEventListener","removeEventListener","dispatchEvent"];[Node,Window].forEach(function(a){var b=a.prototype;rb.forEach(function(a){Object.defineProperty(b,a+"_",{value:b[a]})})}),B.prototype={addEventListener:function(a,b,c){if(z(b)&&!A(a)){var d=new s(a,b,c),e=R.get(this);if(e){for(var f=0;f<e.length;f++)if(d.equals(e[f]))return}else e=[],e.depth=0,R.set(this,e);e.push(d);var g=C(this);g.addEventListener_(a,m,!0)}},removeEventListener:function(a,b,c){c=Boolean(c);var d=R.get(this);if(d){for(var e=0,f=!1,g=0;g<d.length;g++)d[g].type===a&&d[g].capture===c&&(e++,d[g].handler===b&&(f=!0,d[g].remove()));if(f&&1===e){var h=C(this);h.removeEventListener_(a,m,!0)}}},dispatchEvent:function(b){var c=O(b),d=c.type;S.set(c,!1),a.renderAllPending();var e;E(this,d)||(e=function(){},this.addEventListener(d,e,!0));try{return O(this).dispatchEvent_(c)}finally{e&&this.removeEventListener(d,e,!0)}}},qb&&N(qb,B);var sb=document.elementFromPoint;a.elementFromPoint=G,a.getEventHandlerGetter=H,a.getEventHandlerSetter=I,a.wrapEventTargetMethods=F,a.wrappers.BeforeUnloadEvent=y,a.wrappers.CustomEvent=gb,a.wrappers.Event=t,a.wrappers.EventTarget=B,a.wrappers.FocusEvent=lb,a.wrappers.MouseEvent=kb,a.wrappers.UIEvent=fb}(window.ShadowDOMPolyfill),function(a){"use strict";function b(a,b){Object.defineProperty(a,b,o)}function c(a){this.impl=a}function d(){this.length=0,b(this,"length")}function e(a){for(var b=new d,e=0;e<a.length;e++)b[e]=new c(a[e]);return b.length=e,b}function f(a){g.call(this,a)}var g=a.wrappers.UIEvent,h=a.mixin,i=a.registerWrapper,j=a.unwrap,k=a.wrap,l=window.TouchEvent;if(l){var m;try{m=document.createEvent("TouchEvent")}catch(n){return}var o={enumerable:!1};c.prototype={get target(){return k(this.impl.target)}};var p={configurable:!0,enumerable:!0,get:null};["clientX","clientY","screenX","screenY","pageX","pageY","identifier","webkitRadiusX","webkitRadiusY","webkitRotationAngle","webkitForce"].forEach(function(a){p.get=function(){return this.impl[a]},Object.defineProperty(c.prototype,a,p)}),d.prototype={item:function(a){return this[a]}},f.prototype=Object.create(g.prototype),h(f.prototype,{get touches(){return e(j(this).touches)},get targetTouches(){return e(j(this).targetTouches)},get changedTouches(){return e(j(this).changedTouches)},initTouchEvent:function(){throw new Error("Not implemented")}}),i(l,f,m),a.wrappers.Touch=c,a.wrappers.TouchEvent=f,a.wrappers.TouchList=d}}(window.ShadowDOMPolyfill),function(a){"use strict";function b(a,b){Object.defineProperty(a,b,g)}function c(){this.length=0,b(this,"length")}function d(a){if(null==a)return a;for(var b=new c,d=0,e=a.length;e>d;d++)b[d]=f(a[d]);return b.length=e,b}function e(a,b){a.prototype[b]=function(){return d(this.impl[b].apply(this.impl,arguments))}}var f=a.wrap,g={enumerable:!1};c.prototype={item:function(a){return this[a]}},b(c.prototype,"item"),a.wrappers.NodeList=c,a.addWrapNodeListMethod=e,a.wrapNodeList=d}(window.ShadowDOMPolyfill),function(a){"use strict";a.wrapHTMLCollection=a.wrapNodeList,a.wrappers.HTMLCollection=a.wrappers.NodeList}(window.ShadowDOMPolyfill),function(a){"use strict";function b(a){A(a instanceof w)}function c(a){var b=new y;return b[0]=a,b.length=1,b}function d(a,b,c){C(b,"childList",{removedNodes:c,previousSibling:a.previousSibling,nextSibling:a.nextSibling})}function e(a,b){C(a,"childList",{removedNodes:b})}function f(a,b,d,e){if(a instanceof DocumentFragment){var f=h(a);O=!0;for(var g=f.length-1;g>=0;g--)a.removeChild(f[g]),f[g].parentNode_=b;O=!1;for(var g=0;g<f.length;g++)f[g].previousSibling_=f[g-1]||d,f[g].nextSibling_=f[g+1]||e;return d&&(d.nextSibling_=f[0]),e&&(e.previousSibling_=f[f.length-1]),f}var f=c(a),i=a.parentNode;return i&&i.removeChild(a),a.parentNode_=b,a.previousSibling_=d,a.nextSibling_=e,d&&(d.nextSibling_=a),e&&(e.previousSibling_=a),f}function g(a){if(a instanceof DocumentFragment)return h(a);var b=c(a),e=a.parentNode;return e&&d(a,e,b),b}function h(a){for(var b=new y,c=0,d=a.firstChild;d;d=d.nextSibling)b[c++]=d;return b.length=c,e(a,b),b}function i(a){return a}function j(a,b){I(a,b),a.nodeIsInserted_()}function k(a,b){for(var c=D(b),d=0;d<a.length;d++)j(a[d],c)}function l(a){I(a,new z(a,null))}function m(a){for(var b=0;b<a.length;b++)l(a[b])}function n(a,b){var c=a.nodeType===w.DOCUMENT_NODE?a:a.ownerDocument;c!==b.ownerDocument&&c.adoptNode(b)}function o(b,c){if(c.length){var d=b.ownerDocument;if(d!==c[0].ownerDocument)for(var e=0;e<c.length;e++)a.adoptNodeNoRemove(c[e],d)}}function p(a,b){o(a,b);var c=b.length;if(1===c)return J(b[0]);for(var d=J(a.ownerDocument.createDocumentFragment()),e=0;c>e;e++)d.appendChild(J(b[e]));return d}function q(a){if(void 0!==a.firstChild_)for(var b=a.firstChild_;b;){var c=b;b=b.nextSibling_,c.parentNode_=c.previousSibling_=c.nextSibling_=void 0}a.firstChild_=a.lastChild_=void 0}function r(a){if(a.invalidateShadowRenderer()){for(var b=a.firstChild;b;){A(b.parentNode===a);var c=b.nextSibling,d=J(b),e=d.parentNode;e&&V.call(e,d),b.previousSibling_=b.nextSibling_=b.parentNode_=null,b=c}a.firstChild_=a.lastChild_=null}else for(var c,f=J(a),g=f.firstChild;g;)c=g.nextSibling,V.call(f,g),g=c}function s(a){var b=a.parentNode;return b&&b.invalidateShadowRenderer()}function t(a){for(var b,c=0;c<a.length;c++)b=a[c],b.parentNode.removeChild(b)}function u(a,b,c){var d;if(d=L(c?P.call(c,a.impl,!1):Q.call(a.impl,!1)),b){for(var e=a.firstChild;e;e=e.nextSibling)d.appendChild(u(e,!0,c));if(a instanceof N.HTMLTemplateElement)for(var f=d.content,e=a.content.firstChild;e;e=e.nextSibling)f.appendChild(u(e,!0,c))}return d}function v(a,b){if(!b||D(a)!==D(b))return!1;for(var c=b;c;c=c.parentNode)if(c===a)return!0;return!1}function w(a){A(a instanceof R),x.call(this,a),this.parentNode_=void 0,this.firstChild_=void 0,this.lastChild_=void 0,this.nextSibling_=void 0,this.previousSibling_=void 0,this.treeScope_=void 0}var x=a.wrappers.EventTarget,y=a.wrappers.NodeList,z=a.TreeScope,A=a.assert,B=a.defineWrapGetter,C=a.enqueueMutation,D=a.getTreeScope,E=a.isWrapper,F=a.mixin,G=a.registerTransientObservers,H=a.registerWrapper,I=a.setTreeScope,J=a.unwrap,K=a.unwrapIfNeeded,L=a.wrap,M=a.wrapIfNeeded,N=a.wrappers,O=!1,P=document.importNode,Q=window.Node.prototype.cloneNode,R=window.Node,S=window.DocumentFragment,T=(R.prototype.appendChild,R.prototype.compareDocumentPosition),U=R.prototype.insertBefore,V=R.prototype.removeChild,W=R.prototype.replaceChild,X=/Trident/.test(navigator.userAgent),Y=X?function(a,b){try{V.call(a,b)}catch(c){if(!(a instanceof S))throw c}}:function(a,b){V.call(a,b)};w.prototype=Object.create(x.prototype),F(w.prototype,{appendChild:function(a){return this.insertBefore(a,null)},insertBefore:function(a,c){b(a);var d;c?E(c)?d=J(c):(d=c,c=L(d)):(c=null,d=null),c&&A(c.parentNode===this);var e,h=c?c.previousSibling:this.lastChild,i=!this.invalidateShadowRenderer()&&!s(a);if(e=i?g(a):f(a,this,h,c),i)n(this,a),q(this),U.call(this.impl,J(a),d);else{h||(this.firstChild_=e[0]),c||(this.lastChild_=e[e.length-1],void 0===this.firstChild_&&(this.firstChild_=this.firstChild));var j=d?d.parentNode:this.impl;j?U.call(j,p(this,e),d):o(this,e)}return C(this,"childList",{addedNodes:e,nextSibling:c,previousSibling:h}),k(e,this),a},removeChild:function(a){if(b(a),a.parentNode!==this){for(var d=!1,e=(this.childNodes,this.firstChild);e;e=e.nextSibling)if(e===a){d=!0;break}if(!d)throw new Error("NotFoundError")}var f=J(a),g=a.nextSibling,h=a.previousSibling;if(this.invalidateShadowRenderer()){var i=this.firstChild,j=this.lastChild,k=f.parentNode;k&&Y(k,f),i===a&&(this.firstChild_=g),j===a&&(this.lastChild_=h),h&&(h.nextSibling_=g),g&&(g.previousSibling_=h),a.previousSibling_=a.nextSibling_=a.parentNode_=void 0}else q(this),Y(this.impl,f);return O||C(this,"childList",{removedNodes:c(a),nextSibling:g,previousSibling:h}),G(this,a),a},replaceChild:function(a,d){b(a);var e;if(E(d)?e=J(d):(e=d,d=L(e)),d.parentNode!==this)throw new Error("NotFoundError");var h,i=d.nextSibling,j=d.previousSibling,m=!this.invalidateShadowRenderer()&&!s(a);return m?h=g(a):(i===a&&(i=a.nextSibling),h=f(a,this,j,i)),m?(n(this,a),q(this),W.call(this.impl,J(a),e)):(this.firstChild===d&&(this.firstChild_=h[0]),this.lastChild===d&&(this.lastChild_=h[h.length-1]),d.previousSibling_=d.nextSibling_=d.parentNode_=void 0,e.parentNode&&W.call(e.parentNode,p(this,h),e)),C(this,"childList",{addedNodes:h,removedNodes:c(d),nextSibling:i,previousSibling:j}),l(d),k(h,this),d},nodeIsInserted_:function(){for(var a=this.firstChild;a;a=a.nextSibling)a.nodeIsInserted_()},hasChildNodes:function(){return null!==this.firstChild},get parentNode(){return void 0!==this.parentNode_?this.parentNode_:L(this.impl.parentNode)},get firstChild(){return void 0!==this.firstChild_?this.firstChild_:L(this.impl.firstChild)},get lastChild(){return void 0!==this.lastChild_?this.lastChild_:L(this.impl.lastChild)},get nextSibling(){return void 0!==this.nextSibling_?this.nextSibling_:L(this.impl.nextSibling)},get previousSibling(){return void 0!==this.previousSibling_?this.previousSibling_:L(this.impl.previousSibling)},get parentElement(){for(var a=this.parentNode;a&&a.nodeType!==w.ELEMENT_NODE;)a=a.parentNode;return a},get textContent(){for(var a="",b=this.firstChild;b;b=b.nextSibling)b.nodeType!=w.COMMENT_NODE&&(a+=b.textContent);return a},set textContent(a){var b=i(this.childNodes);if(this.invalidateShadowRenderer()){if(r(this),""!==a){var c=this.impl.ownerDocument.createTextNode(a);this.appendChild(c)}}else q(this),this.impl.textContent=a;var d=i(this.childNodes);C(this,"childList",{addedNodes:d,removedNodes:b}),m(b),k(d,this)},get childNodes(){for(var a=new y,b=0,c=this.firstChild;c;c=c.nextSibling)a[b++]=c;return a.length=b,a},cloneNode:function(a){return u(this,a)},contains:function(a){return v(this,M(a))},compareDocumentPosition:function(a){return T.call(this.impl,K(a))},normalize:function(){for(var a,b,c=i(this.childNodes),d=[],e="",f=0;f<c.length;f++)b=c[f],b.nodeType===w.TEXT_NODE?a||b.data.length?a?(e+=b.data,d.push(b)):a=b:this.removeNode(b):(a&&d.length&&(a.data+=e,t(d)),d=[],e="",a=null,b.childNodes.length&&b.normalize());a&&d.length&&(a.data+=e,t(d))}}),B(w,"ownerDocument"),H(R,w,document.createDocumentFragment()),delete w.prototype.querySelector,delete w.prototype.querySelectorAll,w.prototype=F(Object.create(x.prototype),w.prototype),a.cloneNode=u,a.nodeWasAdded=j,a.nodeWasRemoved=l,a.nodesWereAdded=k,a.nodesWereRemoved=m,a.snapshotNodeList=i,a.wrappers.Node=w}(window.ShadowDOMPolyfill),function(a){"use strict";function b(a,c){for(var d,e=a.firstElementChild;e;){if(e.matches(c))return e;if(d=b(e,c))return d;e=e.nextElementSibling}return null}function c(a,b){return a.matches(b)}function d(a,b,c){var d=a.localName;return d===b||d===c&&a.namespaceURI===l}function e(){return!0}function f(a,b){return a.localName===b}function g(a,b){return a.namespaceURI===b}function h(a,b,c){return a.namespaceURI===b&&a.localName===c}function i(a,b,c,d,e){for(var f=a.firstElementChild;f;)c(f,d,e)&&(b[b.length++]=f),i(f,b,c,d,e),f=f.nextElementSibling;return b}var j=a.wrappers.HTMLCollection,k=a.wrappers.NodeList,l="http://www.w3.org/1999/xhtml",m={querySelector:function(a){return b(this,a)},querySelectorAll:function(a){return i(this,new k,c,a)}},n={getElementsByTagName:function(a){var b=new j;return"*"===a?i(this,b,e):i(this,b,d,a,a.toLowerCase())},getElementsByClassName:function(a){return this.querySelectorAll("."+a)},getElementsByTagNameNS:function(a,b){var c=new j;if(""===a)a=null;else if("*"===a)return"*"===b?i(this,c,e):i(this,c,f,b);return"*"===b?i(this,c,g,a):i(this,c,h,a,b)}};a.GetElementsByInterface=n,a.SelectorsInterface=m}(window.ShadowDOMPolyfill),function(a){"use strict";function b(a){for(;a&&a.nodeType!==Node.ELEMENT_NODE;)a=a.nextSibling;return a}function c(a){for(;a&&a.nodeType!==Node.ELEMENT_NODE;)a=a.previousSibling;return a}var d=a.wrappers.NodeList,e={get firstElementChild(){return b(this.firstChild)},get lastElementChild(){return c(this.lastChild)},get childElementCount(){for(var a=0,b=this.firstElementChild;b;b=b.nextElementSibling)a++;return a},get children(){for(var a=new d,b=0,c=this.firstElementChild;c;c=c.nextElementSibling)a[b++]=c;return a.length=b,a},remove:function(){var a=this.parentNode;a&&a.removeChild(this)}},f={get nextElementSibling(){return b(this.nextSibling)},get previousElementSibling(){return c(this.previousSibling)}};a.ChildNodeInterface=f,a.ParentNodeInterface=e}(window.ShadowDOMPolyfill),function(a){"use strict";function b(a){d.call(this,a)}var c=a.ChildNodeInterface,d=a.wrappers.Node,e=a.enqueueMutation,f=a.mixin,g=a.registerWrapper,h=window.CharacterData;b.prototype=Object.create(d.prototype),f(b.prototype,{get textContent(){return this.data},set textContent(a){this.data=a},get data(){return this.impl.data},set data(a){var b=this.impl.data;e(this,"characterData",{oldValue:b}),this.impl.data=a}}),f(b.prototype,c),g(h,b,document.createTextNode("")),a.wrappers.CharacterData=b}(window.ShadowDOMPolyfill),function(a){"use strict";function b(a){return a>>>0}function c(a){d.call(this,a)}var d=a.wrappers.CharacterData,e=(a.enqueueMutation,a.mixin),f=a.registerWrapper,g=window.Text;c.prototype=Object.create(d.prototype),e(c.prototype,{splitText:function(a){a=b(a);var c=this.data;if(a>c.length)throw new Error("IndexSizeError");var d=c.slice(0,a),e=c.slice(a);this.data=d;var f=this.ownerDocument.createTextNode(e);return this.parentNode&&this.parentNode.insertBefore(f,this.nextSibling),f}}),f(g,c,document.createTextNode("")),a.wrappers.Text=c}(window.ShadowDOMPolyfill),function(a){"use strict";function b(b){a.invalidateRendererBasedOnAttribute(b,"class")}function c(a,b){this.impl=a,this.ownerElement_=b}c.prototype={get length(){return this.impl.length},item:function(a){return this.impl.item(a)},contains:function(a){return this.impl.contains(a)},add:function(){this.impl.add.apply(this.impl,arguments),b(this.ownerElement_)},remove:function(){this.impl.remove.apply(this.impl,arguments),b(this.ownerElement_)},toggle:function(){var a=this.impl.toggle.apply(this.impl,arguments);return b(this.ownerElement_),a},toString:function(){return this.impl.toString()}},a.wrappers.DOMTokenList=c}(window.ShadowDOMPolyfill),function(a){"use strict";function b(b,c){var d=b.parentNode;if(d&&d.shadowRoot){var e=a.getRendererForHost(d);e.dependsOnAttribute(c)&&e.invalidate()}}function c(a,b,c){k(a,"attributes",{name:b,namespace:null,oldValue:c})}function d(a){g.call(this,a)}var e=a.ChildNodeInterface,f=a.GetElementsByInterface,g=a.wrappers.Node,h=a.wrappers.DOMTokenList,i=a.ParentNodeInterface,j=a.SelectorsInterface,k=(a.addWrapNodeListMethod,a.enqueueMutation),l=a.mixin,m=(a.oneOf,a.registerWrapper),n=a.unwrap,o=a.wrappers,p=window.Element,q=["matches","mozMatchesSelector","msMatchesSelector","webkitMatchesSelector"].filter(function(a){return p.prototype[a]}),r=q[0],s=p.prototype[r],t=new WeakMap;d.prototype=Object.create(g.prototype),l(d.prototype,{createShadowRoot:function(){var b=new o.ShadowRoot(this);this.impl.polymerShadowRoot_=b;var c=a.getRendererForHost(this);return c.invalidate(),b},get shadowRoot(){return this.impl.polymerShadowRoot_||null},setAttribute:function(a,d){var e=this.impl.getAttribute(a);this.impl.setAttribute(a,d),c(this,a,e),b(this,a)},removeAttribute:function(a){var d=this.impl.getAttribute(a);this.impl.removeAttribute(a),c(this,a,d),b(this,a)},matches:function(a){return s.call(this.impl,a)},get classList(){var a=t.get(this);return a||t.set(this,a=new h(n(this).classList,this)),a},get className(){return n(this).className},set className(a){this.setAttribute("class",a)},get id(){return n(this).id},set id(a){this.setAttribute("id",a)}}),q.forEach(function(a){"matches"!==a&&(d.prototype[a]=function(a){return this.matches(a)})}),p.prototype.webkitCreateShadowRoot&&(d.prototype.webkitCreateShadowRoot=d.prototype.createShadowRoot),l(d.prototype,e),l(d.prototype,f),l(d.prototype,i),l(d.prototype,j),m(p,d,document.createElementNS(null,"x")),a.invalidateRendererBasedOnAttribute=b,a.matchesNames=q,a.wrappers.Element=d}(window.ShadowDOMPolyfill),function(a){"use strict";function b(a){switch(a){case"&":return"&amp;";case"<":return"&lt;";case">":return"&gt;";case'"':return"&quot;";case"\xa0":return"&nbsp;"}}function c(a){return a.replace(z,b)}function d(a){return a.replace(A,b)}function e(a){for(var b={},c=0;c<a.length;c++)b[a[c]]=!0;return b}function f(a,b){switch(a.nodeType){case Node.ELEMENT_NODE:for(var e,f=a.tagName.toLowerCase(),h="<"+f,i=a.attributes,j=0;e=i[j];j++)h+=" "+e.name+'="'+c(e.value)+'"';return h+=">",B[f]?h:h+g(a)+"</"+f+">";case Node.TEXT_NODE:var k=a.data;return b&&C[b.localName]?k:d(k);case Node.COMMENT_NODE:return"<!--"+a.data+"-->";default:throw console.error(a),new Error("not implemented")}}function g(a){a instanceof y.HTMLTemplateElement&&(a=a.content);for(var b="",c=a.firstChild;c;c=c.nextSibling)b+=f(c,a);return b}function h(a,b,c){var d=c||"div";a.textContent="";var e=w(a.ownerDocument.createElement(d));e.innerHTML=b;for(var f;f=e.firstChild;)a.appendChild(x(f))}function i(a){o.call(this,a)}function j(a,b){var c=w(a.cloneNode(!1));c.innerHTML=b;for(var d,e=w(document.createDocumentFragment());d=c.firstChild;)e.appendChild(d);return x(e)}function k(b){return function(){return a.renderAllPending(),this.impl[b]}}function l(a){p(i,a,k(a))}function m(b){Object.defineProperty(i.prototype,b,{get:k(b),set:function(c){a.renderAllPending(),this.impl[b]=c},configurable:!0,enumerable:!0})}function n(b){Object.defineProperty(i.prototype,b,{value:function(){return a.renderAllPending(),this.impl[b].apply(this.impl,arguments)},configurable:!0,enumerable:!0})}var o=a.wrappers.Element,p=a.defineGetter,q=a.enqueueMutation,r=a.mixin,s=a.nodesWereAdded,t=a.nodesWereRemoved,u=a.registerWrapper,v=a.snapshotNodeList,w=a.unwrap,x=a.wrap,y=a.wrappers,z=/[&\u00A0"]/g,A=/[&\u00A0<>]/g,B=e(["area","base","br","col","command","embed","hr","img","input","keygen","link","meta","param","source","track","wbr"]),C=e(["style","script","xmp","iframe","noembed","noframes","plaintext","noscript"]),D=/MSIE/.test(navigator.userAgent),E=window.HTMLElement,F=window.HTMLTemplateElement;i.prototype=Object.create(o.prototype),r(i.prototype,{get innerHTML(){return g(this)},set innerHTML(a){if(D&&C[this.localName])return void(this.textContent=a);var b=v(this.childNodes);this.invalidateShadowRenderer()?this instanceof y.HTMLTemplateElement?h(this.content,a):h(this,a,this.tagName):!F&&this instanceof y.HTMLTemplateElement?h(this.content,a):this.impl.innerHTML=a;var c=v(this.childNodes);q(this,"childList",{addedNodes:c,removedNodes:b}),t(b),s(c,this)},get outerHTML(){return f(this,this.parentNode)},set outerHTML(a){var b=this.parentNode;if(b){b.invalidateShadowRenderer();var c=j(b,a);b.replaceChild(c,this)}},insertAdjacentHTML:function(a,b){var c,d;switch(String(a).toLowerCase()){case"beforebegin":c=this.parentNode,d=this;break;case"afterend":c=this.parentNode,d=this.nextSibling;break;case"afterbegin":c=this,d=this.firstChild;break;case"beforeend":c=this,d=null;break;default:return}var e=j(c,b);c.insertBefore(e,d)}}),["clientHeight","clientLeft","clientTop","clientWidth","offsetHeight","offsetLeft","offsetTop","offsetWidth","scrollHeight","scrollWidth"].forEach(l),["scrollLeft","scrollTop"].forEach(m),["getBoundingClientRect","getClientRects","scrollIntoView"].forEach(n),u(E,i,document.createElement("b")),a.wrappers.HTMLElement=i,a.getInnerHTML=g,a.setInnerHTML=h}(window.ShadowDOMPolyfill),function(a){"use strict";function b(a){c.call(this,a)}var c=a.wrappers.HTMLElement,d=a.mixin,e=a.registerWrapper,f=a.wrap,g=window.HTMLCanvasElement;b.prototype=Object.create(c.prototype),d(b.prototype,{getContext:function(){var a=this.impl.getContext.apply(this.impl,arguments);return a&&f(a)}}),e(g,b,document.createElement("canvas")),a.wrappers.HTMLCanvasElement=b}(window.ShadowDOMPolyfill),function(a){"use strict";function b(a){c.call(this,a)}var c=a.wrappers.HTMLElement,d=a.mixin,e=a.registerWrapper,f=window.HTMLContentElement;b.prototype=Object.create(c.prototype),d(b.prototype,{get select(){return this.getAttribute("select")},set select(a){this.setAttribute("select",a)},setAttribute:function(a,b){c.prototype.setAttribute.call(this,a,b),"select"===String(a).toLowerCase()&&this.invalidateShadowRenderer(!0)}}),f&&e(f,b),a.wrappers.HTMLContentElement=b}(window.ShadowDOMPolyfill),function(a){"use strict";function b(a){d.call(this,a)}function c(a,b){if(!(this instanceof c))throw new TypeError("DOM object constructor cannot be called as a function.");var e=f(document.createElement("img"));d.call(this,e),g(e,this),void 0!==a&&(e.width=a),void 0!==b&&(e.height=b)}var d=a.wrappers.HTMLElement,e=a.registerWrapper,f=a.unwrap,g=a.rewrap,h=window.HTMLImageElement;b.prototype=Object.create(d.prototype),e(h,b,document.createElement("img")),c.prototype=b.prototype,a.wrappers.HTMLImageElement=b,a.wrappers.Image=c}(window.ShadowDOMPolyfill),function(a){"use strict";function b(a){c.call(this,a)}var c=a.wrappers.HTMLElement,d=(a.mixin,a.wrappers.NodeList,a.registerWrapper),e=window.HTMLShadowElement;b.prototype=Object.create(c.prototype),e&&d(e,b),a.wrappers.HTMLShadowElement=b}(window.ShadowDOMPolyfill),function(a){"use strict";function b(a){if(!a.defaultView)return a;var b=k.get(a);if(!b){for(b=a.implementation.createHTMLDocument("");b.lastChild;)b.removeChild(b.lastChild);k.set(a,b)}return b}function c(a){for(var c,d=b(a.ownerDocument),e=h(d.createDocumentFragment());c=a.firstChild;)e.appendChild(c);return e}function d(a){if(e.call(this,a),!l){var b=c(a);j.set(this,i(b))}}var e=a.wrappers.HTMLElement,f=a.mixin,g=a.registerWrapper,h=a.unwrap,i=a.wrap,j=new WeakMap,k=new WeakMap,l=window.HTMLTemplateElement;d.prototype=Object.create(e.prototype),f(d.prototype,{get content(){return l?i(this.impl.content):j.get(this)}}),l&&g(l,d),a.wrappers.HTMLTemplateElement=d}(window.ShadowDOMPolyfill),function(a){"use strict";function b(a){c.call(this,a)}var c=a.wrappers.HTMLElement,d=a.registerWrapper,e=window.HTMLMediaElement;b.prototype=Object.create(c.prototype),d(e,b,document.createElement("audio")),a.wrappers.HTMLMediaElement=b}(window.ShadowDOMPolyfill),function(a){"use strict";function b(a){d.call(this,a)}function c(a){if(!(this instanceof c))throw new TypeError("DOM object constructor cannot be called as a function.");var b=f(document.createElement("audio"));d.call(this,b),g(b,this),b.setAttribute("preload","auto"),void 0!==a&&b.setAttribute("src",a)}var d=a.wrappers.HTMLMediaElement,e=a.registerWrapper,f=a.unwrap,g=a.rewrap,h=window.HTMLAudioElement;b.prototype=Object.create(d.prototype),e(h,b,document.createElement("audio")),c.prototype=b.prototype,a.wrappers.HTMLAudioElement=b,a.wrappers.Audio=c}(window.ShadowDOMPolyfill),function(a){"use strict";function b(a){return a.replace(/\s+/g," ").trim()}function c(a){e.call(this,a)}function d(a,b,c,f){if(!(this instanceof d))throw new TypeError("DOM object constructor cannot be called as a function.");var g=i(document.createElement("option"));e.call(this,g),h(g,this),void 0!==a&&(g.text=a),void 0!==b&&g.setAttribute("value",b),c===!0&&g.setAttribute("selected",""),g.selected=f===!0}var e=a.wrappers.HTMLElement,f=a.mixin,g=a.registerWrapper,h=a.rewrap,i=a.unwrap,j=a.wrap,k=window.HTMLOptionElement;c.prototype=Object.create(e.prototype),f(c.prototype,{get text(){return b(this.textContent)},set text(a){this.textContent=b(String(a))},get form(){return j(i(this).form)}}),g(k,c,document.createElement("option")),d.prototype=c.prototype,a.wrappers.HTMLOptionElement=c,a.wrappers.Option=d}(window.ShadowDOMPolyfill),function(a){"use strict";function b(a){c.call(this,a)}var c=a.wrappers.HTMLElement,d=a.mixin,e=a.registerWrapper,f=a.unwrap,g=a.wrap,h=window.HTMLSelectElement;b.prototype=Object.create(c.prototype),d(b.prototype,{add:function(a,b){"object"==typeof b&&(b=f(b)),f(this).add(f(a),b)},remove:function(a){return void 0===a?void c.prototype.remove.call(this):("object"==typeof a&&(a=f(a)),void f(this).remove(a))},get form(){return g(f(this).form)}}),e(h,b,document.createElement("select")),a.wrappers.HTMLSelectElement=b}(window.ShadowDOMPolyfill),function(a){"use strict";function b(a){c.call(this,a)}var c=a.wrappers.HTMLElement,d=a.mixin,e=a.registerWrapper,f=a.unwrap,g=a.wrap,h=a.wrapHTMLCollection,i=window.HTMLTableElement;b.prototype=Object.create(c.prototype),d(b.prototype,{get caption(){return g(f(this).caption)},createCaption:function(){return g(f(this).createCaption())},get tHead(){return g(f(this).tHead)},createTHead:function(){return g(f(this).createTHead())},createTFoot:function(){return g(f(this).createTFoot())},get tFoot(){return g(f(this).tFoot)},get tBodies(){return h(f(this).tBodies)},createTBody:function(){return g(f(this).createTBody())},get rows(){return h(f(this).rows)},insertRow:function(a){return g(f(this).insertRow(a))}}),e(i,b,document.createElement("table")),a.wrappers.HTMLTableElement=b}(window.ShadowDOMPolyfill),function(a){"use strict";function b(a){c.call(this,a)}var c=a.wrappers.HTMLElement,d=a.mixin,e=a.registerWrapper,f=a.wrapHTMLCollection,g=a.unwrap,h=a.wrap,i=window.HTMLTableSectionElement;b.prototype=Object.create(c.prototype),d(b.prototype,{get rows(){return f(g(this).rows)},insertRow:function(a){return h(g(this).insertRow(a))}}),e(i,b,document.createElement("thead")),a.wrappers.HTMLTableSectionElement=b}(window.ShadowDOMPolyfill),function(a){"use strict";function b(a){c.call(this,a)}var c=a.wrappers.HTMLElement,d=a.mixin,e=a.registerWrapper,f=a.wrapHTMLCollection,g=a.unwrap,h=a.wrap,i=window.HTMLTableRowElement;b.prototype=Object.create(c.prototype),d(b.prototype,{get cells(){return f(g(this).cells)},insertCell:function(a){return h(g(this).insertCell(a))}}),e(i,b,document.createElement("tr")),a.wrappers.HTMLTableRowElement=b}(window.ShadowDOMPolyfill),function(a){"use strict";function b(a){switch(a.localName){case"content":return new c(a);case"shadow":return new e(a);case"template":return new f(a)}d.call(this,a)}var c=a.wrappers.HTMLContentElement,d=a.wrappers.HTMLElement,e=a.wrappers.HTMLShadowElement,f=a.wrappers.HTMLTemplateElement,g=(a.mixin,a.registerWrapper),h=window.HTMLUnknownElement;b.prototype=Object.create(d.prototype),g(h,b),a.wrappers.HTMLUnknownElement=b}(window.ShadowDOMPolyfill),function(a){"use strict";var b=a.wrappers.Element,c=a.wrappers.HTMLElement,d=a.registerObject,e="http://www.w3.org/2000/svg",f=document.createElementNS(e,"title"),g=d(f),h=Object.getPrototypeOf(g.prototype).constructor;if(!("classList"in f)){var i=Object.getOwnPropertyDescriptor(b.prototype,"classList");Object.defineProperty(c.prototype,"classList",i),delete b.prototype.classList}a.wrappers.SVGElement=h}(window.ShadowDOMPolyfill),function(a){"use strict";function b(a){m.call(this,a)}var c=a.mixin,d=a.registerWrapper,e=a.unwrap,f=a.wrap,g=window.SVGUseElement,h="http://www.w3.org/2000/svg",i=f(document.createElementNS(h,"g")),j=document.createElementNS(h,"use"),k=i.constructor,l=Object.getPrototypeOf(k.prototype),m=l.constructor;
b.prototype=Object.create(l),"instanceRoot"in j&&c(b.prototype,{get instanceRoot(){return f(e(this).instanceRoot)},get animatedInstanceRoot(){return f(e(this).animatedInstanceRoot)}}),d(g,b,j),a.wrappers.SVGUseElement=b}(window.ShadowDOMPolyfill),function(a){"use strict";function b(a){c.call(this,a)}var c=a.wrappers.EventTarget,d=a.mixin,e=a.registerWrapper,f=a.wrap,g=window.SVGElementInstance;g&&(b.prototype=Object.create(c.prototype),d(b.prototype,{get correspondingElement(){return f(this.impl.correspondingElement)},get correspondingUseElement(){return f(this.impl.correspondingUseElement)},get parentNode(){return f(this.impl.parentNode)},get childNodes(){throw new Error("Not implemented")},get firstChild(){return f(this.impl.firstChild)},get lastChild(){return f(this.impl.lastChild)},get previousSibling(){return f(this.impl.previousSibling)},get nextSibling(){return f(this.impl.nextSibling)}}),e(g,b),a.wrappers.SVGElementInstance=b)}(window.ShadowDOMPolyfill),function(a){"use strict";function b(a){this.impl=a}var c=a.mixin,d=a.registerWrapper,e=a.unwrap,f=a.unwrapIfNeeded,g=a.wrap,h=window.CanvasRenderingContext2D;c(b.prototype,{get canvas(){return g(this.impl.canvas)},drawImage:function(){arguments[0]=f(arguments[0]),this.impl.drawImage.apply(this.impl,arguments)},createPattern:function(){return arguments[0]=e(arguments[0]),this.impl.createPattern.apply(this.impl,arguments)}}),d(h,b,document.createElement("canvas").getContext("2d")),a.wrappers.CanvasRenderingContext2D=b}(window.ShadowDOMPolyfill),function(a){"use strict";function b(a){this.impl=a}var c=a.mixin,d=a.registerWrapper,e=a.unwrapIfNeeded,f=a.wrap,g=window.WebGLRenderingContext;if(g){c(b.prototype,{get canvas(){return f(this.impl.canvas)},texImage2D:function(){arguments[5]=e(arguments[5]),this.impl.texImage2D.apply(this.impl,arguments)},texSubImage2D:function(){arguments[6]=e(arguments[6]),this.impl.texSubImage2D.apply(this.impl,arguments)}});var h=/WebKit/.test(navigator.userAgent)?{drawingBufferHeight:null,drawingBufferWidth:null}:{};d(g,b,h),a.wrappers.WebGLRenderingContext=b}}(window.ShadowDOMPolyfill),function(a){"use strict";function b(a){this.impl=a}var c=a.registerWrapper,d=a.unwrap,e=a.unwrapIfNeeded,f=a.wrap,g=window.Range;b.prototype={get startContainer(){return f(this.impl.startContainer)},get endContainer(){return f(this.impl.endContainer)},get commonAncestorContainer(){return f(this.impl.commonAncestorContainer)},setStart:function(a,b){this.impl.setStart(e(a),b)},setEnd:function(a,b){this.impl.setEnd(e(a),b)},setStartBefore:function(a){this.impl.setStartBefore(e(a))},setStartAfter:function(a){this.impl.setStartAfter(e(a))},setEndBefore:function(a){this.impl.setEndBefore(e(a))},setEndAfter:function(a){this.impl.setEndAfter(e(a))},selectNode:function(a){this.impl.selectNode(e(a))},selectNodeContents:function(a){this.impl.selectNodeContents(e(a))},compareBoundaryPoints:function(a,b){return this.impl.compareBoundaryPoints(a,d(b))},extractContents:function(){return f(this.impl.extractContents())},cloneContents:function(){return f(this.impl.cloneContents())},insertNode:function(a){this.impl.insertNode(e(a))},surroundContents:function(a){this.impl.surroundContents(e(a))},cloneRange:function(){return f(this.impl.cloneRange())},isPointInRange:function(a,b){return this.impl.isPointInRange(e(a),b)},comparePoint:function(a,b){return this.impl.comparePoint(e(a),b)},intersectsNode:function(a){return this.impl.intersectsNode(e(a))},toString:function(){return this.impl.toString()}},g.prototype.createContextualFragment&&(b.prototype.createContextualFragment=function(a){return f(this.impl.createContextualFragment(a))}),c(window.Range,b,document.createRange()),a.wrappers.Range=b}(window.ShadowDOMPolyfill),function(a){"use strict";var b=a.GetElementsByInterface,c=a.ParentNodeInterface,d=a.SelectorsInterface,e=a.mixin,f=a.registerObject,g=f(document.createDocumentFragment());e(g.prototype,c),e(g.prototype,d),e(g.prototype,b);var h=f(document.createComment(""));a.wrappers.Comment=h,a.wrappers.DocumentFragment=g}(window.ShadowDOMPolyfill),function(a){"use strict";function b(a){var b=k(a.impl.ownerDocument.createDocumentFragment());c.call(this,b),i(b,this);var e=a.shadowRoot;m.set(this,e),this.treeScope_=new d(this,g(e||a)),l.set(this,a)}var c=a.wrappers.DocumentFragment,d=a.TreeScope,e=a.elementFromPoint,f=a.getInnerHTML,g=a.getTreeScope,h=a.mixin,i=a.rewrap,j=a.setInnerHTML,k=a.unwrap,l=new WeakMap,m=new WeakMap,n=/[ \t\n\r\f]/;b.prototype=Object.create(c.prototype),h(b.prototype,{get innerHTML(){return f(this)},set innerHTML(a){j(this,a),this.invalidateShadowRenderer()},get olderShadowRoot(){return m.get(this)||null},get host(){return l.get(this)||null},invalidateShadowRenderer:function(){return l.get(this).invalidateShadowRenderer()},elementFromPoint:function(a,b){return e(this,this.ownerDocument,a,b)},getElementById:function(a){return n.test(a)?null:this.querySelector('[id="'+a+'"]')}}),a.wrappers.ShadowRoot=b}(window.ShadowDOMPolyfill),function(a){"use strict";function b(a){a.previousSibling_=a.previousSibling,a.nextSibling_=a.nextSibling,a.parentNode_=a.parentNode}function c(a,c,e){var f=G(a),g=G(c),h=e?G(e):null;if(d(c),b(c),e)a.firstChild===e&&(a.firstChild_=e),e.previousSibling_=e.previousSibling;else{a.lastChild_=a.lastChild,a.lastChild===a.firstChild&&(a.firstChild_=a.firstChild);var i=H(f.lastChild);i&&(i.nextSibling_=i.nextSibling)}f.insertBefore(g,h)}function d(a){var c=G(a),d=c.parentNode;if(d){var e=H(d);b(a),a.previousSibling&&(a.previousSibling.nextSibling_=a),a.nextSibling&&(a.nextSibling.previousSibling_=a),e.lastChild===a&&(e.lastChild_=a),e.firstChild===a&&(e.firstChild_=a),d.removeChild(c)}}function e(a){I.set(a,[])}function f(a){var b=I.get(a);return b||I.set(a,b=[]),b}function g(a){for(var b=[],c=0,d=a.firstChild;d;d=d.nextSibling)b[c++]=d;return b}function h(){for(var a=0;a<M.length;a++){var b=M[a],c=b.parentRenderer;c&&c.dirty||b.render()}M=[]}function i(){y=null,h()}function j(a){var b=K.get(a);return b||(b=new n(a),K.set(a,b)),b}function k(a){var b=E(a).root;return b instanceof D?b:null}function l(a){return j(a.host)}function m(a){this.skip=!1,this.node=a,this.childNodes=[]}function n(a){this.host=a,this.dirty=!1,this.invalidateAttributes(),this.associateNode(a)}function o(a){for(var b=[],c=a.firstChild;c;c=c.nextSibling)v(c)?b.push.apply(b,f(c)):b.push(c);return b}function p(a){if(a instanceof B)return a;if(a instanceof A)return null;for(var b=a.firstChild;b;b=b.nextSibling){var c=p(b);if(c)return c}return null}function q(a,b){f(b).push(a);var c=J.get(a);c?c.push(b):J.set(a,[b])}function r(a){return J.get(a)}function s(a){J.set(a,void 0)}function t(a,b){var c=b.getAttribute("select");if(!c)return!0;if(c=c.trim(),!c)return!0;if(!(a instanceof z))return!1;if(!O.test(c))return!1;try{return a.matches(c)}catch(d){return!1}}function u(a,b){var c=r(b);return c&&c[c.length-1]===a}function v(a){return a instanceof A||a instanceof B}function w(a){return a.shadowRoot}function x(a){for(var b=[],c=a.shadowRoot;c;c=c.olderShadowRoot)b.push(c);return b}var y,z=a.wrappers.Element,A=a.wrappers.HTMLContentElement,B=a.wrappers.HTMLShadowElement,C=a.wrappers.Node,D=a.wrappers.ShadowRoot,E=(a.assert,a.getTreeScope),F=(a.mixin,a.oneOf),G=a.unwrap,H=a.wrap,I=new WeakMap,J=new WeakMap,K=new WeakMap,L=F(window,["requestAnimationFrame","mozRequestAnimationFrame","webkitRequestAnimationFrame","setTimeout"]),M=[],N=new ArraySplice;N.equals=function(a,b){return G(a.node)===b},m.prototype={append:function(a){var b=new m(a);return this.childNodes.push(b),b},sync:function(a){if(!this.skip){for(var b=this.node,e=this.childNodes,f=g(G(b)),h=a||new WeakMap,i=N.calculateSplices(e,f),j=0,k=0,l=0,m=0;m<i.length;m++){for(var n=i[m];l<n.index;l++)k++,e[j++].sync(h);for(var o=n.removed.length,p=0;o>p;p++){var q=H(f[k++]);h.get(q)||d(q)}for(var r=n.addedCount,s=f[k]&&H(f[k]),p=0;r>p;p++){var t=e[j++],u=t.node;c(b,u,s),h.set(u,!0),t.sync(h)}l+=r}for(var m=l;m<e.length;m++)e[m].sync(h)}}},n.prototype={render:function(a){if(this.dirty){this.invalidateAttributes();var b=this.host;this.distribution(b);var c=a||new m(b);this.buildRenderTree(c,b);var d=!a;d&&c.sync(),this.dirty=!1}},get parentRenderer(){return E(this.host).renderer},invalidate:function(){if(!this.dirty){if(this.dirty=!0,M.push(this),y)return;y=window[L](i,0)}},distribution:function(a){this.resetAll(a),this.distributionResolution(a)},resetAll:function(a){v(a)?e(a):s(a);for(var b=a.firstChild;b;b=b.nextSibling)this.resetAll(b);a.shadowRoot&&this.resetAll(a.shadowRoot),a.olderShadowRoot&&this.resetAll(a.olderShadowRoot)},distributionResolution:function(a){if(w(a)){for(var b=a,c=o(b),d=x(b),e=0;e<d.length;e++)this.poolDistribution(d[e],c);for(var e=d.length-1;e>=0;e--){var f=d[e],g=p(f);if(g){var h=f.olderShadowRoot;h&&(c=o(h));for(var i=0;i<c.length;i++)q(c[i],g)}this.distributionResolution(f)}}for(var j=a.firstChild;j;j=j.nextSibling)this.distributionResolution(j)},poolDistribution:function(a,b){if(!(a instanceof B))if(a instanceof A){var c=a;this.updateDependentAttributes(c.getAttribute("select"));for(var d=!1,e=0;e<b.length;e++){var a=b[e];a&&t(a,c)&&(q(a,c),b[e]=void 0,d=!0)}if(!d)for(var f=c.firstChild;f;f=f.nextSibling)q(f,c)}else for(var f=a.firstChild;f;f=f.nextSibling)this.poolDistribution(f,b)},buildRenderTree:function(a,b){for(var c=this.compose(b),d=0;d<c.length;d++){var e=c[d],f=a.append(e);this.buildRenderTree(f,e)}if(w(b)){var g=j(b);g.dirty=!1}},compose:function(a){for(var b=[],c=a.shadowRoot||a,d=c.firstChild;d;d=d.nextSibling)if(v(d)){this.associateNode(c);for(var e=f(d),g=0;g<e.length;g++){var h=e[g];u(d,h)&&b.push(h)}}else b.push(d);return b},invalidateAttributes:function(){this.attributes=Object.create(null)},updateDependentAttributes:function(a){if(a){var b=this.attributes;/\.\w+/.test(a)&&(b["class"]=!0),/#\w+/.test(a)&&(b.id=!0),a.replace(/\[\s*([^\s=\|~\]]+)/g,function(a,c){b[c]=!0})}},dependsOnAttribute:function(a){return this.attributes[a]},associateNode:function(a){a.impl.polymerShadowRenderer_=this}};var O=/^[*.#[a-zA-Z_|]/;C.prototype.invalidateShadowRenderer=function(){var a=this.impl.polymerShadowRenderer_;return a?(a.invalidate(),!0):!1},A.prototype.getDistributedNodes=B.prototype.getDistributedNodes=function(){return h(),f(this)},z.prototype.getDestinationInsertionPoints=function(){return h(),r(this)||[]},A.prototype.nodeIsInserted_=B.prototype.nodeIsInserted_=function(){this.invalidateShadowRenderer();var a,b=k(this);b&&(a=l(b)),this.impl.polymerShadowRenderer_=a,a&&a.invalidate()},a.getRendererForHost=j,a.getShadowTrees=x,a.renderAllPending=h,a.getDestinationInsertionPoints=r,a.visual={insertBefore:c,remove:d}}(window.ShadowDOMPolyfill),function(a){"use strict";function b(b){if(window[b]){d(!a.wrappers[b]);var i=function(a){c.call(this,a)};i.prototype=Object.create(c.prototype),e(i.prototype,{get form(){return h(g(this).form)}}),f(window[b],i,document.createElement(b.slice(4,-7))),a.wrappers[b]=i}}var c=a.wrappers.HTMLElement,d=a.assert,e=a.mixin,f=a.registerWrapper,g=a.unwrap,h=a.wrap,i=["HTMLButtonElement","HTMLFieldSetElement","HTMLInputElement","HTMLKeygenElement","HTMLLabelElement","HTMLLegendElement","HTMLObjectElement","HTMLOutputElement","HTMLTextAreaElement"];i.forEach(b)}(window.ShadowDOMPolyfill),function(a){"use strict";function b(a){this.impl=a}{var c=a.registerWrapper,d=a.unwrap,e=a.unwrapIfNeeded,f=a.wrap;window.Selection}b.prototype={get anchorNode(){return f(this.impl.anchorNode)},get focusNode(){return f(this.impl.focusNode)},addRange:function(a){this.impl.addRange(d(a))},collapse:function(a,b){this.impl.collapse(e(a),b)},containsNode:function(a,b){return this.impl.containsNode(e(a),b)},extend:function(a,b){this.impl.extend(e(a),b)},getRangeAt:function(a){return f(this.impl.getRangeAt(a))},removeRange:function(a){this.impl.removeRange(d(a))},selectAllChildren:function(a){this.impl.selectAllChildren(e(a))},toString:function(){return this.impl.toString()}},c(window.Selection,b,window.getSelection()),a.wrappers.Selection=b}(window.ShadowDOMPolyfill),function(a){"use strict";function b(a){k.call(this,a),this.treeScope_=new p(this,null)}function c(a){var c=document[a];b.prototype[a]=function(){return A(c.apply(this.impl,arguments))}}function d(a,b){D.call(b.impl,z(a)),e(a,b)}function e(a,b){a.shadowRoot&&b.adoptNode(a.shadowRoot),a instanceof o&&f(a,b);for(var c=a.firstChild;c;c=c.nextSibling)e(c,b)}function f(a,b){var c=a.olderShadowRoot;c&&b.adoptNode(c)}function g(a){this.impl=a}function h(a,b){var c=document.implementation[b];a.prototype[b]=function(){return A(c.apply(this.impl,arguments))}}function i(a,b){var c=document.implementation[b];a.prototype[b]=function(){return c.apply(this.impl,arguments)}}var j=a.GetElementsByInterface,k=a.wrappers.Node,l=a.ParentNodeInterface,m=a.wrappers.Selection,n=a.SelectorsInterface,o=a.wrappers.ShadowRoot,p=a.TreeScope,q=a.cloneNode,r=a.defineWrapGetter,s=a.elementFromPoint,t=a.forwardMethodsToWrapper,u=a.matchesNames,v=a.mixin,w=a.registerWrapper,x=a.renderAllPending,y=a.rewrap,z=a.unwrap,A=a.wrap,B=a.wrapEventTargetMethods,C=(a.wrapNodeList,new WeakMap);b.prototype=Object.create(k.prototype),r(b,"documentElement"),r(b,"body"),r(b,"head"),["createComment","createDocumentFragment","createElement","createElementNS","createEvent","createEventNS","createRange","createTextNode","getElementById"].forEach(c);var D=document.adoptNode,E=document.getSelection;if(v(b.prototype,{adoptNode:function(a){return a.parentNode&&a.parentNode.removeChild(a),d(a,this),a},elementFromPoint:function(a,b){return s(this,this,a,b)},importNode:function(a,b){return q(a,b,this.impl)},getSelection:function(){return x(),new m(E.call(z(this)))},getElementsByName:function(a){return n.querySelectorAll.call(this,"[name="+JSON.stringify(String(a))+"]")}}),document.registerElement){var F=document.registerElement;b.prototype.registerElement=function(b,c){function d(a){return a?void(this.impl=a):f?document.createElement(f,b):document.createElement(b)}var e,f;if(void 0!==c&&(e=c.prototype,f=c.extends),e||(e=Object.create(HTMLElement.prototype)),a.nativePrototypeTable.get(e))throw new Error("NotSupportedError");for(var g,h=Object.getPrototypeOf(e),i=[];h&&!(g=a.nativePrototypeTable.get(h));)i.push(h),h=Object.getPrototypeOf(h);if(!g)throw new Error("NotSupportedError");for(var j=Object.create(g),k=i.length-1;k>=0;k--)j=Object.create(j);["createdCallback","attachedCallback","detachedCallback","attributeChangedCallback"].forEach(function(a){var b=e[a];b&&(j[a]=function(){A(this)instanceof d||y(this),b.apply(A(this),arguments)})});var l={prototype:j};f&&(l.extends=f),d.prototype=e,d.prototype.constructor=d,a.constructorTable.set(j,d),a.nativePrototypeTable.set(e,j);F.call(z(this),b,l);return d},t([window.HTMLDocument||window.Document],["registerElement"])}t([window.HTMLBodyElement,window.HTMLDocument||window.Document,window.HTMLHeadElement,window.HTMLHtmlElement],["appendChild","compareDocumentPosition","contains","getElementsByClassName","getElementsByTagName","getElementsByTagNameNS","insertBefore","querySelector","querySelectorAll","removeChild","replaceChild"].concat(u)),t([window.HTMLDocument||window.Document],["adoptNode","importNode","contains","createComment","createDocumentFragment","createElement","createElementNS","createEvent","createEventNS","createRange","createTextNode","elementFromPoint","getElementById","getElementsByName","getSelection"]),v(b.prototype,j),v(b.prototype,l),v(b.prototype,n),v(b.prototype,{get implementation(){var a=C.get(this);return a?a:(a=new g(z(this).implementation),C.set(this,a),a)},get defaultView(){return A(z(this).defaultView)}}),w(window.Document,b,document.implementation.createHTMLDocument("")),window.HTMLDocument&&w(window.HTMLDocument,b),B([window.HTMLBodyElement,window.HTMLDocument||window.Document,window.HTMLHeadElement]),h(g,"createDocumentType"),h(g,"createDocument"),h(g,"createHTMLDocument"),i(g,"hasFeature"),w(window.DOMImplementation,g),t([window.DOMImplementation],["createDocumentType","createDocument","createHTMLDocument","hasFeature"]),a.adoptNodeNoRemove=d,a.wrappers.DOMImplementation=g,a.wrappers.Document=b}(window.ShadowDOMPolyfill),function(a){"use strict";function b(a){c.call(this,a)}var c=a.wrappers.EventTarget,d=a.wrappers.Selection,e=a.mixin,f=a.registerWrapper,g=a.renderAllPending,h=a.unwrap,i=a.unwrapIfNeeded,j=a.wrap,k=window.Window,l=window.getComputedStyle,m=window.getSelection;b.prototype=Object.create(c.prototype),k.prototype.getComputedStyle=function(a,b){return j(this||window).getComputedStyle(i(a),b)},k.prototype.getSelection=function(){return j(this||window).getSelection()},delete window.getComputedStyle,delete window.getSelection,["addEventListener","removeEventListener","dispatchEvent"].forEach(function(a){k.prototype[a]=function(){var b=j(this||window);return b[a].apply(b,arguments)},delete window[a]}),e(b.prototype,{getComputedStyle:function(a,b){return g(),l.call(h(this),i(a),b)},getSelection:function(){return g(),new d(m.call(h(this)))},get document(){return j(h(this).document)}}),f(k,b,window),a.wrappers.Window=b}(window.ShadowDOMPolyfill),function(a){"use strict";var b=a.unwrap,c=window.DataTransfer||window.Clipboard,d=c.prototype.setDragImage;c.prototype.setDragImage=function(a,c,e){d.call(this,b(a),c,e)}}(window.ShadowDOMPolyfill),function(a){"use strict";function b(a){var b=c[a],d=window[b];if(d){var e=document.createElement(a),f=e.constructor;window[b]=f}}var c=(a.isWrapperFor,{a:"HTMLAnchorElement",area:"HTMLAreaElement",audio:"HTMLAudioElement",base:"HTMLBaseElement",body:"HTMLBodyElement",br:"HTMLBRElement",button:"HTMLButtonElement",canvas:"HTMLCanvasElement",caption:"HTMLTableCaptionElement",col:"HTMLTableColElement",content:"HTMLContentElement",data:"HTMLDataElement",datalist:"HTMLDataListElement",del:"HTMLModElement",dir:"HTMLDirectoryElement",div:"HTMLDivElement",dl:"HTMLDListElement",embed:"HTMLEmbedElement",fieldset:"HTMLFieldSetElement",font:"HTMLFontElement",form:"HTMLFormElement",frame:"HTMLFrameElement",frameset:"HTMLFrameSetElement",h1:"HTMLHeadingElement",head:"HTMLHeadElement",hr:"HTMLHRElement",html:"HTMLHtmlElement",iframe:"HTMLIFrameElement",img:"HTMLImageElement",input:"HTMLInputElement",keygen:"HTMLKeygenElement",label:"HTMLLabelElement",legend:"HTMLLegendElement",li:"HTMLLIElement",link:"HTMLLinkElement",map:"HTMLMapElement",marquee:"HTMLMarqueeElement",menu:"HTMLMenuElement",menuitem:"HTMLMenuItemElement",meta:"HTMLMetaElement",meter:"HTMLMeterElement",object:"HTMLObjectElement",ol:"HTMLOListElement",optgroup:"HTMLOptGroupElement",option:"HTMLOptionElement",output:"HTMLOutputElement",p:"HTMLParagraphElement",param:"HTMLParamElement",pre:"HTMLPreElement",progress:"HTMLProgressElement",q:"HTMLQuoteElement",script:"HTMLScriptElement",select:"HTMLSelectElement",shadow:"HTMLShadowElement",source:"HTMLSourceElement",span:"HTMLSpanElement",style:"HTMLStyleElement",table:"HTMLTableElement",tbody:"HTMLTableSectionElement",template:"HTMLTemplateElement",textarea:"HTMLTextAreaElement",thead:"HTMLTableSectionElement",time:"HTMLTimeElement",title:"HTMLTitleElement",tr:"HTMLTableRowElement",track:"HTMLTrackElement",ul:"HTMLUListElement",video:"HTMLVideoElement"});Object.keys(c).forEach(b),Object.getOwnPropertyNames(a.wrappers).forEach(function(b){window[b]=a.wrappers[b]})}(window.ShadowDOMPolyfill),function(a){function b(a,c){var d,e,f,g,h=a.firstElementChild;for(e=[],f=a.shadowRoot;f;)e.push(f),f=f.olderShadowRoot;for(g=e.length-1;g>=0;g--)if(d=e[g].querySelector(c))return d;for(;h;){if(d=b(h,c))return d;h=h.nextElementSibling}return null}function c(a,b,d){var e,f,g,h,i,j=a.firstElementChild;for(g=[],f=a.shadowRoot;f;)g.push(f),f=f.olderShadowRoot;for(h=g.length-1;h>=0;h--)for(e=g[h].querySelectorAll(b),i=0;i<e.length;i++)d.push(e[i]);for(;j;)c(j,b,d),j=j.nextElementSibling;return d}window.wrap=ShadowDOMPolyfill.wrapIfNeeded,window.unwrap=ShadowDOMPolyfill.unwrapIfNeeded,Object.defineProperty(Element.prototype,"webkitShadowRoot",Object.getOwnPropertyDescriptor(Element.prototype,"shadowRoot"));var d=Element.prototype.createShadowRoot;Element.prototype.createShadowRoot=function(){var a=d.call(this);return CustomElements.watchShadow(this),a},Element.prototype.webkitCreateShadowRoot=Element.prototype.createShadowRoot,a.queryAllShadows=function(a,d,e){return e?c(a,d,[]):b(a,d)}}(window.Platform),function(a){function b(a,b){var c="";return Array.prototype.forEach.call(a,function(a){c+=a.textContent+"\n\n"}),b||(c=c.replace(l,"")),c}function c(a){var b=document.createElement("style");return b.textContent=a,b}function d(a){var b=c(a);document.head.appendChild(b);var d=[];if(b.sheet)try{d=b.sheet.cssRules}catch(e){}else console.warn("sheet not found",b);return b.parentNode.removeChild(b),d}function e(){v.initialized=!0,document.body.appendChild(v);var a=v.contentDocument,b=a.createElement("base");b.href=document.baseURI,a.head.appendChild(b)}function f(a){v.initialized||e(),document.body.appendChild(v),a(v.contentDocument),document.body.removeChild(v)}function g(a,b){if(b){var e;if(a.match("@import")&&x){var g=c(a);f(function(a){a.head.appendChild(g.impl),e=g.sheet.cssRules,b(e)})}else e=d(a),b(e)}}function h(a){a&&j().appendChild(document.createTextNode(a))}function i(a,b){var d=c(a);d.setAttribute(b,""),d.setAttribute(z,""),document.head.appendChild(d)}function j(){return w||(w=document.createElement("style"),w.setAttribute(z,""),w[z]=!0),w}var k={strictStyling:!1,registry:{},shimStyling:function(a,c,d){var e=this.prepareRoot(a,c,d),f=this.isTypeExtension(d),g=this.makeScopeSelector(c,f),h=b(e,!0);h=this.scopeCssText(h,g),a&&(a.shimmedStyle=h),this.addCssToDocument(h,c)},shimStyle:function(a,b){return this.shimCssText(a.textContent,b)},shimCssText:function(a,b){return a=this.insertDirectives(a),this.scopeCssText(a,b)},makeScopeSelector:function(a,b){return a?b?"[is="+a+"]":a:""},isTypeExtension:function(a){return a&&a.indexOf("-")<0},prepareRoot:function(a,b,c){var d=this.registerRoot(a,b,c);return this.replaceTextInStyles(d.rootStyles,this.insertDirectives),this.removeStyles(a,d.rootStyles),this.strictStyling&&this.applyScopeToContent(a,b),d.scopeStyles},removeStyles:function(a,b){for(var c,d=0,e=b.length;e>d&&(c=b[d]);d++)c.parentNode.removeChild(c)},registerRoot:function(a,b,c){var d=this.registry[b]={root:a,name:b,extendsName:c},e=this.findStyles(a);d.rootStyles=e,d.scopeStyles=d.rootStyles;var f=this.registry[d.extendsName];return f&&(d.scopeStyles=f.scopeStyles.concat(d.scopeStyles)),d},findStyles:function(a){if(!a)return[];var b=a.querySelectorAll("style");return Array.prototype.filter.call(b,function(a){return!a.hasAttribute(A)})},applyScopeToContent:function(a,b){a&&(Array.prototype.forEach.call(a.querySelectorAll("*"),function(a){a.setAttribute(b,"")}),Array.prototype.forEach.call(a.querySelectorAll("template"),function(a){this.applyScopeToContent(a.content,b)},this))},insertDirectives:function(a){return a=this.insertPolyfillDirectivesInCssText(a),this.insertPolyfillRulesInCssText(a)},insertPolyfillDirectivesInCssText:function(a){return a=a.replace(m,function(a,b){return b.slice(0,-2)+"{"}),a.replace(n,function(a,b){return b+" {"})},insertPolyfillRulesInCssText:function(a){return a=a.replace(o,function(a,b){return b.slice(0,-1)}),a.replace(p,function(a,b,c,d){var e=a.replace(b,"").replace(c,"");return d+e})},scopeCssText:function(a,b){var c=this.extractUnscopedRulesFromCssText(a);if(a=this.insertPolyfillHostInCssText(a),a=this.convertColonHost(a),a=this.convertColonHostContext(a),a=this.convertCombinators(a),b){var a,d=this;g(a,function(c){a=d.scopeRules(c,b)})}return a=a+"\n"+c,a.trim()},extractUnscopedRulesFromCssText:function(a){for(var b,c="";b=q.exec(a);)c+=b[1].slice(0,-1)+"\n\n";for(;b=r.exec(a);)c+=b[0].replace(b[2],"").replace(b[1],b[3])+"\n\n";return c},convertColonHost:function(a){return this.convertColonRule(a,cssColonHostRe,this.colonHostPartReplacer)},convertColonHostContext:function(a){return this.convertColonRule(a,cssColonHostContextRe,this.colonHostContextPartReplacer)},convertColonRule:function(a,b,c){return a.replace(b,function(a,b,d,e){if(b=polyfillHostNoCombinator,d){for(var f,g=d.split(","),h=[],i=0,j=g.length;j>i&&(f=g[i]);i++)f=f.trim(),h.push(c(b,f,e));return h.join(",")}return b+e})},colonHostContextPartReplacer:function(a,b,c){return b.match(s)?this.colonHostPartReplacer(a,b,c):a+b+c+", "+b+" "+a+c},colonHostPartReplacer:function(a,b,c){return a+b.replace(s,"")+c},convertCombinators:function(a){for(var b=0;b<combinatorsRe.length;b++)a=a.replace(combinatorsRe[b]," ");return a},scopeRules:function(a,b){var c="";return a&&Array.prototype.forEach.call(a,function(a){if(a.selectorText&&a.style&&void 0!==a.style.cssText)c+=this.scopeSelector(a.selectorText,b,this.strictStyling)+" {\n	",c+=this.propertiesFromRule(a)+"\n}\n\n";else if(a.type===CSSRule.MEDIA_RULE)c+="@media "+a.media.mediaText+" {\n",c+=this.scopeRules(a.cssRules,b),c+="\n}\n\n";else try{a.cssText&&(c+=a.cssText+"\n\n")}catch(d){}},this),c},scopeSelector:function(a,b,c){var d=[],e=a.split(",");return e.forEach(function(a){a=a.trim(),this.selectorNeedsScoping(a,b)&&(a=c&&!a.match(polyfillHostNoCombinator)?this.applyStrictSelectorScope(a,b):this.applySelectorScope(a,b)),d.push(a)},this),d.join(", ")},selectorNeedsScoping:function(a,b){if(Array.isArray(b))return!0;var c=this.makeScopeMatcher(b);return!a.match(c)},makeScopeMatcher:function(a){return a=a.replace(/\[/g,"\\[").replace(/\[/g,"\\]"),new RegExp("^("+a+")"+selectorReSuffix,"m")},applySelectorScope:function(a,b){return Array.isArray(b)?this.applySelectorScopeList(a,b):this.applySimpleSelectorScope(a,b)},applySelectorScopeList:function(a,b){for(var c,d=[],e=0;c=b[e];e++)d.push(this.applySimpleSelectorScope(a,c));return d.join(", ")},applySimpleSelectorScope:function(a,b){return a.match(polyfillHostRe)?(a=a.replace(polyfillHostNoCombinator,b),a.replace(polyfillHostRe,b+" ")):b+" "+a},applyStrictSelectorScope:function(a,b){b=b.replace(/\[is=([^\]]*)\]/g,"$1");var c=[" ",">","+","~"],d=a,e="["+b+"]";return c.forEach(function(a){var b=d.split(a);d=b.map(function(a){var b=a.trim().replace(polyfillHostRe,"");return b&&c.indexOf(b)<0&&b.indexOf(e)<0&&(a=b.replace(/([^:]*)(:*)(.*)/,"$1"+e+"$2$3")),a}).join(a)}),d},insertPolyfillHostInCssText:function(a){return a.replace(colonHostContextRe,t).replace(colonHostRe,s)},propertiesFromRule:function(a){var b=a.style.cssText;a.style.content&&!a.style.content.match(/['"]+|attr/)&&(b=b.replace(/content:[^;]*;/g,"content: '"+a.style.content+"';"));var c=a.style;for(var d in c)"initial"===c[d]&&(b+=d+": initial; ");return b},replaceTextInStyles:function(a,b){a&&b&&(a instanceof Array||(a=[a]),Array.prototype.forEach.call(a,function(a){a.textContent=b.call(this,a.textContent)},this))},addCssToDocument:function(a,b){a.match("@import")?i(a,b):h(a)}},l=/\/\*[^*]*\*+([^/*][^*]*\*+)*\//gim,m=/\/\*\s*@polyfill ([^*]*\*+([^/*][^*]*\*+)*\/)([^{]*?){/gim,n=/polyfill-next-selector[^}]*content\:[\s]*'([^']*)'[^}]*}([^{]*?){/gim,o=/\/\*\s@polyfill-rule([^*]*\*+([^/*][^*]*\*+)*)\//gim,p=/(polyfill-rule)[^}]*(content\:[\s]*'([^']*)'[^;]*;)[^}]*}/gim,q=/\/\*\s@polyfill-unscoped-rule([^*]*\*+([^/*][^*]*\*+)*)\//gim,r=/(polyfill-unscoped-rule)[^}]*(content\:[\s]*'([^']*)'[^;]*;)[^}]*}/gim,s="-shadowcsshost",t="-shadowcsscontext",u=")(?:\\(((?:\\([^)(]*\\)|[^)(]*)+?)\\))?([^,{]*)";cssColonHostRe=new RegExp("("+s+u,"gim"),cssColonHostContextRe=new RegExp("("+t+u,"gim"),selectorReSuffix="([>\\s~+[.,{:][\\s\\S]*)?$",colonHostRe=/\:host/gim,colonHostContextRe=/\:host-context/gim,polyfillHostNoCombinator=s+"-no-combinator",polyfillHostRe=new RegExp(s,"gim"),polyfillHostContextRe=new RegExp(t,"gim"),combinatorsRe=[/\^\^/g,/\^/g,/\/shadow\//g,/\/shadow-deep\//g,/::shadow/g,/\/deep\//g];var v=document.createElement("iframe");v.style.display="none";var w,x=navigator.userAgent.match("Chrome"),y="shim-shadowdom",z="shim-shadowdom-css",A="no-shim";if(window.ShadowDOMPolyfill){h("style { display: none !important; }\n");var B=wrap(document),C=B.querySelector("head");C.insertBefore(j(),C.childNodes[0]),document.addEventListener("DOMContentLoaded",function(){var b=a.urlResolver;if(window.HTMLImports&&!HTMLImports.useNative){var c="link[rel=stylesheet]["+y+"]",d="style["+y+"]";HTMLImports.importer.documentPreloadSelectors+=","+c,HTMLImports.importer.importsPreloadSelectors+=","+c,HTMLImports.parser.documentSelectors=[HTMLImports.parser.documentSelectors,c,d].join(",");var e=HTMLImports.parser.parseGeneric;HTMLImports.parser.parseGeneric=function(a){if(!a[z]){var c=a.__importElement||a;if(!c.hasAttribute(y))return void e.call(this,a);a.__resource?(c=a.ownerDocument.createElement("style"),c.textContent=b.resolveCssText(a.__resource,a.href)):b.resolveStyle(c),c.textContent=k.shimStyle(c),c.removeAttribute(y,""),c.setAttribute(z,""),c[z]=!0,c.parentNode!==C&&(a.parentNode===C?C.replaceChild(c,a):C.appendChild(c)),c.__importParsed=!0,this.markParsingComplete(a),this.parseNext()}};var f=HTMLImports.parser.hasResource;HTMLImports.parser.hasResource=function(a){return"link"===a.localName&&"stylesheet"===a.rel&&a.hasAttribute(y)?a.__resource:f.call(this,a)}}})}a.ShadowCSS=k}(window.Platform)):!function(){window.wrap=window.unwrap=function(a){return a},addEventListener("DOMContentLoaded",function(){if(CustomElements.useNative===!1){var a=Element.prototype.createShadowRoot;Element.prototype.createShadowRoot=function(){var b=a.call(this);return CustomElements.watchShadow(this),b}}}),Platform.templateContent=function(a){if(window.HTMLTemplateElement&&HTMLTemplateElement.bootstrap&&HTMLTemplateElement.bootstrap(a),!a.content&&!a._content){for(var b=document.createDocumentFragment();a.firstChild;)b.appendChild(a.firstChild);a._content=b}return a.content||a._content}}(window.Platform),function(a){"use strict";function b(a){return void 0!==m[a]}function c(){h.call(this),this._isInvalid=!0}function d(a){return""==a&&c.call(this),a.toLowerCase()}function e(a){var b=a.charCodeAt(0);return b>32&&127>b&&-1==[34,35,60,62,63,96].indexOf(b)?a:encodeURIComponent(a)}function f(a){var b=a.charCodeAt(0);return b>32&&127>b&&-1==[34,35,60,62,96].indexOf(b)?a:encodeURIComponent(a)}function g(a,g,h){function i(a){t.push(a)}var j=g||"scheme start",k=0,l="",r=!1,s=!1,t=[];a:for(;(a[k-1]!=o||0==k)&&!this._isInvalid;){var u=a[k];switch(j){case"scheme start":if(!u||!p.test(u)){if(g){i("Invalid scheme.");break a}l="",j="no scheme";continue}l+=u.toLowerCase(),j="scheme";break;case"scheme":if(u&&q.test(u))l+=u.toLowerCase();else{if(":"!=u){if(g){if(o==u)break a;i("Code point not allowed in scheme: "+u);break a}l="",k=0,j="no scheme";continue}if(this._scheme=l,l="",g)break a;b(this._scheme)&&(this._isRelative=!0),j="file"==this._scheme?"relative":this._isRelative&&h&&h._scheme==this._scheme?"relative or authority":this._isRelative?"authority first slash":"scheme data"}break;case"scheme data":"?"==u?(query="?",j="query"):"#"==u?(this._fragment="#",j="fragment"):o!=u&&"	"!=u&&"\n"!=u&&"\r"!=u&&(this._schemeData+=e(u));break;case"no scheme":if(h&&b(h._scheme)){j="relative";continue}i("Missing scheme."),c.call(this);break;case"relative or authority":if("/"!=u||"/"!=a[k+1]){i("Expected /, got: "+u),j="relative";continue}j="authority ignore slashes";break;case"relative":if(this._isRelative=!0,"file"!=this._scheme&&(this._scheme=h._scheme),o==u){this._host=h._host,this._port=h._port,this._path=h._path.slice(),this._query=h._query;break a}if("/"==u||"\\"==u)"\\"==u&&i("\\ is an invalid code point."),j="relative slash";else if("?"==u)this._host=h._host,this._port=h._port,this._path=h._path.slice(),this._query="?",j="query";else{if("#"!=u){var v=a[k+1],w=a[k+2];("file"!=this._scheme||!p.test(u)||":"!=v&&"|"!=v||o!=w&&"/"!=w&&"\\"!=w&&"?"!=w&&"#"!=w)&&(this._host=h._host,this._port=h._port,this._path=h._path.slice(),this._path.pop()),j="relative path";continue}this._host=h._host,this._port=h._port,this._path=h._path.slice(),this._query=h._query,this._fragment="#",j="fragment"}break;case"relative slash":if("/"!=u&&"\\"!=u){"file"!=this._scheme&&(this._host=h._host,this._port=h._port),j="relative path";
continue}"\\"==u&&i("\\ is an invalid code point."),j="file"==this._scheme?"file host":"authority ignore slashes";break;case"authority first slash":if("/"!=u){i("Expected '/', got: "+u),j="authority ignore slashes";continue}j="authority second slash";break;case"authority second slash":if(j="authority ignore slashes","/"!=u){i("Expected '/', got: "+u);continue}break;case"authority ignore slashes":if("/"!=u&&"\\"!=u){j="authority";continue}i("Expected authority, got: "+u);break;case"authority":if("@"==u){r&&(i("@ already seen."),l+="%40"),r=!0;for(var x=0;x<l.length;x++){var y=l[x];if("	"!=y&&"\n"!=y&&"\r"!=y)if(":"!=y||null!==this._password){var z=e(y);null!==this._password?this._password+=z:this._username+=z}else this._password="";else i("Invalid whitespace in authority.")}l=""}else{if(o==u||"/"==u||"\\"==u||"?"==u||"#"==u){k-=l.length,l="",j="host";continue}l+=u}break;case"file host":if(o==u||"/"==u||"\\"==u||"?"==u||"#"==u){2!=l.length||!p.test(l[0])||":"!=l[1]&&"|"!=l[1]?0==l.length?j="relative path start":(this._host=d.call(this,l),l="",j="relative path start"):j="relative path";continue}"	"==u||"\n"==u||"\r"==u?i("Invalid whitespace in file host."):l+=u;break;case"host":case"hostname":if(":"!=u||s){if(o==u||"/"==u||"\\"==u||"?"==u||"#"==u){if(this._host=d.call(this,l),l="",j="relative path start",g)break a;continue}"	"!=u&&"\n"!=u&&"\r"!=u?("["==u?s=!0:"]"==u&&(s=!1),l+=u):i("Invalid code point in host/hostname: "+u)}else if(this._host=d.call(this,l),l="",j="port","hostname"==g)break a;break;case"port":if(/[0-9]/.test(u))l+=u;else{if(o==u||"/"==u||"\\"==u||"?"==u||"#"==u||g){if(""!=l){var A=parseInt(l,10);A!=m[this._scheme]&&(this._port=A+""),l=""}if(g)break a;j="relative path start";continue}"	"==u||"\n"==u||"\r"==u?i("Invalid code point in port: "+u):c.call(this)}break;case"relative path start":if("\\"==u&&i("'\\' not allowed in path."),j="relative path","/"!=u&&"\\"!=u)continue;break;case"relative path":if(o!=u&&"/"!=u&&"\\"!=u&&(g||"?"!=u&&"#"!=u))"	"!=u&&"\n"!=u&&"\r"!=u&&(l+=e(u));else{"\\"==u&&i("\\ not allowed in relative path.");var B;(B=n[l.toLowerCase()])&&(l=B),".."==l?(this._path.pop(),"/"!=u&&"\\"!=u&&this._path.push("")):"."==l&&"/"!=u&&"\\"!=u?this._path.push(""):"."!=l&&("file"==this._scheme&&0==this._path.length&&2==l.length&&p.test(l[0])&&"|"==l[1]&&(l=l[0]+":"),this._path.push(l)),l="","?"==u?(this._query="?",j="query"):"#"==u&&(this._fragment="#",j="fragment")}break;case"query":g||"#"!=u?o!=u&&"	"!=u&&"\n"!=u&&"\r"!=u&&(this._query+=f(u)):(this._fragment="#",j="fragment");break;case"fragment":o!=u&&"	"!=u&&"\n"!=u&&"\r"!=u&&(this._fragment+=u)}k++}}function h(){this._scheme="",this._schemeData="",this._username="",this._password=null,this._host="",this._port="",this._path=[],this._query="",this._fragment="",this._isInvalid=!1,this._isRelative=!1}function i(a,b){void 0===b||b instanceof i||(b=new i(String(b))),this._url=a,h.call(this);var c=a.replace(/^[ \t\r\n\f]+|[ \t\r\n\f]+$/g,"");g.call(this,c,null,b)}var j=!1;if(!a.forceJURL)try{var k=new URL("b","http://a");j="http://a/b"===k.href}catch(l){}if(!j){var m=Object.create(null);m.ftp=21,m.file=0,m.gopher=70,m.http=80,m.https=443,m.ws=80,m.wss=443;var n=Object.create(null);n["%2e"]=".",n[".%2e"]="..",n["%2e."]="..",n["%2e%2e"]="..";var o=void 0,p=/[a-zA-Z]/,q=/[a-zA-Z0-9\+\-\.]/;i.prototype={get href(){if(this._isInvalid)return this._url;var a="";return(""!=this._username||null!=this._password)&&(a=this._username+(null!=this._password?":"+this._password:"")+"@"),this.protocol+(this._isRelative?"//"+a+this.host:"")+this.pathname+this._query+this._fragment},set href(a){h.call(this),g.call(this,a)},get protocol(){return this._scheme+":"},set protocol(a){this._isInvalid||g.call(this,a+":","scheme start")},get host(){return this._isInvalid?"":this._port?this._host+":"+this._port:this._host},set host(a){!this._isInvalid&&this._isRelative&&g.call(this,a,"host")},get hostname(){return this._host},set hostname(a){!this._isInvalid&&this._isRelative&&g.call(this,a,"hostname")},get port(){return this._port},set port(a){!this._isInvalid&&this._isRelative&&g.call(this,a,"port")},get pathname(){return this._isInvalid?"":this._isRelative?"/"+this._path.join("/"):this._schemeData},set pathname(a){!this._isInvalid&&this._isRelative&&(this._path=[],g.call(this,a,"relative path start"))},get search(){return this._isInvalid||!this._query||"?"==this._query?"":this._query},set search(a){!this._isInvalid&&this._isRelative&&(this._query="?","?"==a[0]&&(a=a.slice(1)),g.call(this,a,"query"))},get hash(){return this._isInvalid||!this._fragment||"#"==this._fragment?"":this._fragment},set hash(a){this._isInvalid||(this._fragment="#","#"==a[0]&&(a=a.slice(1)),g.call(this,a,"fragment"))}},a.URL=i}}(window),function(a){function b(a){for(var b=a||{},d=1;d<arguments.length;d++){var e=arguments[d];try{for(var f in e)c(f,e,b)}catch(g){}}return b}function c(a,b,c){var e=d(b,a);Object.defineProperty(c,a,e)}function d(a,b){if(a){var c=Object.getOwnPropertyDescriptor(a,b);return c||d(Object.getPrototypeOf(a),b)}}Function.prototype.bind||(Function.prototype.bind=function(a){var b=this,c=Array.prototype.slice.call(arguments,1);return function(){var d=c.slice();return d.push.apply(d,arguments),b.apply(a,d)}}),a.mixin=b}(window.Platform),function(a){"use strict";function b(a,b,c){var d="string"==typeof a?document.createElement(a):a.cloneNode(!0);if(d.innerHTML=b,c)for(var e in c)d.setAttribute(e,c[e]);return d}var c=DOMTokenList.prototype.add,d=DOMTokenList.prototype.remove;DOMTokenList.prototype.add=function(){for(var a=0;a<arguments.length;a++)c.call(this,arguments[a])},DOMTokenList.prototype.remove=function(){for(var a=0;a<arguments.length;a++)d.call(this,arguments[a])},DOMTokenList.prototype.toggle=function(a,b){1==arguments.length&&(b=!this.contains(a)),b?this.add(a):this.remove(a)},DOMTokenList.prototype.switch=function(a,b){a&&this.remove(a),b&&this.add(b)};var e=function(){return Array.prototype.slice.call(this)},f=window.NamedNodeMap||window.MozNamedAttrMap||{};if(NodeList.prototype.array=e,f.prototype.array=e,HTMLCollection.prototype.array=e,!window.performance){var g=Date.now();window.performance={now:function(){return Date.now()-g}}}window.requestAnimationFrame||(window.requestAnimationFrame=function(){var a=window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame;return a?function(b){return a(function(){b(performance.now())})}:function(a){return window.setTimeout(a,1e3/60)}}()),window.cancelAnimationFrame||(window.cancelAnimationFrame=function(){return window.webkitCancelAnimationFrame||window.mozCancelAnimationFrame||function(a){clearTimeout(a)}}());var h=[],i=function(){h.push(arguments)};window.Polymer=i,a.deliverDeclarations=function(){return a.deliverDeclarations=function(){throw"Possible attempt to load Polymer twice"},h},window.addEventListener("DOMContentLoaded",function(){window.Polymer===i&&(window.Polymer=function(){console.error('You tried to use polymer without loading it first. To load polymer, <link rel="import" href="components/polymer/polymer.html">')})}),a.createDOM=b}(window.Platform),function(a){a.templateContent=a.templateContent||function(a){return a.content}}(window.Platform),function(a){a=a||(window.Inspector={});var b;window.sinspect=function(a,d){b||(b=window.open("","ShadowDOM Inspector",null,!0),b.document.write(c),b.api={shadowize:shadowize}),f(a||wrap(document.body),d)};var c=["<!DOCTYPE html>","<html>","  <head>","    <title>ShadowDOM Inspector</title>","    <style>","      body {","      }","      pre {",'        font: 9pt "Courier New", monospace;',"        line-height: 1.5em;","      }","      tag {","        color: purple;","      }","      ul {","         margin: 0;","         padding: 0;","         list-style: none;","      }","      li {","         display: inline-block;","         background-color: #f1f1f1;","         padding: 4px 6px;","         border-radius: 4px;","         margin-right: 4px;","      }","    </style>","  </head>","  <body>",'    <ul id="crumbs">',"    </ul>",'    <div id="tree"></div>',"  </body>","</html>"].join("\n"),d=[],e=function(){var a=b.document,c=a.querySelector("#crumbs");c.textContent="";for(var e,g=0;e=d[g];g++){var h=a.createElement("a");h.href="#",h.textContent=e.localName,h.idx=g,h.onclick=function(a){for(var b;d.length>this.idx;)b=d.pop();f(b.shadow||b,b),a.preventDefault()},c.appendChild(a.createElement("li")).appendChild(h)}},f=function(a,c){var f=b.document;k=[];var g=c||a;d.push(g),e(),f.body.querySelector("#tree").innerHTML="<pre>"+j(a,a.childNodes)+"</pre>"},g=Array.prototype.forEach.call.bind(Array.prototype.forEach),h={STYLE:1,SCRIPT:1,"#comment":1,TEMPLATE:1},i=function(a){return h[a.nodeName]},j=function(a,b,c){if(i(a))return"";var d=c||"";if(a.localName||11==a.nodeType){var e=a.localName||"shadow-root",f=d+l(a);"content"==e&&(b=a.getDistributedNodes()),f+="<br/>";var h=d+"&nbsp;&nbsp;";g(b,function(a){f+=j(a,a.childNodes,h)}),f+=d,{br:1}[e]||(f+="<tag>&lt;/"+e+"&gt;</tag>",f+="<br/>")}else{var k=a.textContent.trim();f=k?d+'"'+k+'"<br/>':""}return f},k=[],l=function(a){var b="<tag>&lt;",c=a.localName||"shadow-root";return a.webkitShadowRoot||a.shadowRoot?(b+=' <button idx="'+k.length+'" onclick="api.shadowize.call(this)">'+c+"</button>",k.push(a)):b+=c||"shadow-root",a.attributes&&g(a.attributes,function(a){b+=" "+a.name+(a.value?'="'+a.value+'"':"")}),b+="&gt;</tag>"};shadowize=function(){var a=Number(this.attributes.idx.value),b=k[a];b?f(b.webkitShadowRoot||b.shadowRoot,b):(console.log("bad shadowize node"),console.dir(this))},a.output=j}(window.Inspector),function(){var a=document.createElement("style");a.textContent="body {transition: opacity ease-in 0.2s; } \nbody[unresolved] {opacity: 0; display: block; overflow: hidden; } \n";var b=document.querySelector("head");b.insertBefore(a,b.firstChild)}(Platform),function(a){function b(a,b){return b=b||[],b.map||(b=[b]),a.apply(this,b.map(d))}function c(a,c,d){var e;switch(arguments.length){case 0:return;case 1:e=null;break;case 2:e=c.apply(this);break;default:e=b(d,c)}f[a]=e}function d(a){return f[a]}function e(a,c){HTMLImports.whenImportsReady(function(){b(c,a)})}var f={};a.marshal=d,a.modularize=c,a.using=e}(window),function(a){function b(a){f.textContent=d++,e.push(a)}function c(){for(;e.length;)e.shift()()}var d=0,e=[],f=document.createTextNode("");new(window.MutationObserver||JsMutationObserver)(c).observe(f,{characterData:!0}),a.endOfMicrotask=b}(Platform),function(a){function b(a,b,d,e){return a.replace(e,function(a,e,f,g){var h=f.replace(/["']/g,"");return h=c(b,h,d),e+"'"+h+"'"+g})}function c(a,b,c){if(b&&"/"===b[0])return b;var e=new URL(b,a);return c?e.href:d(e.href)}function d(a){var b=new URL(document.baseURI),c=new URL(a,b);return c.host===b.host&&c.port===b.port&&c.protocol===b.protocol?e(b,c):a}function e(a,b){for(var c=a.pathname,d=b.pathname,e=c.split("/"),f=d.split("/");e.length&&e[0]===f[0];)e.shift(),f.shift();for(var g=0,h=e.length-1;h>g;g++)f.unshift("..");return f.join("/")+b.search+b.hash}var f={resolveDom:function(a,b){b=b||a.ownerDocument.baseURI,this.resolveAttributes(a,b),this.resolveStyles(a,b);var c=a.querySelectorAll("template");if(c)for(var d,e=0,f=c.length;f>e&&(d=c[e]);e++)d.content&&this.resolveDom(d.content,b)},resolveTemplate:function(a){this.resolveDom(a.content,a.ownerDocument.baseURI)},resolveStyles:function(a,b){var c=a.querySelectorAll("style");if(c)for(var d,e=0,f=c.length;f>e&&(d=c[e]);e++)this.resolveStyle(d,b)},resolveStyle:function(a,b){b=b||a.ownerDocument.baseURI,a.textContent=this.resolveCssText(a.textContent,b)},resolveCssText:function(a,c,d){return a=b(a,c,d,g),b(a,c,d,h)},resolveAttributes:function(a,b){a.hasAttributes&&a.hasAttributes()&&this.resolveElementAttributes(a,b);var c=a&&a.querySelectorAll(j);if(c)for(var d,e=0,f=c.length;f>e&&(d=c[e]);e++)this.resolveElementAttributes(d,b)},resolveElementAttributes:function(a,d){d=d||a.ownerDocument.baseURI,i.forEach(function(e){var f,h=a.attributes[e],i=h&&h.value;i&&i.search(k)<0&&(f="style"===e?b(i,d,!1,g):c(d,i),h.value=f)})}},g=/(url\()([^)]*)(\))/g,h=/(@import[\s]+(?!url\())([^;]*)(;)/g,i=["href","src","action","style","url"],j="["+i.join("],[")+"]",k="{{.*}}";a.urlResolver=f}(Platform),function(a){function b(a){u.push(a),t||(t=!0,q(d))}function c(a){return window.ShadowDOMPolyfill&&window.ShadowDOMPolyfill.wrapIfNeeded(a)||a}function d(){t=!1;var a=u;u=[],a.sort(function(a,b){return a.uid_-b.uid_});var b=!1;a.forEach(function(a){var c=a.takeRecords();e(a),c.length&&(a.callback_(c,a),b=!0)}),b&&d()}function e(a){a.nodes_.forEach(function(b){var c=p.get(b);c&&c.forEach(function(b){b.observer===a&&b.removeTransientObservers()})})}function f(a,b){for(var c=a;c;c=c.parentNode){var d=p.get(c);if(d)for(var e=0;e<d.length;e++){var f=d[e],g=f.options;if(c===a||g.subtree){var h=b(g);h&&f.enqueue(h)}}}}function g(a){this.callback_=a,this.nodes_=[],this.records_=[],this.uid_=++v}function h(a,b){this.type=a,this.target=b,this.addedNodes=[],this.removedNodes=[],this.previousSibling=null,this.nextSibling=null,this.attributeName=null,this.attributeNamespace=null,this.oldValue=null}function i(a){var b=new h(a.type,a.target);return b.addedNodes=a.addedNodes.slice(),b.removedNodes=a.removedNodes.slice(),b.previousSibling=a.previousSibling,b.nextSibling=a.nextSibling,b.attributeName=a.attributeName,b.attributeNamespace=a.attributeNamespace,b.oldValue=a.oldValue,b}function j(a,b){return w=new h(a,b)}function k(a){return x?x:(x=i(w),x.oldValue=a,x)}function l(){w=x=void 0}function m(a){return a===x||a===w}function n(a,b){return a===b?a:x&&m(a)?x:null}function o(a,b,c){this.observer=a,this.target=b,this.options=c,this.transientObservedNodes=[]}var p=new WeakMap,q=window.msSetImmediate;if(!q){var r=[],s=String(Math.random());window.addEventListener("message",function(a){if(a.data===s){var b=r;r=[],b.forEach(function(a){a()})}}),q=function(a){r.push(a),window.postMessage(s,"*")}}var t=!1,u=[],v=0;g.prototype={observe:function(a,b){if(a=c(a),!b.childList&&!b.attributes&&!b.characterData||b.attributeOldValue&&!b.attributes||b.attributeFilter&&b.attributeFilter.length&&!b.attributes||b.characterDataOldValue&&!b.characterData)throw new SyntaxError;var d=p.get(a);d||p.set(a,d=[]);for(var e,f=0;f<d.length;f++)if(d[f].observer===this){e=d[f],e.removeListeners(),e.options=b;break}e||(e=new o(this,a,b),d.push(e),this.nodes_.push(a)),e.addListeners()},disconnect:function(){this.nodes_.forEach(function(a){for(var b=p.get(a),c=0;c<b.length;c++){var d=b[c];if(d.observer===this){d.removeListeners(),b.splice(c,1);break}}},this),this.records_=[]},takeRecords:function(){var a=this.records_;return this.records_=[],a}};var w,x;o.prototype={enqueue:function(a){var c=this.observer.records_,d=c.length;if(c.length>0){var e=c[d-1],f=n(e,a);if(f)return void(c[d-1]=f)}else b(this.observer);c[d]=a},addListeners:function(){this.addListeners_(this.target)},addListeners_:function(a){var b=this.options;b.attributes&&a.addEventListener("DOMAttrModified",this,!0),b.characterData&&a.addEventListener("DOMCharacterDataModified",this,!0),b.childList&&a.addEventListener("DOMNodeInserted",this,!0),(b.childList||b.subtree)&&a.addEventListener("DOMNodeRemoved",this,!0)},removeListeners:function(){this.removeListeners_(this.target)},removeListeners_:function(a){var b=this.options;b.attributes&&a.removeEventListener("DOMAttrModified",this,!0),b.characterData&&a.removeEventListener("DOMCharacterDataModified",this,!0),b.childList&&a.removeEventListener("DOMNodeInserted",this,!0),(b.childList||b.subtree)&&a.removeEventListener("DOMNodeRemoved",this,!0)},addTransientObserver:function(a){if(a!==this.target){this.addListeners_(a),this.transientObservedNodes.push(a);var b=p.get(a);b||p.set(a,b=[]),b.push(this)}},removeTransientObservers:function(){var a=this.transientObservedNodes;this.transientObservedNodes=[],a.forEach(function(a){this.removeListeners_(a);for(var b=p.get(a),c=0;c<b.length;c++)if(b[c]===this){b.splice(c,1);break}},this)},handleEvent:function(a){switch(a.stopImmediatePropagation(),a.type){case"DOMAttrModified":var b=a.attrName,c=a.relatedNode.namespaceURI,d=a.target,e=new j("attributes",d);e.attributeName=b,e.attributeNamespace=c;var g=a.attrChange===MutationEvent.ADDITION?null:a.prevValue;f(d,function(a){return!a.attributes||a.attributeFilter&&a.attributeFilter.length&&-1===a.attributeFilter.indexOf(b)&&-1===a.attributeFilter.indexOf(c)?void 0:a.attributeOldValue?k(g):e});break;case"DOMCharacterDataModified":var d=a.target,e=j("characterData",d),g=a.prevValue;f(d,function(a){return a.characterData?a.characterDataOldValue?k(g):e:void 0});break;case"DOMNodeRemoved":this.addTransientObserver(a.target);case"DOMNodeInserted":var h,i,d=a.relatedNode,m=a.target;"DOMNodeInserted"===a.type?(h=[m],i=[]):(h=[],i=[m]);var n=m.previousSibling,o=m.nextSibling,e=j("childList",d);e.addedNodes=h,e.removedNodes=i,e.previousSibling=n,e.nextSibling=o,f(d,function(a){return a.childList?e:void 0})}l()}},a.JsMutationObserver=g,a.MutationObserver||(a.MutationObserver=g)}(this),window.HTMLImports=window.HTMLImports||{flags:{}},function(a){var b=(a.path,a.xhr),c=a.flags,d=function(a,b){this.cache={},this.onload=a,this.oncomplete=b,this.inflight=0,this.pending={}};d.prototype={addNodes:function(a){this.inflight+=a.length;for(var b,c=0,d=a.length;d>c&&(b=a[c]);c++)this.require(b);this.checkDone()},addNode:function(a){this.inflight++,this.require(a),this.checkDone()},require:function(a){var b=a.src||a.href;a.__nodeUrl=b,this.dedupe(b,a)||this.fetch(b,a)},dedupe:function(a,b){if(this.pending[a])return this.pending[a].push(b),!0;return this.cache[a]?(this.onload(a,b,this.cache[a]),this.tail(),!0):(this.pending[a]=[b],!1)},fetch:function(a,d){if(c.load&&console.log("fetch",a,d),a.match(/^data:/)){var e=a.split(","),f=e[0],g=e[1];g=f.indexOf(";base64")>-1?atob(g):decodeURIComponent(g),setTimeout(function(){this.receive(a,d,null,g)}.bind(this),0)}else{var h=function(b,c,e){this.receive(a,d,b,c,e)}.bind(this);b.load(a,h)}},receive:function(a,b,c,d,e){this.cache[a]=d;var f=this.pending[a];e&&e!==a&&(this.cache[e]=d,f=f.concat(this.pending[e]));for(var g,h=0,i=f.length;i>h&&(g=f[h]);h++)this.onload(e||a,g,d),this.tail();this.pending[a]=null,e&&e!==a&&(this.pending[e]=null)},tail:function(){--this.inflight,this.checkDone()},checkDone:function(){this.inflight||this.oncomplete()}},b=b||{async:!0,ok:function(a){return a.status>=200&&a.status<300||304===a.status||0===a.status},load:function(c,d,e){var f=new XMLHttpRequest;return(a.flags.debug||a.flags.bust)&&(c+="?"+Math.random()),f.open("GET",c,b.async),f.addEventListener("readystatechange",function(){if(4===f.readyState){var a=f.getResponseHeader("Location"),c=null;if(a)var c="/"===a.substr(0,1)?location.origin+a:c;d.call(e,!b.ok(f)&&f,f.response||f.responseText,c)}}),f.send(),f},loadDocument:function(a,b,c){this.load(a,b,c).responseType="document"}},a.xhr=b,a.Loader=d}(window.HTMLImports),function(a){function b(a){return"link"===a.localName&&a.rel===g}function c(a){var b,c=d(a);try{b=btoa(c)}catch(e){b=btoa(unescape(encodeURIComponent(c))),console.warn("Script contained non-latin characters that were forced to latin. Some characters may be wrong.",a)}return"data:text/javascript;base64,"+b}function d(a){return a.textContent+e(a)}function e(a){var b=a.__nodeUrl;if(!b){b=a.ownerDocument.baseURI;var c="["+Math.floor(1e3*(Math.random()+1))+"]",d=a.textContent.match(/Polymer\(['"]([^'"]*)/);c=d&&d[1]||c,b+="/"+c+".js"}return"\n//# sourceURL="+b+"\n"}function f(a){var b=a.ownerDocument.createElement("style");return b.textContent=a.textContent,n.resolveUrlsInStyle(b),b}var g="import",h=a.flags,i=/Trident/.test(navigator.userAgent),j=window.ShadowDOMPolyfill?window.ShadowDOMPolyfill.wrapIfNeeded(document):document,k={documentSelectors:"link[rel="+g+"]",importsSelectors:["link[rel="+g+"]","link[rel=stylesheet]","style","script:not([type])",'script[type="text/javascript"]'].join(","),map:{link:"parseLink",script:"parseScript",style:"parseStyle"},parseNext:function(){var a=this.nextToParse();a&&this.parse(a)},parse:function(a){if(this.isParsed(a))return void(h.parse&&console.log("[%s] is already parsed",a.localName));var b=this[this.map[a.localName]];b&&(this.markParsing(a),b.call(this,a))},markParsing:function(a){h.parse&&console.log("parsing",a),this.parsingElement=a},markParsingComplete:function(a){a.__importParsed=!0,a.__importElement&&(a.__importElement.__importParsed=!0),this.parsingElement=null,h.parse&&console.log("completed",a)},invalidateParse:function(a){a&&a.__importLink&&(a.__importParsed=a.__importLink.__importParsed=!1,this.parseSoon())},parseSoon:function(){this._parseSoon&&cancelAnimationFrame(this._parseDelay);var a=this;this._parseSoon=requestAnimationFrame(function(){a.parseNext()})},parseImport:function(a){if(HTMLImports.__importsParsingHook&&HTMLImports.__importsParsingHook(a),a.import.__importParsed=!0,this.markParsingComplete(a),a.dispatchEvent(a.__resource?new CustomEvent("load",{bubbles:!1}):new CustomEvent("error",{bubbles:!1})),a.__pending)for(var b;a.__pending.length;)b=a.__pending.shift(),b&&b({target:a});this.parseNext()},parseLink:function(a){b(a)?this.parseImport(a):(a.href=a.href,this.parseGeneric(a))},parseStyle:function(a){var b=a;a=f(a),a.__importElement=b,this.parseGeneric(a)},parseGeneric:function(a){this.trackElement(a),document.head.appendChild(a)},trackElement:function(a,b){var c=this,d=function(d){b&&b(d),c.markParsingComplete(a),c.parseNext()};if(a.addEventListener("load",d),a.addEventListener("error",d),i&&"style"===a.localName){var e=!1;if(-1==a.textContent.indexOf("@import"))e=!0;else if(a.sheet){e=!0;for(var f,g=a.sheet.cssRules,h=g?g.length:0,j=0;h>j&&(f=g[j]);j++)f.type===CSSRule.IMPORT_RULE&&(e=e&&Boolean(f.styleSheet))}e&&a.dispatchEvent(new CustomEvent("load",{bubbles:!1}))}},parseScript:function(b){var d=document.createElement("script");d.__importElement=b,d.src=b.src?b.src:c(b),a.currentScript=b,this.trackElement(d,function(){d.parentNode.removeChild(d),a.currentScript=null}),document.head.appendChild(d)},nextToParse:function(){return!this.parsingElement&&this.nextToParseInDoc(j)},nextToParseInDoc:function(a,c){for(var d,e=a.querySelectorAll(this.parseSelectorsForNode(a)),f=0,g=e.length;g>f&&(d=e[f]);f++)if(!this.isParsed(d))return this.hasResource(d)?b(d)?this.nextToParseInDoc(d.import,d):d:void 0;return c},parseSelectorsForNode:function(a){var b=a.ownerDocument||a;return b===j?this.documentSelectors:this.importsSelectors},isParsed:function(a){return a.__importParsed},hasResource:function(a){return b(a)&&!a.import?!1:!0}},l=/(url\()([^)]*)(\))/g,m=/(@import[\s]+(?!url\())([^;]*)(;)/g,n={resolveUrlsInStyle:function(a){var b=a.ownerDocument,c=b.createElement("a");return a.textContent=this.resolveUrlsInCssText(a.textContent,c),a},resolveUrlsInCssText:function(a,b){var c=this.replaceUrls(a,b,l);return c=this.replaceUrls(c,b,m)},replaceUrls:function(a,b,c){return a.replace(c,function(a,c,d,e){var f=d.replace(/["']/g,"");return b.href=f,f=b.href,c+"'"+f+"'"+e})}};a.parser=k,a.path=n,a.isIE=i}(HTMLImports),function(a){function b(a){return c(a,q)}function c(a,b){return"link"===a.localName&&a.getAttribute("rel")===b}function d(a,b){var c=a;c instanceof Document||(c=document.implementation.createHTMLDocument(q)),c._URL=b;var d=c.createElement("base");d.setAttribute("href",b),c.baseURI||(c.baseURI=b);var e=c.createElement("meta");return e.setAttribute("charset","utf-8"),c.head.appendChild(e),c.head.appendChild(d),a instanceof Document||(c.body.innerHTML=a),window.HTMLTemplateElement&&HTMLTemplateElement.bootstrap&&HTMLTemplateElement.bootstrap(c),c}function e(a,b){b=b||r,g(function(){h(a,b)},b)}function f(a){return"complete"===a.readyState||a.readyState===y}function g(a,b){if(f(b))a&&a();else{var c=function(){("complete"===b.readyState||b.readyState===y)&&(b.removeEventListener(z,c),g(a,b))};b.addEventListener(z,c)}}function h(a,b){function c(){f==g&&a&&a()}function d(){f++,c()}var e=b.querySelectorAll("link[rel=import]"),f=0,g=e.length;if(g)for(var h,j=0;g>j&&(h=e[j]);j++)i(h)?d.call(h):(h.addEventListener("load",d),h.addEventListener("error",d));else c()}function i(a){return o?a.import&&"loading"!==a.import.readyState||a.__loaded:a.__importParsed}function j(a){for(var b,c=0,d=a.length;d>c&&(b=a[c]);c++)k(b)&&l(b)}function k(a){return"link"===a.localName&&"import"===a.rel}function l(a){var b=a.import;b?m({target:a}):(a.addEventListener("load",m),a.addEventListener("error",m))}function m(a){a.target.__loaded=!0}var n="import"in document.createElement("link"),o=n,p=a.flags,q="import",r=window.ShadowDOMPolyfill?ShadowDOMPolyfill.wrapIfNeeded(document):document;if(o)var s={};else var t=(a.xhr,a.Loader),u=a.parser,s={documents:{},documentPreloadSelectors:"link[rel="+q+"]",importsPreloadSelectors:["link[rel="+q+"]"].join(","),loadNode:function(a){v.addNode(a)},loadSubtree:function(a){var b=this.marshalNodes(a);v.addNodes(b)},marshalNodes:function(a){return a.querySelectorAll(this.loadSelectorsForNode(a))},loadSelectorsForNode:function(a){var b=a.ownerDocument||a;return b===r?this.documentPreloadSelectors:this.importsPreloadSelectors},loaded:function(a,c,e){if(p.load&&console.log("loaded",a,c),c.__resource=e,b(c)){var f=this.documents[a];f||(f=d(e,a),f.__importLink=c,this.bootDocument(f),this.documents[a]=f),c.import=f}u.parseNext()},bootDocument:function(a){this.loadSubtree(a),this.observe(a),u.parseNext()},loadedAll:function(){u.parseNext()}},v=new t(s.loaded.bind(s),s.loadedAll.bind(s));var w={get:function(){return HTMLImports.currentScript||document.currentScript},configurable:!0};if(Object.defineProperty(document,"_currentScript",w),Object.defineProperty(r,"_currentScript",w),!document.baseURI){var x={get:function(){return window.location.href},configurable:!0};Object.defineProperty(document,"baseURI",x),Object.defineProperty(r,"baseURI",x)}var y=HTMLImports.isIE?"complete":"interactive",z="readystatechange";o&&new MutationObserver(function(a){for(var b,c=0,d=a.length;d>c&&(b=a[c]);c++)b.addedNodes&&j(b.addedNodes)}).observe(document.head,{childList:!0}),a.hasNative=n,a.useNative=o,a.importer=s,a.whenImportsReady=e,a.IMPORT_LINK_TYPE=q,a.isImportLoaded=i,a.importLoader=v}(window.HTMLImports),function(a){function b(a){for(var b,d=0,e=a.length;e>d&&(b=a[d]);d++)"childList"===b.type&&b.addedNodes.length&&c(b.addedNodes)}function c(a){for(var b,e,g=0,h=a.length;h>g&&(e=a[g]);g++)b=b||e.ownerDocument,d(e)&&f.loadNode(e),e.children&&e.children.length&&c(e.children)}function d(a){return 1===a.nodeType&&g.call(a,f.loadSelectorsForNode(a))}function e(a){h.observe(a,{childList:!0,subtree:!0})}var f=(a.IMPORT_LINK_TYPE,a.importer),g=(a.parser,HTMLElement.prototype.matches||HTMLElement.prototype.matchesSelector||HTMLElement.prototype.webkitMatchesSelector||HTMLElement.prototype.mozMatchesSelector||HTMLElement.prototype.msMatchesSelector),h=new MutationObserver(b);a.observe=e,f.observe=e}(HTMLImports),function(){function a(){HTMLImports.importer.bootDocument(b)}"function"!=typeof window.CustomEvent&&(window.CustomEvent=function(a,b){var c=document.createEvent("HTMLEvents");return c.initEvent(a,b.bubbles===!1?!1:!0,b.cancelable===!1?!1:!0,b.detail),c});var b=window.ShadowDOMPolyfill?window.ShadowDOMPolyfill.wrapIfNeeded(document):document;HTMLImports.whenImportsReady(function(){HTMLImports.ready=!0,HTMLImports.readyTime=(new Date).getTime(),b.dispatchEvent(new CustomEvent("HTMLImportsLoaded",{bubbles:!0}))}),HTMLImports.useNative||("complete"===document.readyState||"interactive"===document.readyState&&!window.attachEvent?a():document.addEventListener("DOMContentLoaded",a))}(),window.CustomElements=window.CustomElements||{flags:{}},function(a){function b(a,c,d){var e=a.firstElementChild;if(!e)for(e=a.firstChild;e&&e.nodeType!==Node.ELEMENT_NODE;)e=e.nextSibling;for(;e;)c(e,d)!==!0&&b(e,c,d),e=e.nextElementSibling;return null}function c(a,b){for(var c=a.shadowRoot;c;)d(c,b),c=c.olderShadowRoot}function d(a,d){b(a,function(a){return d(a)?!0:void c(a,d)}),c(a,d)}function e(a){return h(a)?(i(a),!0):void l(a)}function f(a){d(a,function(a){return e(a)?!0:void 0})}function g(a){return e(a)||f(a)}function h(b){if(!b.__upgraded__&&b.nodeType===Node.ELEMENT_NODE){var c=b.getAttribute("is")||b.localName,d=a.registry[c];if(d)return A.dom&&console.group("upgrade:",b.localName),a.upgrade(b),A.dom&&console.groupEnd(),!0}}function i(a){l(a),r(a)&&d(a,function(a){l(a)})}function j(a){if(E.push(a),!D){D=!0;var b=window.Platform&&window.Platform.endOfMicrotask||setTimeout;b(k)}}function k(){D=!1;for(var a,b=E,c=0,d=b.length;d>c&&(a=b[c]);c++)a();E=[]}function l(a){C?j(function(){m(a)}):m(a)}function m(a){(a.attachedCallback||a.detachedCallback||a.__upgraded__&&A.dom)&&(A.dom&&console.group("inserted:",a.localName),r(a)&&(a.__inserted=(a.__inserted||0)+1,a.__inserted<1&&(a.__inserted=1),a.__inserted>1?A.dom&&console.warn("inserted:",a.localName,"insert/remove count:",a.__inserted):a.attachedCallback&&(A.dom&&console.log("inserted:",a.localName),a.attachedCallback())),A.dom&&console.groupEnd())}function n(a){o(a),d(a,function(a){o(a)})}function o(a){C?j(function(){p(a)}):p(a)}function p(a){(a.attachedCallback||a.detachedCallback||a.__upgraded__&&A.dom)&&(A.dom&&console.group("removed:",a.localName),r(a)||(a.__inserted=(a.__inserted||0)-1,a.__inserted>0&&(a.__inserted=0),a.__inserted<0?A.dom&&console.warn("removed:",a.localName,"insert/remove count:",a.__inserted):a.detachedCallback&&a.detachedCallback()),A.dom&&console.groupEnd())}function q(a){return window.ShadowDOMPolyfill?ShadowDOMPolyfill.wrapIfNeeded(a):a}function r(a){for(var b=a,c=q(document);b;){if(b==c)return!0;b=b.parentNode||b.host}}function s(a){if(a.shadowRoot&&!a.shadowRoot.__watched){A.dom&&console.log("watching shadow-root for: ",a.localName);for(var b=a.shadowRoot;b;)t(b),b=b.olderShadowRoot}}function t(a){a.__watched||(w(a),a.__watched=!0)}function u(a){if(A.dom){var b=a[0];if(b&&"childList"===b.type&&b.addedNodes&&b.addedNodes){for(var c=b.addedNodes[0];c&&c!==document&&!c.host;)c=c.parentNode;var d=c&&(c.URL||c._URL||c.host&&c.host.localName)||"";d=d.split("/?").shift().split("/").pop()}console.group("mutations (%d) [%s]",a.length,d||"")}a.forEach(function(a){"childList"===a.type&&(G(a.addedNodes,function(a){a.localName&&g(a)}),G(a.removedNodes,function(a){a.localName&&n(a)}))}),A.dom&&console.groupEnd()}function v(){u(F.takeRecords()),k()}function w(a){F.observe(a,{childList:!0,subtree:!0})}function x(a){w(a)}function y(a){A.dom&&console.group("upgradeDocument: ",a.baseURI.split("/").pop()),g(a),A.dom&&console.groupEnd()}function z(a){a=q(a);for(var b,c=a.querySelectorAll("link[rel="+B+"]"),d=0,e=c.length;e>d&&(b=c[d]);d++)b.import&&b.import.__parsed&&z(b.import);y(a)}var A=window.logFlags||{},B=window.HTMLImports?HTMLImports.IMPORT_LINK_TYPE:"none",C=!window.MutationObserver||window.MutationObserver===window.JsMutationObserver;a.hasPolyfillMutations=C;var D=!1,E=[],F=new MutationObserver(u),G=Array.prototype.forEach.call.bind(Array.prototype.forEach);a.IMPORT_LINK_TYPE=B,a.watchShadow=s,a.upgradeDocumentTree=z,a.upgradeAll=g,a.upgradeSubtree=f,a.insertedNode=i,a.observeDocument=x,a.upgradeDocument=y,a.takeRecords=v}(window.CustomElements),function(a){function b(b,g){var h=g||{};if(!b)throw new Error("document.registerElement: first argument `name` must not be empty");if(b.indexOf("-")<0)throw new Error("document.registerElement: first argument ('name') must contain a dash ('-'). Argument provided was '"+String(b)+"'.");if(c(b))throw new Error("Failed to execute 'registerElement' on 'Document': Registration failed for type '"+String(b)+"'. The type name is invalid.");if(n(b))throw new Error("DuplicateDefinitionError: a type with name '"+String(b)+"' is already registered");if(!h.prototype)throw new Error("Options missing required prototype property");return h.__name=b.toLowerCase(),h.lifecycle=h.lifecycle||{},h.ancestry=d(h.extends),e(h),f(h),l(h.prototype),o(h.__name,h),h.ctor=p(h),h.ctor.prototype=h.prototype,h.prototype.constructor=h.ctor,a.ready&&a.upgradeDocumentTree(document),h.ctor
}function c(a){for(var b=0;b<y.length;b++)if(a===y[b])return!0}function d(a){var b=n(a);return b?d(b.extends).concat([b]):[]}function e(a){for(var b,c=a.extends,d=0;b=a.ancestry[d];d++)c=b.is&&b.tag;a.tag=c||a.__name,c&&(a.is=a.__name)}function f(a){if(!Object.__proto__){var b=HTMLElement.prototype;if(a.is){var c=document.createElement(a.tag),d=Object.getPrototypeOf(c);d===a.prototype&&(b=d)}for(var e,f=a.prototype;f&&f!==b;)e=Object.getPrototypeOf(f),f.__proto__=e,f=e;a.native=b}}function g(a){return h(B(a.tag),a)}function h(b,c){return c.is&&b.setAttribute("is",c.is),b.removeAttribute("unresolved"),i(b,c),b.__upgraded__=!0,k(b),a.insertedNode(b),a.upgradeSubtree(b),b}function i(a,b){Object.__proto__?a.__proto__=b.prototype:(j(a,b.prototype,b.native),a.__proto__=b.prototype)}function j(a,b,c){for(var d={},e=b;e!==c&&e!==HTMLElement.prototype;){for(var f,g=Object.getOwnPropertyNames(e),h=0;f=g[h];h++)d[f]||(Object.defineProperty(a,f,Object.getOwnPropertyDescriptor(e,f)),d[f]=1);e=Object.getPrototypeOf(e)}}function k(a){a.createdCallback&&a.createdCallback()}function l(a){if(!a.setAttribute._polyfilled){var b=a.setAttribute;a.setAttribute=function(a,c){m.call(this,a,c,b)};var c=a.removeAttribute;a.removeAttribute=function(a){m.call(this,a,null,c)},a.setAttribute._polyfilled=!0}}function m(a,b,c){a=a.toLowerCase();var d=this.getAttribute(a);c.apply(this,arguments);var e=this.getAttribute(a);this.attributeChangedCallback&&e!==d&&this.attributeChangedCallback(a,d,e)}function n(a){return a?z[a.toLowerCase()]:void 0}function o(a,b){z[a]=b}function p(a){return function(){return g(a)}}function q(a,b,c){return a===A?r(b,c):C(a,b)}function r(a,b){var c=n(b||a);if(c){if(a==c.tag&&b==c.is)return new c.ctor;if(!b&&!c.is)return new c.ctor}if(b){var d=r(a);return d.setAttribute("is",b),d}var d=B(a);return a.indexOf("-")>=0&&i(d,HTMLElement),d}function s(a){if(!a.__upgraded__&&a.nodeType===Node.ELEMENT_NODE){var b=a.getAttribute("is"),c=n(b||a.localName);if(c){if(b&&c.tag==a.localName)return h(a,c);if(!b&&!c.extends)return h(a,c)}}}function t(b){var c=D.call(this,b);return a.upgradeAll(c),c}a||(a=window.CustomElements={flags:{}});var u=a.flags,v=Boolean(document.registerElement),w=!u.register&&v&&!window.ShadowDOMPolyfill&&(!window.HTMLImports||HTMLImports.useNative);if(w){var x=function(){};a.registry={},a.upgradeElement=x,a.watchShadow=x,a.upgrade=x,a.upgradeAll=x,a.upgradeSubtree=x,a.observeDocument=x,a.upgradeDocument=x,a.upgradeDocumentTree=x,a.takeRecords=x,a.reservedTagList=[]}else{var y=["annotation-xml","color-profile","font-face","font-face-src","font-face-uri","font-face-format","font-face-name","missing-glyph"],z={},A="http://www.w3.org/1999/xhtml",B=document.createElement.bind(document),C=document.createElementNS.bind(document),D=Node.prototype.cloneNode;document.registerElement=b,document.createElement=r,document.createElementNS=q,Node.prototype.cloneNode=t,a.registry=z,a.upgrade=s}var E;E=Object.__proto__||w?function(a,b){return a instanceof b}:function(a,b){for(var c=a;c;){if(c===b.prototype)return!0;c=c.__proto__}return!1},a.instanceof=E,a.reservedTagList=y,document.register=document.registerElement,a.hasNative=v,a.useNative=w}(window.CustomElements),function(a){function b(a){return"link"===a.localName&&a.getAttribute("rel")===c}var c=a.IMPORT_LINK_TYPE,d={selectors:["link[rel="+c+"]"],map:{link:"parseLink"},parse:function(a){if(!a.__parsed){a.__parsed=!0;var b=a.querySelectorAll(d.selectors);e(b,function(a){d[d.map[a.localName]](a)}),CustomElements.upgradeDocument(a),CustomElements.observeDocument(a)}},parseLink:function(a){b(a)&&this.parseImport(a)},parseImport:function(a){a.import&&d.parse(a.import)}},e=Array.prototype.forEach.call.bind(Array.prototype.forEach);a.parser=d,a.IMPORT_LINK_TYPE=c}(window.CustomElements),function(a){function b(){CustomElements.parser.parse(document),CustomElements.upgradeDocument(document);var a=window.Platform&&Platform.endOfMicrotask?Platform.endOfMicrotask:setTimeout;a(function(){CustomElements.ready=!0,CustomElements.readyTime=Date.now(),window.HTMLImports&&(CustomElements.elapsed=CustomElements.readyTime-HTMLImports.readyTime),document.dispatchEvent(new CustomEvent("WebComponentsReady",{bubbles:!0})),window.HTMLImports&&(HTMLImports.__importsParsingHook=function(a){CustomElements.parser.parse(a.import)})})}if("function"!=typeof window.CustomEvent&&(window.CustomEvent=function(a){var b=document.createEvent("HTMLEvents");return b.initEvent(a,!0,!0),b}),"complete"===document.readyState||a.flags.eager)b();else if("interactive"!==document.readyState||window.attachEvent||window.HTMLImports&&!window.HTMLImports.ready){var c=window.HTMLImports&&!HTMLImports.ready?"HTMLImportsLoaded":"DOMContentLoaded";window.addEventListener(c,b)}else b()}(window.CustomElements),function(){if(window.ShadowDOMPolyfill){var a=["upgradeAll","upgradeSubtree","observeDocument","upgradeDocument"],b={};a.forEach(function(a){b[a]=CustomElements[a]}),a.forEach(function(a){CustomElements[a]=function(c){return b[a](wrap(c))}})}}(),function(a){function b(a){this.cache=Object.create(null),this.map=Object.create(null),this.requests=0,this.regex=a}var c=a.endOfMicrotask;b.prototype={extractUrls:function(a,b){for(var c,d,e=[];c=this.regex.exec(a);)d=new URL(c[1],b),e.push({matched:c[0],url:d.href});return e},process:function(a,b,c){var d=this.extractUrls(a,b),e=c.bind(null,this.map);this.fetch(d,e)},fetch:function(a,b){var c=a.length;if(!c)return b();for(var d,e,f,g=function(){0===--c&&b()},h=0;c>h;h++)d=a[h],f=d.url,e=this.cache[f],e||(e=this.xhr(f),e.match=d,this.cache[f]=e),e.wait(g)},handleXhr:function(a){var b=a.match,c=b.url,d=a.response||a.responseText||"";this.map[c]=d,this.fetch(this.extractUrls(d,c),a.resolve)},xhr:function(a){this.requests++;var b=new XMLHttpRequest;return b.open("GET",a,!0),b.send(),b.onerror=b.onload=this.handleXhr.bind(this,b),b.pending=[],b.resolve=function(){for(var a=b.pending,c=0;c<a.length;c++)a[c]();b.pending=null},b.wait=function(a){b.pending?b.pending.push(a):c(a)},b}},a.Loader=b}(window.Platform),function(a){function b(){this.loader=new d(this.regex)}var c=a.urlResolver,d=a.Loader;b.prototype={regex:/@import\s+(?:url)?["'\(]*([^'"\)]*)['"\)]*;/g,resolve:function(a,b,c){var d=function(d){c(this.flatten(a,b,d))}.bind(this);this.loader.process(a,b,d)},resolveNode:function(a,b,c){var d=a.textContent,e=function(b){a.textContent=b,c(a)};this.resolve(d,b,e)},flatten:function(a,b,d){for(var e,f,g,h=this.loader.extractUrls(a,b),i=0;i<h.length;i++)e=h[i],f=e.url,g=c.resolveCssText(d[f],f,!0),g=this.flatten(g,b,d),a=a.replace(e.matched,g);return a},loadStyles:function(a,b,c){function d(){f++,f===g&&c&&c()}for(var e,f=0,g=a.length,h=0;g>h&&(e=a[h]);h++)this.resolveNode(e,b,d)}};var e=new b;a.styleResolver=e}(window.Platform),function(){"use strict";function a(a){for(;a.parentNode;)a=a.parentNode;return"function"==typeof a.getElementById?a:null}function b(a,b,c){var d=a.bindings_;return d||(d=a.bindings_={}),d[b]&&c[b].close(),d[b]=c}function c(a,b,c){return c}function d(a){return null==a?"":a}function e(a,b){a.data=d(b)}function f(a){return function(b){return e(a,b)}}function g(a,b,c,e){return c?void(e?a.setAttribute(b,""):a.removeAttribute(b)):void a.setAttribute(b,d(e))}function h(a,b,c){return function(d){g(a,b,c,d)}}function i(a){switch(a.type){case"checkbox":return u;case"radio":case"select-multiple":case"select-one":return"change";case"range":if(/Trident|MSIE/.test(navigator.userAgent))return"change";default:return"input"}}function j(a,b,c,e){a[b]=(e||d)(c)}function k(a,b,c){return function(d){return j(a,b,d,c)}}function l(){}function m(a,b,c,d){function e(){c.setValue(a[b]),c.discardChanges(),(d||l)(a),Platform.performMicrotaskCheckpoint()}var f=i(a);return a.addEventListener(f,e),{close:function(){a.removeEventListener(f,e),c.close()},observable_:c}}function n(a){return Boolean(a)}function o(b){if(b.form)return s(b.form.elements,function(a){return a!=b&&"INPUT"==a.tagName&&"radio"==a.type&&a.name==b.name});var c=a(b);if(!c)return[];var d=c.querySelectorAll('input[type="radio"][name="'+b.name+'"]');return s(d,function(a){return a!=b&&!a.form})}function p(a){"INPUT"===a.tagName&&"radio"===a.type&&o(a).forEach(function(a){var b=a.bindings_.checked;b&&b.observable_.setValue(!1)})}function q(a,b){var c,e,f,g=a.parentNode;g instanceof HTMLSelectElement&&g.bindings_&&g.bindings_.value&&(c=g,e=c.bindings_.value,f=c.value),a.value=d(b),c&&c.value!=f&&(e.observable_.setValue(c.value),e.observable_.discardChanges(),Platform.performMicrotaskCheckpoint())}function r(a){return function(b){q(a,b)}}var s=Array.prototype.filter.call.bind(Array.prototype.filter);Node.prototype.bind=function(a,b){console.error("Unhandled binding to Node: ",this,a,b)},Node.prototype.bindFinished=function(){};var t=c;Object.defineProperty(Platform,"enableBindingsReflection",{get:function(){return t===b},set:function(a){return t=a?b:c,a},configurable:!0}),Text.prototype.bind=function(a,b,c){if("textContent"!==a)return Node.prototype.bind.call(this,a,b,c);if(c)return e(this,b);var d=b;return e(this,d.open(f(this))),t(this,a,d)},Element.prototype.bind=function(a,b,c){var d="?"==a[a.length-1];if(d&&(this.removeAttribute(a),a=a.slice(0,-1)),c)return g(this,a,d,b);var e=b;return g(this,a,d,e.open(h(this,a,d))),t(this,a,e)};var u;!function(){var a=document.createElement("div"),b=a.appendChild(document.createElement("input"));b.setAttribute("type","checkbox");var c,d=0;b.addEventListener("click",function(){d++,c=c||"click"}),b.addEventListener("change",function(){d++,c=c||"change"});var e=document.createEvent("MouseEvent");e.initMouseEvent("click",!0,!0,window,0,0,0,0,0,!1,!1,!1,!1,0,null),b.dispatchEvent(e),u=1==d?"change":c}(),HTMLInputElement.prototype.bind=function(a,c,e){if("value"!==a&&"checked"!==a)return HTMLElement.prototype.bind.call(this,a,c,e);this.removeAttribute(a);var f="checked"==a?n:d,g="checked"==a?p:l;if(e)return j(this,a,c,f);var h=c,i=m(this,a,h,g);return j(this,a,h.open(k(this,a,f)),f),b(this,a,i)},HTMLTextAreaElement.prototype.bind=function(a,b,c){if("value"!==a)return HTMLElement.prototype.bind.call(this,a,b,c);if(this.removeAttribute("value"),c)return j(this,"value",b);var e=b,f=m(this,"value",e);return j(this,"value",e.open(k(this,"value",d))),t(this,a,f)},HTMLOptionElement.prototype.bind=function(a,b,c){if("value"!==a)return HTMLElement.prototype.bind.call(this,a,b,c);if(this.removeAttribute("value"),c)return q(this,b);var d=b,e=m(this,"value",d);return q(this,d.open(r(this))),t(this,a,e)},HTMLSelectElement.prototype.bind=function(a,c,d){if("selectedindex"===a&&(a="selectedIndex"),"selectedIndex"!==a&&"value"!==a)return HTMLElement.prototype.bind.call(this,a,c,d);if(this.removeAttribute(a),d)return j(this,a,c);var e=c,f=m(this,a,e);return j(this,a,e.open(k(this,a))),b(this,a,f)}}(this),function(a){"use strict";function b(a){if(!a)throw new Error("Assertion failed")}function c(a){for(var b;b=a.parentNode;)a=b;return a}function d(a,b){if(b){for(var d,e="#"+b;!d&&(a=c(a),a.protoContent_?d=a.protoContent_.querySelector(e):a.getElementById&&(d=a.getElementById(b)),!d&&a.templateCreator_);)a=a.templateCreator_;return d}}function e(a){return"template"==a.tagName&&"http://www.w3.org/2000/svg"==a.namespaceURI}function f(a){return"TEMPLATE"==a.tagName&&"http://www.w3.org/1999/xhtml"==a.namespaceURI}function g(a){return Boolean(L[a.tagName]&&a.hasAttribute("template"))}function h(a){return void 0===a.isTemplate_&&(a.isTemplate_="TEMPLATE"==a.tagName||g(a)),a.isTemplate_}function i(a,b){var c=a.querySelectorAll(N);h(a)&&b(a),G(c,b)}function j(a){function b(a){HTMLTemplateElement.decorate(a)||j(a.content)}i(a,b)}function k(a,b){Object.getOwnPropertyNames(b).forEach(function(c){Object.defineProperty(a,c,Object.getOwnPropertyDescriptor(b,c))})}function l(a){var b=a.ownerDocument;if(!b.defaultView)return b;var c=b.templateContentsOwner_;if(!c){for(c=b.implementation.createHTMLDocument("");c.lastChild;)c.removeChild(c.lastChild);b.templateContentsOwner_=c}return c}function m(a){if(!a.stagingDocument_){var b=a.ownerDocument;if(!b.stagingDocument_){b.stagingDocument_=b.implementation.createHTMLDocument(""),b.stagingDocument_.isStagingDocument=!0;var c=b.stagingDocument_.createElement("base");c.href=document.baseURI,b.stagingDocument_.head.appendChild(c),b.stagingDocument_.stagingDocument_=b.stagingDocument_}a.stagingDocument_=b.stagingDocument_}return a.stagingDocument_}function n(a){var b=a.ownerDocument.createElement("template");a.parentNode.insertBefore(b,a);for(var c=a.attributes,d=c.length;d-->0;){var e=c[d];K[e.name]&&("template"!==e.name&&b.setAttribute(e.name,e.value),a.removeAttribute(e.name))}return b}function o(a){var b=a.ownerDocument.createElement("template");a.parentNode.insertBefore(b,a);for(var c=a.attributes,d=c.length;d-->0;){var e=c[d];b.setAttribute(e.name,e.value),a.removeAttribute(e.name)}return a.parentNode.removeChild(a),b}function p(a,b,c){var d=a.content;if(c)return void d.appendChild(b);for(var e;e=b.firstChild;)d.appendChild(e)}function q(a){P?a.__proto__=HTMLTemplateElement.prototype:k(a,HTMLTemplateElement.prototype)}function r(a){a.setModelFn_||(a.setModelFn_=function(){a.setModelFnScheduled_=!1;var b=z(a,a.delegate_&&a.delegate_.prepareBinding);w(a,b,a.model_)}),a.setModelFnScheduled_||(a.setModelFnScheduled_=!0,Observer.runEOM_(a.setModelFn_))}function s(a,b,c,d){if(a&&a.length){for(var e,f=a.length,g=0,h=0,i=0,j=!0;f>h;){var g=a.indexOf("{{",h),k=a.indexOf("[[",h),l=!1,m="}}";if(k>=0&&(0>g||g>k)&&(g=k,l=!0,m="]]"),i=0>g?-1:a.indexOf(m,g+2),0>i){if(!e)return;e.push(a.slice(h));break}e=e||[],e.push(a.slice(h,g));var n=a.slice(g+2,i).trim();e.push(l),j=j&&l;var o=d&&d(n,b,c);e.push(null==o?Path.get(n):null),e.push(o),h=i+2}return h===f&&e.push(""),e.hasOnePath=5===e.length,e.isSimplePath=e.hasOnePath&&""==e[0]&&""==e[4],e.onlyOneTime=j,e.combinator=function(a){for(var b=e[0],c=1;c<e.length;c+=4){var d=e.hasOnePath?a:a[(c-1)/4];void 0!==d&&(b+=d),b+=e[c+3]}return b},e}}function t(a,b,c,d){if(b.hasOnePath){var e=b[3],f=e?e(d,c,!0):b[2].getValueFrom(d);return b.isSimplePath?f:b.combinator(f)}for(var g=[],h=1;h<b.length;h+=4){var e=b[h+2];g[(h-1)/4]=e?e(d,c):b[h+1].getValueFrom(d)}return b.combinator(g)}function u(a,b,c,d){var e=b[3],f=e?e(d,c,!1):new PathObserver(d,b[2]);return b.isSimplePath?f:new ObserverTransform(f,b.combinator)}function v(a,b,c,d){if(b.onlyOneTime)return t(a,b,c,d);if(b.hasOnePath)return u(a,b,c,d);for(var e=new CompoundObserver,f=1;f<b.length;f+=4){var g=b[f],h=b[f+2];if(h){var i=h(d,c,g);g?e.addPath(i):e.addObserver(i)}else{var j=b[f+1];g?e.addPath(j.getValueFrom(d)):e.addPath(d,j)}}return new ObserverTransform(e,b.combinator)}function w(a,b,c,d){for(var e=0;e<b.length;e+=2){var f=b[e],g=b[e+1],h=v(f,g,a,c),i=a.bind(f,h,g.onlyOneTime);i&&d&&d.push(i)}if(a.bindFinished(),b.isTemplate){a.model_=c;var j=a.processBindingDirectives_(b);d&&j&&d.push(j)}}function x(a,b,c){var d=a.getAttribute(b);return s(""==d?"{{}}":d,b,a,c)}function y(a,c){b(a);for(var d=[],e=0;e<a.attributes.length;e++){for(var f=a.attributes[e],g=f.name,i=f.value;"_"===g[0];)g=g.substring(1);if(!h(a)||g!==J&&g!==H&&g!==I){var j=s(i,g,a,c);j&&d.push(g,j)}}return h(a)&&(d.isTemplate=!0,d.if=x(a,J,c),d.bind=x(a,H,c),d.repeat=x(a,I,c),!d.if||d.bind||d.repeat||(d.bind=s("{{}}",H,a,c))),d}function z(a,b){if(a.nodeType===Node.ELEMENT_NODE)return y(a,b);if(a.nodeType===Node.TEXT_NODE){var c=s(a.data,"textContent",a,b);if(c)return["textContent",c]}return[]}function A(a,b,c,d,e,f,g){for(var h=b.appendChild(c.importNode(a,!1)),i=0,j=a.firstChild;j;j=j.nextSibling)A(j,h,c,d.children[i++],e,f,g);return d.isTemplate&&(HTMLTemplateElement.decorate(h,a),f&&h.setDelegate_(f)),w(h,d,e,g),h}function B(a,b){var c=z(a,b);c.children={};for(var d=0,e=a.firstChild;e;e=e.nextSibling)c.children[d++]=B(e,b);return c}function C(a){var b=a.id_;return b||(b=a.id_=S++),b}function D(a,b){var c=C(a);if(b){var d=b.bindingMaps[c];return d||(d=b.bindingMaps[c]=B(a,b.prepareBinding)||[]),d}var d=a.bindingMap_;return d||(d=a.bindingMap_=B(a,void 0)||[]),d}function E(a){this.closed=!1,this.templateElement_=a,this.instances=[],this.deps=void 0,this.iteratedValue=[],this.presentValue=void 0,this.arrayObserver=void 0}var F,G=Array.prototype.forEach.call.bind(Array.prototype.forEach);a.Map&&"function"==typeof a.Map.prototype.forEach?F=a.Map:(F=function(){this.keys=[],this.values=[]},F.prototype={set:function(a,b){var c=this.keys.indexOf(a);0>c?(this.keys.push(a),this.values.push(b)):this.values[c]=b},get:function(a){var b=this.keys.indexOf(a);if(!(0>b))return this.values[b]},"delete":function(a){var b=this.keys.indexOf(a);return 0>b?!1:(this.keys.splice(b,1),this.values.splice(b,1),!0)},forEach:function(a,b){for(var c=0;c<this.keys.length;c++)a.call(b||this,this.values[c],this.keys[c],this)}});"function"!=typeof document.contains&&(Document.prototype.contains=function(a){return a===this||a.parentNode===this?!0:this.documentElement.contains(a)});var H="bind",I="repeat",J="if",K={template:!0,repeat:!0,bind:!0,ref:!0},L={THEAD:!0,TBODY:!0,TFOOT:!0,TH:!0,TR:!0,TD:!0,COLGROUP:!0,COL:!0,CAPTION:!0,OPTION:!0,OPTGROUP:!0},M="undefined"!=typeof HTMLTemplateElement;M&&!function(){var a=document.createElement("template"),b=a.content.ownerDocument,c=b.appendChild(b.createElement("html")),d=c.appendChild(b.createElement("head")),e=b.createElement("base");e.href=document.baseURI,d.appendChild(e)}();var N="template, "+Object.keys(L).map(function(a){return a.toLowerCase()+"[template]"}).join(", ");document.addEventListener("DOMContentLoaded",function(){j(document),Platform.performMicrotaskCheckpoint()},!1),M||(a.HTMLTemplateElement=function(){throw TypeError("Illegal constructor")});var O,P="__proto__"in{};"function"==typeof MutationObserver&&(O=new MutationObserver(function(a){for(var b=0;b<a.length;b++)a[b].target.refChanged_()})),HTMLTemplateElement.decorate=function(a,c){if(a.templateIsDecorated_)return!1;var d=a;d.templateIsDecorated_=!0;var h=f(d)&&M,i=h,k=!h,m=!1;if(h||(g(d)?(b(!c),d=n(a),d.templateIsDecorated_=!0,h=M,m=!0):e(d)&&(d=o(a),d.templateIsDecorated_=!0,h=M)),!h){q(d);var r=l(d);d.content_=r.createDocumentFragment()}return c?d.instanceRef_=c:k?p(d,a,m):i&&j(d.content),!0},HTMLTemplateElement.bootstrap=j;var Q=a.HTMLUnknownElement||HTMLElement,R={get:function(){return this.content_},enumerable:!0,configurable:!0};M||(HTMLTemplateElement.prototype=Object.create(Q.prototype),Object.defineProperty(HTMLTemplateElement.prototype,"content",R)),k(HTMLTemplateElement.prototype,{bind:function(a,b,c){if("ref"!=a)return Element.prototype.bind.call(this,a,b,c);var d=this,e=c?b:b.open(function(a){d.setAttribute("ref",a),d.refChanged_()});return this.setAttribute("ref",e),this.refChanged_(),c?void 0:(this.bindings_?this.bindings_.ref=b:this.bindings_={ref:b},b)},processBindingDirectives_:function(a){return this.iterator_&&this.iterator_.closeDeps(),a.if||a.bind||a.repeat?(this.iterator_||(this.iterator_=new E(this)),this.iterator_.updateDependencies(a,this.model_),O&&O.observe(this,{attributes:!0,attributeFilter:["ref"]}),this.iterator_):void(this.iterator_&&(this.iterator_.close(),this.iterator_=void 0))},createInstance:function(a,b,c){b?c=this.newDelegate_(b):c||(c=this.delegate_),this.refContent_||(this.refContent_=this.ref_.content);var d=this.refContent_;if(null===d.firstChild)return T;var e=D(d,c),f=m(this),g=f.createDocumentFragment();g.templateCreator_=this,g.protoContent_=d,g.bindings_=[],g.terminator_=null;for(var h=g.templateInstance_={firstNode:null,lastNode:null,model:a},i=0,j=!1,k=d.firstChild;k;k=k.nextSibling){null===k.nextSibling&&(j=!0);var l=A(k,g,f,e.children[i++],a,c,g.bindings_);l.templateInstance_=h,j&&(g.terminator_=l)}return h.firstNode=g.firstChild,h.lastNode=g.lastChild,g.templateCreator_=void 0,g.protoContent_=void 0,g},get model(){return this.model_},set model(a){this.model_=a,r(this)},get bindingDelegate(){return this.delegate_&&this.delegate_.raw},refChanged_:function(){this.iterator_&&this.refContent_!==this.ref_.content&&(this.refContent_=void 0,this.iterator_.valueChanged(),this.iterator_.updateIteratedValue())},clear:function(){this.model_=void 0,this.delegate_=void 0,this.bindings_&&this.bindings_.ref&&this.bindings_.ref.close(),this.refContent_=void 0,this.iterator_&&(this.iterator_.valueChanged(),this.iterator_.close(),this.iterator_=void 0)},setDelegate_:function(a){this.delegate_=a,this.bindingMap_=void 0,this.iterator_&&(this.iterator_.instancePositionChangedFn_=void 0,this.iterator_.instanceModelFn_=void 0)},newDelegate_:function(a){function b(b){var c=a&&a[b];if("function"==typeof c)return function(){return c.apply(a,arguments)}}if(a)return{bindingMaps:{},raw:a,prepareBinding:b("prepareBinding"),prepareInstanceModel:b("prepareInstanceModel"),prepareInstancePositionChanged:b("prepareInstancePositionChanged")}},set bindingDelegate(a){if(this.delegate_)throw Error("Template must be cleared before a new bindingDelegate can be assigned");this.setDelegate_(this.newDelegate_(a))},get ref_(){var a=d(this,this.getAttribute("ref"));if(a||(a=this.instanceRef_),!a)return this;var b=a.ref_;return b?b:a}});var S=1;Object.defineProperty(Node.prototype,"templateInstance",{get:function(){var a=this.templateInstance_;return a?a:this.parentNode?this.parentNode.templateInstance:void 0}});var T=document.createDocumentFragment();T.bindings_=[],T.terminator_=null,E.prototype={closeDeps:function(){var a=this.deps;a&&(a.ifOneTime===!1&&a.ifValue.close(),a.oneTime===!1&&a.value.close())},updateDependencies:function(a,b){this.closeDeps();var c=this.deps={},d=this.templateElement_;if(a.if){if(c.hasIf=!0,c.ifOneTime=a.if.onlyOneTime,c.ifValue=v(J,a.if,d,b),c.ifOneTime&&!c.ifValue)return void this.updateIteratedValue();c.ifOneTime||c.ifValue.open(this.updateIteratedValue,this)}a.repeat?(c.repeat=!0,c.oneTime=a.repeat.onlyOneTime,c.value=v(I,a.repeat,d,b)):(c.repeat=!1,c.oneTime=a.bind.onlyOneTime,c.value=v(H,a.bind,d,b)),c.oneTime||c.value.open(this.updateIteratedValue,this),this.updateIteratedValue()},updateIteratedValue:function(){if(this.deps.hasIf){var a=this.deps.ifValue;if(this.deps.ifOneTime||(a=a.discardChanges()),!a)return void this.valueChanged()}var b=this.deps.value;this.deps.oneTime||(b=b.discardChanges()),this.deps.repeat||(b=[b]);var c=this.deps.repeat&&!this.deps.oneTime&&Array.isArray(b);this.valueChanged(b,c)},valueChanged:function(a,b){Array.isArray(a)||(a=[]),a!==this.iteratedValue&&(this.unobserve(),this.presentValue=a,b&&(this.arrayObserver=new ArrayObserver(this.presentValue),this.arrayObserver.open(this.handleSplices,this)),this.handleSplices(ArrayObserver.calculateSplices(this.presentValue,this.iteratedValue)))},getLastInstanceNode:function(a){if(-1==a)return this.templateElement_;var b=this.instances[a],c=b.terminator_;if(!c)return this.getLastInstanceNode(a-1);if(c.nodeType!==Node.ELEMENT_NODE||this.templateElement_===c)return c;var d=c.iterator_;return d?d.getLastTemplateNode():c},getLastTemplateNode:function(){return this.getLastInstanceNode(this.instances.length-1)},insertInstanceAt:function(a,b){var c=this.getLastInstanceNode(a-1),d=this.templateElement_.parentNode;this.instances.splice(a,0,b),d.insertBefore(b,c.nextSibling)},extractInstanceAt:function(a){for(var b=this.getLastInstanceNode(a-1),c=this.getLastInstanceNode(a),d=this.templateElement_.parentNode,e=this.instances.splice(a,1)[0];c!==b;){var f=b.nextSibling;f==c&&(c=b),e.appendChild(d.removeChild(f))}return e},getDelegateFn:function(a){return a=a&&a(this.templateElement_),"function"==typeof a?a:null},handleSplices:function(a){if(!this.closed&&a.length){var b=this.templateElement_;if(!b.parentNode)return void this.close();ArrayObserver.applySplices(this.iteratedValue,this.presentValue,a);var c=b.delegate_;void 0===this.instanceModelFn_&&(this.instanceModelFn_=this.getDelegateFn(c&&c.prepareInstanceModel)),void 0===this.instancePositionChangedFn_&&(this.instancePositionChangedFn_=this.getDelegateFn(c&&c.prepareInstancePositionChanged));for(var d=new F,e=0,f=0;f<a.length;f++){for(var g=a[f],h=g.removed,i=0;i<h.length;i++){var j=h[i],k=this.extractInstanceAt(g.index+e);k!==T&&d.set(j,k)}e-=g.addedCount}for(var f=0;f<a.length;f++)for(var g=a[f],l=g.index;l<g.index+g.addedCount;l++){var j=this.iteratedValue[l],k=d.get(j);k?d.delete(j):(this.instanceModelFn_&&(j=this.instanceModelFn_(j)),k=void 0===j?T:b.createInstance(j,void 0,c)),this.insertInstanceAt(l,k)}d.forEach(function(a){this.closeInstanceBindings(a)},this),this.instancePositionChangedFn_&&this.reportInstancesMoved(a)}},reportInstanceMoved:function(a){var b=this.instances[a];b!==T&&this.instancePositionChangedFn_(b.templateInstance_,a)},reportInstancesMoved:function(a){for(var b=0,c=0,d=0;d<a.length;d++){var e=a[d];if(0!=c)for(;b<e.index;)this.reportInstanceMoved(b),b++;else b=e.index;for(;b<e.index+e.addedCount;)this.reportInstanceMoved(b),b++;c+=e.addedCount-e.removed.length}if(0!=c)for(var f=this.instances.length;f>b;)this.reportInstanceMoved(b),b++},closeInstanceBindings:function(a){for(var b=a.bindings_,c=0;c<b.length;c++)b[c].close()},unobserve:function(){this.arrayObserver&&(this.arrayObserver.close(),this.arrayObserver=void 0)},close:function(){if(!this.closed){this.unobserve();for(var a=0;a<this.instances.length;a++)this.closeInstanceBindings(this.instances[a]);this.instances.length=0,this.closeDeps(),this.templateElement_.iterator_=void 0,this.closed=!0}}},HTMLTemplateElement.forAllTemplatesFrom_=i}(this),function(a){function b(){e||(e=!0,a.endOfMicrotask(function(){e=!1,logFlags.data&&console.group("Platform.flush()"),a.performMicrotaskCheckpoint(),logFlags.data&&console.groupEnd()}))}var c=document.createElement("style");c.textContent="template {display: none !important;} /* injected by platform.js */";var d=document.querySelector("head");d.insertBefore(c,d.firstChild);var e;if(Observer.hasObjectObserve)b=function(){};else{var f=125;window.addEventListener("WebComponentsReady",function(){b(),a.flushPoll=setInterval(b,f)})}if(window.CustomElements&&!CustomElements.useNative){var g=Document.prototype.importNode;Document.prototype.importNode=function(a,b){var c=g.call(this,a,b);return CustomElements.upgradeAll(c),c}}a.flush=b}(window.Platform);
//# sourceMappingURL=platform.js.map;
/**
 * @license
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
// @version: 0.3.4
window.PolymerGestures={hasSDPolyfill:Boolean(window.ShadowDOMPolyfill)},PolymerGestures.wrap=PolymerGestures.hasSDPolyfill?ShadowDOMPolyfill.wrapIfNeeded:function(a){return a},function(a){var b=!1,c=document.createElement("meta");if(!a.hasSDPolyfill&&c.createShadowRoot){var d=c.createShadowRoot(),e=document.createElement("span");d.appendChild(e),c.addEventListener("testpath",function(a){a.path&&(b=a.path[0]===e),a.stopPropagation()});var f=new CustomEvent("testpath",{bubbles:!0});document.head.appendChild(c),e.dispatchEvent(f),c.parentNode.removeChild(c),d=e=null}c=null;var g={shadow:function(a){return a?a.shadowRoot||a.webkitShadowRoot:void 0},canTarget:function(a){return a&&Boolean(a.elementFromPoint)},targetingShadow:function(a){var b=this.shadow(a);return this.canTarget(b)?b:void 0},olderShadow:function(a){var b=a.olderShadowRoot;if(!b){var c=a.querySelector("shadow");c&&(b=c.olderShadowRoot)}return b},allShadows:function(a){for(var b=[],c=this.shadow(a);c;)b.push(c),c=this.olderShadow(c);return b},searchRoot:function(a,b,c){var d,e;return a?(d=a.elementFromPoint(b,c),d?e=this.targetingShadow(d):a!==document&&(e=this.olderShadow(a)),this.searchRoot(e,b,c)||d):void 0},owner:function(a){if(!a)return document;for(var b=a;b.parentNode;)b=b.parentNode;return b.nodeType!=Node.DOCUMENT_NODE&&b.nodeType!=Node.DOCUMENT_FRAGMENT_NODE&&(b=document),b},findTarget:function(a){if(b&&a.path)return a.path[0];var c=a.clientX,d=a.clientY,e=this.owner(a.target);return e.elementFromPoint(c,d)||(e=document),this.searchRoot(e,c,d)},findScrollAxis:function(c){var d;if(b&&c.path){for(var e=c.path,f=0;f<e.length;f++)if(d=e[f],d._scrollType)return d._scrollType}else for(d=a.wrap(c.currentTarget);d;){if(d._scrollType)return d._scrollType;d=d.parentNode||d.host}},LCA:function(a,b){if(a===b)return a;if(a&&!b)return a;if(b&&!a)return b;if(!b&&!a)return document;if(a.contains&&a.contains(b))return a;if(b.contains&&b.contains(a))return b;var c=this.depth(a),d=this.depth(b),e=c-d;for(e>=0?a=this.walk(a,e):b=this.walk(b,-e);a&&b&&a!==b;)a=a.parentNode||a.host,b=b.parentNode||b.host;return a},walk:function(a,b){for(var c=0;a&&b>c;c++)a=a.parentNode||a.host;return a},depth:function(a){for(var b=0;a;)b++,a=a.parentNode||a.host;return b},deepContains:function(a,b){var c=this.LCA(a,b);return c===a},insideNode:function(a,b,c){var d=a.getBoundingClientRect();return d.left<=b&&b<=d.right&&d.top<=c&&c<=d.bottom}};a.targetFinding=g,a.findTarget=g.findTarget.bind(g),a.deepContains=g.deepContains.bind(g),a.insideNode=g.insideNode}(window.PolymerGestures),function(){function a(a){return"body /deep/ "+b(a)}function b(a){return'[touch-action="'+a+'"]'}function c(a){return"{ -ms-touch-action: "+a+"; touch-action: "+a+";}"}var d=["none","auto","pan-x","pan-y",{rule:"pan-x pan-y",selectors:["pan-x pan-y","pan-y pan-x"]},"manipulation"],e="",f=(document.head,"string"==typeof document.head.style.touchAction),g=!window.ShadowDOMPolyfill&&document.head.createShadowRoot;if(f){d.forEach(function(d){String(d)===d?(e+=b(d)+c(d)+"\n",g&&(e+=a(d)+c(d)+"\n")):(e+=d.selectors.map(b)+c(d.rule)+"\n",g&&(e+=d.selectors.map(a)+c(d.rule)+"\n"))});var h=document.createElement("style");h.textContent=e,document.head.appendChild(h)}}(),function(a){var b=["bubbles","cancelable","view","detail","screenX","screenY","clientX","clientY","ctrlKey","altKey","shiftKey","metaKey","button","relatedTarget","pageX","pageY"],c=[!1,!1,null,null,0,0,0,0,!1,!1,!1,!1,0,null,0,0],d=function(){return function(){}},e={preventTap:d,makeBaseEvent:function(a,b){var c=document.createEvent("Event");return c.initEvent(a,b.bubbles||!1,b.cancelable||!1),c.preventTap=e.preventTap(c),c},makeGestureEvent:function(a,b){b=b||Object.create(null);for(var c,d=this.makeBaseEvent(a,b),e=0,f=Object.keys(b);e<f.length;e++)c=f[e],d[c]=b[c];return d},makePointerEvent:function(a,d){d=d||Object.create(null);for(var e,f=this.makeBaseEvent(a,d),g=0;g<b.length;g++)e=b[g],f[e]=d[e]||c[g];f.buttons=d.buttons||0;var h=0;return h=d.pressure?d.pressure:f.buttons?.5:0,f.x=f.clientX,f.y=f.clientY,f.pointerId=d.pointerId||0,f.width=d.width||0,f.height=d.height||0,f.pressure=h,f.tiltX=d.tiltX||0,f.tiltY=d.tiltY||0,f.pointerType=d.pointerType||"",f.hwTimestamp=d.hwTimestamp||0,f.isPrimary=d.isPrimary||!1,f._source=d._source||"",f}};a.eventFactory=e}(window.PolymerGestures),function(a){function b(){if(c){var a=new Map;return a.pointers=d,a}this.keys=[],this.values=[]}var c=window.Map&&window.Map.prototype.forEach,d=function(){return this.size};b.prototype={set:function(a,b){var c=this.keys.indexOf(a);c>-1?this.values[c]=b:(this.keys.push(a),this.values.push(b))},has:function(a){return this.keys.indexOf(a)>-1},"delete":function(a){var b=this.keys.indexOf(a);b>-1&&(this.keys.splice(b,1),this.values.splice(b,1))},get:function(a){var b=this.keys.indexOf(a);return this.values[b]},clear:function(){this.keys.length=0,this.values.length=0},forEach:function(a,b){this.values.forEach(function(c,d){a.call(b,c,this.keys[d],this)},this)},pointers:function(){return this.keys.length}},a.PointerMap=b}(window.PolymerGestures),function(a){var b=["bubbles","cancelable","view","detail","screenX","screenY","clientX","clientY","ctrlKey","altKey","shiftKey","metaKey","button","relatedTarget","buttons","pointerId","width","height","pressure","tiltX","tiltY","pointerType","hwTimestamp","isPrimary","type","target","currentTarget","which","pageX","pageY","timeStamp","preventTap","tapPrevented","_source"],c=[!1,!1,null,null,0,0,0,0,!1,!1,!1,!1,0,null,0,0,0,0,0,0,0,"",0,!1,"",null,null,0,0,0,0,function(){},!1],d="undefined"!=typeof SVGElementInstance,e=a.eventFactory,f=a.hasSDPolyfill,g=a.wrap,h={pointermap:new a.PointerMap,eventMap:Object.create(null),eventSources:Object.create(null),eventSourceList:[],gestures:[],gestureQueue:[],registerSource:function(a,b){var c=b,d=c.events;d&&(d.forEach(function(a){c[a]&&(this.eventMap[a]=c[a].bind(c))},this),this.eventSources[a]=c,this.eventSourceList.push(c))},registerGesture:function(a,b){this.gestures.push(b)},register:function(a){for(var b,c=this.eventSourceList.length,d=0;c>d&&(b=this.eventSourceList[d]);d++)b.register.call(b,a)},unregister:function(a){for(var b,c=this.eventSourceList.length,d=0;c>d&&(b=this.eventSourceList[d]);d++)b.unregister.call(b,a)},down:function(a){this.fireEvent("down",a)},move:function(a){a.type="move",this.fillGestureQueue(a)},up:function(a){this.fireEvent("up",a)},cancel:function(a){a.tapPrevented=!0,this.fireEvent("up",a)},eventHandler:function(a){if(!a._handledByPG){var b=a.type,c=this.eventMap&&this.eventMap[b];c&&c(a),a._handledByPG=!0}},listen:function(a,b){for(var c,d=0,e=b.length;e>d&&(c=b[d]);d++)this.addEvent(a,c)},unlisten:function(a,b){for(var c,d=0,e=b.length;e>d&&(c=b[d]);d++)this.removeEvent(a,c)},addEvent:function(a,b){f?a.addEventListener_(b,this.boundHandler):a.addEventListener(b,this.boundHandler)},removeEvent:function(a,b){f?a.removeEventListener_(b,this.boundHandler):a.removeEventListener(b,this.boundHandler)},makeEvent:function(a,b){var c=e.makePointerEvent(a,b);return c.preventDefault=b.preventDefault,c.tapPrevented=b.tapPrevented,c._target=c._target||b.target,c},fireEvent:function(a,b){var c=this.makeEvent(a,b);return this.dispatchEvent(c)},cloneEvent:function(a){for(var e,f=Object.create(null),h=0;h<b.length;h++)e=b[h],f[e]=a[e]||c[h],("target"===e||"relatedTarget"===e)&&(d&&f[e]instanceof SVGElementInstance&&(f[e]=f[e].correspondingUseElement),f[e]=g(f[e]));return f.preventDefault=a.preventDefault,f},dispatchEvent:function(a){var b=a._target;if(b){b.dispatchEvent(a);var c=this.cloneEvent(a);c.target=b,this.fillGestureQueue(c)}},gestureTrigger:function(){for(var a,b=0;b<this.gestureQueue.length;b++){a=this.gestureQueue[b];for(var c,d,e=0;e<this.gestures.length;e++)c=this.gestures[e],d=c[a.type],d&&d.call(c,a)}this.gestureQueue.length=0},fillGestureQueue:function(a){this.gestureQueue.length||requestAnimationFrame(this.boundGestureTrigger),this.gestureQueue.push(a)}};h.boundHandler=h.eventHandler.bind(h),h.boundGestureTrigger=h.gestureTrigger.bind(h),a.dispatcher=h,a.register=function(a){h.register(a)},a.unregister=h.unregister.bind(h),a.wrap=g}(window.PolymerGestures),function(a){function b(a,b,c,d){this.addCallback=a.bind(d),this.removeCallback=b.bind(d),this.changedCallback=c.bind(d),g&&(this.observer=new g(this.mutationWatcher.bind(this)))}var c=Array.prototype.forEach.call.bind(Array.prototype.forEach),d=Array.prototype.map.call.bind(Array.prototype.map),e=Array.prototype.slice.call.bind(Array.prototype.slice),f=Array.prototype.filter.call.bind(Array.prototype.filter),g=window.MutationObserver||window.WebKitMutationObserver,h="[touch-action]",i={subtree:!0,childList:!0,attributes:!0,attributeOldValue:!0,attributeFilter:["touch-action"]};b.prototype={watchSubtree:function(b){a.targetFinding.canTarget(b)&&this.observer.observe(b,i)},enableOnSubtree:function(a){this.watchSubtree(a),a===document&&"complete"!==document.readyState?this.installOnLoad():this.installNewSubtree(a)},installNewSubtree:function(a){c(this.findElements(a),this.addElement,this)},findElements:function(a){return a.querySelectorAll?a.querySelectorAll(h):[]},removeElement:function(a){this.removeCallback(a)},addElement:function(a){this.addCallback(a)},elementChanged:function(a,b){this.changedCallback(a,b)},concatLists:function(a,b){return a.concat(e(b))},installOnLoad:function(){document.addEventListener("readystatechange",function(){"complete"===document.readyState&&this.installNewSubtree(document)}.bind(this))},isElement:function(a){return a.nodeType===Node.ELEMENT_NODE},flattenMutationTree:function(a){var b=d(a,this.findElements,this);return b.push(f(a,this.isElement)),b.reduce(this.concatLists,[])},mutationWatcher:function(a){a.forEach(this.mutationHandler,this)},mutationHandler:function(a){if("childList"===a.type){var b=this.flattenMutationTree(a.addedNodes);b.forEach(this.addElement,this);var c=this.flattenMutationTree(a.removedNodes);c.forEach(this.removeElement,this)}else"attributes"===a.type&&this.elementChanged(a.target,a.oldValue)}},g||(b.prototype.watchSubtree=function(){console.warn("PolymerGestures: MutationObservers not found, touch-action will not be dynamically detected")}),a.Installer=b}(window.PolymerGestures),function(a){var b=a.dispatcher,c=b.pointermap,d=25,e=[0,1,4,2],f=!1;try{f=1===new MouseEvent("test",{buttons:1}).buttons}catch(g){}var h={POINTER_ID:1,POINTER_TYPE:"mouse",events:["mousedown","mousemove","mouseup"],register:function(a){a===document&&b.listen(a,this.events)},unregister:function(a){b.unlisten(a,this.events)},lastTouches:[],isEventSimulatedFromTouch:function(a){for(var b,c=this.lastTouches,e=a.clientX,f=a.clientY,g=0,h=c.length;h>g&&(b=c[g]);g++){var i=Math.abs(e-b.x),j=Math.abs(f-b.y);if(d>=i&&d>=j)return!0}},prepareEvent:function(a){var c=b.cloneEvent(a);return c.pointerId=this.POINTER_ID,c.isPrimary=!0,c.pointerType=this.POINTER_TYPE,c._source="mouse",f||(c.buttons=e[c.which]||0),c},mousedown:function(d){if(!this.isEventSimulatedFromTouch(d)){var e=c.has(this.POINTER_ID);e&&this.mouseup(d);var f=this.prepareEvent(d);f.target=a.wrap(a.findTarget(d)),c.set(this.POINTER_ID,f.target),b.down(f)}},mousemove:function(a){if(!this.isEventSimulatedFromTouch(a)){var d=this.prepareEvent(a);d.target=c.get(this.POINTER_ID),b.move(d)}},mouseup:function(d){if(!this.isEventSimulatedFromTouch(d)){var e=this.prepareEvent(d);e.relatedTarget=a.wrap(a.findTarget(d)),e.target=c.get(this.POINTER_ID),b.up(e),this.cleanupMouse()}},cleanupMouse:function(){c["delete"](this.POINTER_ID)}};a.mouseEvents=h}(window.PolymerGestures),function(a){var b,c=a.dispatcher,d=a.targetFinding.allShadows.bind(a.targetFinding),e=c.pointermap,f=(Array.prototype.map.call.bind(Array.prototype.map),2500),g=200,h=20,i="touch-action",j=!1,k={events:["touchstart","touchmove","touchend","touchcancel"],register:function(a){j?c.listen(a,this.events):b.enableOnSubtree(a)},unregister:function(a){j&&c.unlisten(a,this.events)},elementAdded:function(a){var b=a.getAttribute(i),e=this.touchActionToScrollType(b);e&&(a._scrollType=e,c.listen(a,this.events),d(a).forEach(function(a){a._scrollType=e,c.listen(a,this.events)},this))},elementRemoved:function(a){a._scrollType=void 0,c.unlisten(a,this.events),d(a).forEach(function(a){a._scrollType=void 0,c.unlisten(a,this.events)},this)},elementChanged:function(a,b){var c=a.getAttribute(i),e=this.touchActionToScrollType(c),f=this.touchActionToScrollType(b);e&&f?(a._scrollType=e,d(a).forEach(function(a){a._scrollType=e},this)):f?this.elementRemoved(a):e&&this.elementAdded(a)},scrollTypes:{EMITTER:"none",XSCROLLER:"pan-x",YSCROLLER:"pan-y",SCROLLER:/^(?:pan-x pan-y)|(?:pan-y pan-x)|auto|manipulation$/},touchActionToScrollType:function(a){var b=a,c=this.scrollTypes;return"none"===b?"none":b===c.XSCROLLER?"X":b===c.YSCROLLER?"Y":c.SCROLLER.exec(b)?"XY":void 0},POINTER_TYPE:"touch",firstTouch:null,isPrimaryTouch:function(a){return this.firstTouch===a.identifier},setPrimaryTouch:function(a){(0===e.pointers()||1===e.pointers()&&e.has(1))&&(this.firstTouch=a.identifier,this.firstXY={X:a.clientX,Y:a.clientY},this.scrolling=null,this.cancelResetClickCount())},removePrimaryPointer:function(a){a.isPrimary&&(this.firstTouch=null,this.firstXY=null,this.resetClickCount())},clickCount:0,resetId:null,resetClickCount:function(){var a=function(){this.clickCount=0,this.resetId=null}.bind(this);this.resetId=setTimeout(a,g)},cancelResetClickCount:function(){this.resetId&&clearTimeout(this.resetId)},typeToButtons:function(a){var b=0;return("touchstart"===a||"touchmove"===a)&&(b=1),b},findTarget:function(b,c){if("touchstart"===this.currentTouchEvent.type){if(this.isPrimaryTouch(b)){var d={clientX:b.clientX,clientY:b.clientY,path:this.currentTouchEvent.path,target:a.wrap(this.currentTouchEvent.target)};return a.findTarget(d)}return a.findTarget(b)}return e.get(c)},touchToPointer:function(b){var d=this.currentTouchEvent,e=c.cloneEvent(b),f=e.pointerId=b.identifier+2;e.target=a.wrap(this.findTarget(b,f)),e.bubbles=!0,e.cancelable=!0,e.detail=this.clickCount,e.buttons=this.typeToButtons(d.type),e.width=b.webkitRadiusX||b.radiusX||0,e.height=b.webkitRadiusY||b.radiusY||0,e.pressure=b.webkitForce||b.force||.5,e.isPrimary=this.isPrimaryTouch(b),e.pointerType=this.POINTER_TYPE,e._source="touch";var g=this;return e.preventDefault=function(){g.scrolling=!1,g.firstXY=null,d.preventDefault()},e},processTouches:function(a,b){var c=a.changedTouches;this.currentTouchEvent=a;for(var d,f,g=0;g<c.length;g++)d=c[g],f=this.touchToPointer(d),"touchstart"===a.type&&e.set(f.pointerId,f.target),e.has(f.pointerId)&&b.call(this,f),("touchend"===a.type||a._cancel)&&this.cleanUpPointer(f)},shouldScroll:function(b){if(this.firstXY){var c,d=a.targetFinding.findScrollAxis(b);if("none"===d)c=!1;else if("XY"===d)c=!0;else{var e=b.changedTouches[0],f=d,g="Y"===d?"X":"Y",h=Math.abs(e["client"+f]-this.firstXY[f]),i=Math.abs(e["client"+g]-this.firstXY[g]);c=h>=i}return c}},findTouch:function(a,b){for(var c,d=0,e=a.length;e>d&&(c=a[d]);d++)if(c.identifier===b)return!0},vacuumTouches:function(a){var b=a.touches;if(e.pointers()>=b.length){var c=[];e.forEach(function(a,d){if(1!==d&&!this.findTouch(b,d-2)){var e=a;c.push(e)}},this),c.forEach(function(a){this.cancel(a),e.delete(a.pointerId)})}},touchstart:function(a){this.vacuumTouches(a),this.setPrimaryTouch(a.changedTouches[0]),this.dedupSynthMouse(a),this.scrolling||(this.clickCount++,this.processTouches(a,this.down))},down:function(a){c.down(a)},touchmove:function(a){if(j)this.processTouches(a,this.move);else if(this.scrolling){if(this.firstXY){var b=a.changedTouches[0],c=b.clientX-this.firstXY.X,d=b.clientY-this.firstXY.Y,e=Math.sqrt(c*c+d*d);e>=h&&(this.touchcancel(a),this.scrolling=!0,this.firstXY=null)}}else null===this.scrolling&&this.shouldScroll(a)?this.scrolling=!0:(this.scrolling=!1,a.preventDefault(),this.processTouches(a,this.move))},move:function(a){c.move(a)},touchend:function(a){this.dedupSynthMouse(a),this.processTouches(a,this.up)},up:function(b){b.relatedTarget=a.wrap(a.findTarget(b)),c.up(b)},cancel:function(a){c.cancel(a)},touchcancel:function(a){a._cancel=!0,this.processTouches(a,this.cancel)},cleanUpPointer:function(a){e["delete"](a.pointerId),this.removePrimaryPointer(a)},dedupSynthMouse:function(b){var c=a.mouseEvents.lastTouches,d=b.changedTouches[0];if(this.isPrimaryTouch(d)){var e={x:d.clientX,y:d.clientY};c.push(e);var g=function(a,b){var c=a.indexOf(b);c>-1&&a.splice(c,1)}.bind(null,c,e);setTimeout(g,f)}}};j||(b=new a.Installer(k.elementAdded,k.elementRemoved,k.elementChanged,k)),a.touchEvents=k}(window.PolymerGestures),function(a){var b=a.dispatcher,c=b.pointermap,d=window.MSPointerEvent&&"number"==typeof window.MSPointerEvent.MSPOINTER_TYPE_MOUSE,e={events:["MSPointerDown","MSPointerMove","MSPointerUp","MSPointerCancel"],register:function(a){a===document&&b.listen(a,this.events)},unregister:function(a){b.unlisten(a,this.events)},POINTER_TYPES:["","unavailable","touch","pen","mouse"],prepareEvent:function(a){var c=a;return c=b.cloneEvent(a),d&&(c.pointerType=this.POINTER_TYPES[a.pointerType]),c._source="ms",c},cleanup:function(a){c["delete"](a)},MSPointerDown:function(d){var e=this.prepareEvent(d);e.target=a.wrap(a.findTarget(d)),c.set(d.pointerId,e.target),b.down(e)},MSPointerMove:function(a){var d=this.prepareEvent(a);d.target=c.get(d.pointerId),b.move(d)},MSPointerUp:function(d){var e=this.prepareEvent(d);e.relatedTarget=a.wrap(a.findTarget(d)),e.target=c.get(e.pointerId),b.up(e),this.cleanup(d.pointerId)},MSPointerCancel:function(d){var e=this.prepareEvent(d);e.relatedTarget=a.wrap(a.findTarget(d)),e.target=c.get(e.pointerId),b.cancel(e),this.cleanup(d.pointerId)}};a.msEvents=e}(window.PolymerGestures),function(a){var b=a.dispatcher,c=b.pointermap,d={events:["pointerdown","pointermove","pointerup","pointercancel"],prepareEvent:function(a){var c=b.cloneEvent(a);return c._source="pointer",c},register:function(a){a===document&&b.listen(a,this.events)},unregister:function(a){b.unlisten(a,this.events)},cleanup:function(a){c["delete"](a)},pointerdown:function(d){var e=this.prepareEvent(d);e.target=a.wrap(a.findTarget(d)),c.set(e.pointerId,e.target),b.down(e)},pointermove:function(a){var d=this.prepareEvent(a);d.target=c.get(d.pointerId),b.move(d)},pointerup:function(d){var e=this.prepareEvent(d);e.relatedTarget=a.wrap(a.findTarget(d)),e.target=c.get(e.pointerId),b.up(e),this.cleanup(d.pointerId)},pointercancel:function(d){var e=this.prepareEvent(d);e.relatedTarget=a.wrap(a.findTarget(d)),e.target=c.get(e.pointerId),b.cancel(e),this.cleanup(d.pointerId)}};a.pointerEvents=d}(window.PolymerGestures),function(a){var b=a.dispatcher;window.PointerEvent?b.registerSource("pointer",a.pointerEvents):window.navigator.msPointerEnabled?b.registerSource("ms",a.msEvents):(b.registerSource("mouse",a.mouseEvents),void 0!==window.ontouchstart&&b.registerSource("touch",a.touchEvents)),b.register(document)}(window.PolymerGestures),function(a){var b=a.dispatcher,c=a.eventFactory,d=new a.PointerMap,e={events:["down","move","up"],WIGGLE_THRESHOLD:4,clampDir:function(a){return a>0?1:-1},calcPositionDelta:function(a,b){var c=0,d=0;return a&&b&&(c=b.pageX-a.pageX,d=b.pageY-a.pageY),{x:c,y:d}},fireTrack:function(a,b,d){var e=d,f=this.calcPositionDelta(e.downEvent,b),g=this.calcPositionDelta(e.lastMoveEvent,b);g.x&&(e.xDirection=this.clampDir(g.x)),g.y&&(e.yDirection=this.clampDir(g.y));var h=c.makeGestureEvent(a,{bubbles:!0,cancelable:!0,dx:f.x,dy:f.y,ddx:g.x,ddy:g.y,x:b.x,y:b.y,clientX:b.clientX,clientY:b.clientY,pageX:b.pageX,pageY:b.pageY,screenX:b.screenX,screenY:b.screenY,xDirection:e.xDirection,yDirection:e.yDirection,trackInfo:e.trackInfo,relatedTarget:b.relatedTarget,pointerType:b.pointerType,pointerId:b.pointerId,_source:"track"});e.downTarget.dispatchEvent(h)},down:function(a){if(a.isPrimary&&("mouse"===a.pointerType?1===a.buttons:!0)){var b={downEvent:a,downTarget:a.target,trackInfo:{},lastMoveEvent:null,xDirection:0,yDirection:0,tracking:!1};d.set(a.pointerId,b)}},move:function(a){var b=d.get(a.pointerId);if(b){if(b.tracking)this.fireTrack("track",a,b);else{var c=this.calcPositionDelta(b.downEvent,a),e=c.x*c.x+c.y*c.y;e>this.WIGGLE_THRESHOLD&&(b.tracking=!0,this.fireTrack("trackstart",b.downEvent,b),this.fireTrack("track",a,b))}b.lastMoveEvent=a}},up:function(a){var b=d.get(a.pointerId);b&&(b.tracking&&this.fireTrack("trackend",a,b),d.delete(a.pointerId))}};b.registerGesture("track",e)}(window.PolymerGestures),function(a){var b=a.dispatcher,c=a.eventFactory,d={HOLD_DELAY:200,WIGGLE_THRESHOLD:16,events:["down","move","up"],heldPointer:null,holdJob:null,pulse:function(){var a=Date.now()-this.heldPointer.timeStamp,b=this.held?"holdpulse":"hold";this.fireHold(b,a),this.held=!0},cancel:function(){clearInterval(this.holdJob),this.held&&this.fireHold("release"),this.held=!1,this.heldPointer=null,this.target=null,this.holdJob=null},down:function(a){a.isPrimary&&!this.heldPointer&&(this.heldPointer=a,this.target=a.target,this.holdJob=setInterval(this.pulse.bind(this),this.HOLD_DELAY))},up:function(a){this.heldPointer&&this.heldPointer.pointerId===a.pointerId&&this.cancel()},move:function(a){if(this.heldPointer&&this.heldPointer.pointerId===a.pointerId){var b=a.clientX-this.heldPointer.clientX,c=a.clientY-this.heldPointer.clientY;b*b+c*c>this.WIGGLE_THRESHOLD&&this.cancel()}},fireHold:function(a,b){var d={bubbles:!0,cancelable:!0,pointerType:this.heldPointer.pointerType,pointerId:this.heldPointer.pointerId,x:this.heldPointer.clientX,y:this.heldPointer.clientY,_source:"hold"};b&&(d.holdTime=b);var e=c.makeGestureEvent(a,d);this.target.dispatchEvent(e)}};b.registerGesture("hold",d)}(window.PolymerGestures),function(a){var b=a.dispatcher,c=a.eventFactory,d=new a.PointerMap,e={events:["down","up"],down:function(a){a.isPrimary&&!a.tapPrevented&&d.set(a.pointerId,{target:a.target,buttons:a.buttons,x:a.clientX,y:a.clientY})},shouldTap:function(a,b){return"mouse"===a.pointerType?1===b.buttons:!a.tapPrevented},up:function(b){var e=d.get(b.pointerId);if(e&&this.shouldTap(b,e)){var f=a.targetFinding.LCA(e.target,b.relatedTarget);if(f){var g=c.makeGestureEvent("tap",{bubbles:!0,cancelable:!0,x:b.clientX,y:b.clientY,detail:b.detail,pointerType:b.pointerType,pointerId:b.pointerId,altKey:b.altKey,ctrlKey:b.ctrlKey,metaKey:b.metaKey,shiftKey:b.shiftKey,_source:"tap"});f.dispatchEvent(g)}}d.delete(b.pointerId)}};c.preventTap=function(a){return function(){a.tapPrevented=!0,d.delete(a.pointerId)}},b.registerGesture("tap",e)}(window.PolymerGestures),function(a){"use strict";function b(a,b){if(!a)throw new Error("ASSERT: "+b)}function c(a){return a>=48&&57>=a}function d(a){return 32===a||9===a||11===a||12===a||160===a||a>=5760&&"\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\ufeff".indexOf(String.fromCharCode(a))>0}function e(a){return 10===a||13===a||8232===a||8233===a}function f(a){return 36===a||95===a||a>=65&&90>=a||a>=97&&122>=a}function g(a){return 36===a||95===a||a>=65&&90>=a||a>=97&&122>=a||a>=48&&57>=a}function h(a){return"this"===a}function i(){for(;Y>X&&d(W.charCodeAt(X));)++X}function j(){var a,b;for(a=X++;Y>X&&(b=W.charCodeAt(X),g(b));)++X;return W.slice(a,X)}function k(){var a,b,c;return a=X,b=j(),c=1===b.length?S.Identifier:h(b)?S.Keyword:"null"===b?S.NullLiteral:"true"===b||"false"===b?S.BooleanLiteral:S.Identifier,{type:c,value:b,range:[a,X]}}function l(){var a,b,c=X,d=W.charCodeAt(X),e=W[X];switch(d){case 46:case 40:case 41:case 59:case 44:case 123:case 125:case 91:case 93:case 58:case 63:return++X,{type:S.Punctuator,value:String.fromCharCode(d),range:[c,X]};default:if(a=W.charCodeAt(X+1),61===a)switch(d){case 37:case 38:case 42:case 43:case 45:case 47:case 60:case 62:case 124:return X+=2,{type:S.Punctuator,value:String.fromCharCode(d)+String.fromCharCode(a),range:[c,X]};case 33:case 61:return X+=2,61===W.charCodeAt(X)&&++X,{type:S.Punctuator,value:W.slice(c,X),range:[c,X]}}}return b=W[X+1],e===b&&"&|".indexOf(e)>=0?(X+=2,{type:S.Punctuator,value:e+b,range:[c,X]}):"<>=!+-*%&|^/".indexOf(e)>=0?(++X,{type:S.Punctuator,value:e,range:[c,X]}):void s({},V.UnexpectedToken,"ILLEGAL")}function m(){var a,d,e;if(e=W[X],b(c(e.charCodeAt(0))||"."===e,"Numeric literal must start with a decimal digit or a decimal point"),d=X,a="","."!==e){for(a=W[X++],e=W[X],"0"===a&&e&&c(e.charCodeAt(0))&&s({},V.UnexpectedToken,"ILLEGAL");c(W.charCodeAt(X));)a+=W[X++];e=W[X]}if("."===e){for(a+=W[X++];c(W.charCodeAt(X));)a+=W[X++];e=W[X]}if("e"===e||"E"===e)if(a+=W[X++],e=W[X],("+"===e||"-"===e)&&(a+=W[X++]),c(W.charCodeAt(X)))for(;c(W.charCodeAt(X));)a+=W[X++];else s({},V.UnexpectedToken,"ILLEGAL");return f(W.charCodeAt(X))&&s({},V.UnexpectedToken,"ILLEGAL"),{type:S.NumericLiteral,value:parseFloat(a),range:[d,X]}}function n(){var a,c,d,f="",g=!1;for(a=W[X],b("'"===a||'"'===a,"String literal must starts with a quote"),c=X,++X;Y>X;){if(d=W[X++],d===a){a="";break}if("\\"===d)if(d=W[X++],d&&e(d.charCodeAt(0)))"\r"===d&&"\n"===W[X]&&++X;else switch(d){case"n":f+="\n";break;case"r":f+="\r";break;case"t":f+="	";break;case"b":f+="\b";break;case"f":f+="\f";break;case"v":f+="";break;default:f+=d}else{if(e(d.charCodeAt(0)))break;f+=d}}return""!==a&&s({},V.UnexpectedToken,"ILLEGAL"),{type:S.StringLiteral,value:f,octal:g,range:[c,X]}}function o(a){return a.type===S.Identifier||a.type===S.Keyword||a.type===S.BooleanLiteral||a.type===S.NullLiteral}function p(){var a;return i(),X>=Y?{type:S.EOF,range:[X,X]}:(a=W.charCodeAt(X),40===a||41===a||58===a?l():39===a||34===a?n():f(a)?k():46===a?c(W.charCodeAt(X+1))?m():l():c(a)?m():l())}function q(){var a;return a=$,X=a.range[1],$=p(),X=a.range[1],a}function r(){var a;a=X,$=p(),X=a}function s(a,c){var d,e=Array.prototype.slice.call(arguments,2),f=c.replace(/%(\d)/g,function(a,c){return b(c<e.length,"Message reference must be in range"),e[c]});throw d=new Error(f),d.index=X,d.description=f,d}function t(a){s(a,V.UnexpectedToken,a.value)}function u(a){var b=q();(b.type!==S.Punctuator||b.value!==a)&&t(b)}function v(a){return $.type===S.Punctuator&&$.value===a}function w(a){return $.type===S.Keyword&&$.value===a}function x(){var a=[];for(u("[");!v("]");)v(",")?(q(),a.push(null)):(a.push(bb()),v("]")||u(","));return u("]"),Z.createArrayExpression(a)}function y(){var a;return i(),a=q(),a.type===S.StringLiteral||a.type===S.NumericLiteral?Z.createLiteral(a):Z.createIdentifier(a.value)}function z(){var a,b;return a=$,i(),(a.type===S.EOF||a.type===S.Punctuator)&&t(a),b=y(),u(":"),Z.createProperty("init",b,bb())}function A(){var a=[];for(u("{");!v("}");)a.push(z()),v("}")||u(",");return u("}"),Z.createObjectExpression(a)}function B(){var a;return u("("),a=bb(),u(")"),a}function C(){var a,b,c;return v("(")?B():(a=$.type,a===S.Identifier?c=Z.createIdentifier(q().value):a===S.StringLiteral||a===S.NumericLiteral?c=Z.createLiteral(q()):a===S.Keyword?w("this")&&(q(),c=Z.createThisExpression()):a===S.BooleanLiteral?(b=q(),b.value="true"===b.value,c=Z.createLiteral(b)):a===S.NullLiteral?(b=q(),b.value=null,c=Z.createLiteral(b)):v("[")?c=x():v("{")&&(c=A()),c?c:void t(q()))}function D(){var a=[];if(u("("),!v(")"))for(;Y>X&&(a.push(bb()),!v(")"));)u(",");return u(")"),a}function E(){var a;return a=q(),o(a)||t(a),Z.createIdentifier(a.value)}function F(){return u("."),E()}function G(){var a;return u("["),a=bb(),u("]"),a}function H(){var a,b,c;for(a=C();;)if(v("["))c=G(),a=Z.createMemberExpression("[",a,c);else if(v("."))c=F(),a=Z.createMemberExpression(".",a,c);else{if(!v("("))break;b=D(),a=Z.createCallExpression(a,b)}return a}function I(){var a,b;return $.type!==S.Punctuator&&$.type!==S.Keyword?b=ab():v("+")||v("-")||v("!")?(a=q(),b=I(),b=Z.createUnaryExpression(a.value,b)):w("delete")||w("void")||w("typeof")?s({},V.UnexpectedToken):b=ab(),b}function J(a){var b=0;if(a.type!==S.Punctuator&&a.type!==S.Keyword)return 0;switch(a.value){case"||":b=1;break;case"&&":b=2;break;case"==":case"!=":case"===":case"!==":b=6;break;case"<":case">":case"<=":case">=":case"instanceof":b=7;break;case"in":b=7;break;case"+":case"-":b=9;break;case"*":case"/":case"%":b=11}return b}function K(){var a,b,c,d,e,f,g,h;if(g=I(),b=$,c=J(b),0===c)return g;for(b.prec=c,q(),e=I(),d=[g,b,e];(c=J($))>0;){for(;d.length>2&&c<=d[d.length-2].prec;)e=d.pop(),f=d.pop().value,g=d.pop(),a=Z.createBinaryExpression(f,g,e),d.push(a);b=q(),b.prec=c,d.push(b),a=I(),d.push(a)}for(h=d.length-1,a=d[h];h>1;)a=Z.createBinaryExpression(d[h-1].value,d[h-2],a),h-=2;return a}function L(){var a,b,c;return a=K(),v("?")&&(q(),b=L(),u(":"),c=L(),a=Z.createConditionalExpression(a,b,c)),a}function M(){var a,b;return a=q(),a.type!==S.Identifier&&t(a),b=v("(")?D():[],Z.createFilter(a.value,b)}function N(){for(;v("|");)q(),M()}function O(){i(),r();var a=bb();a&&(","===$.value||"in"==$.value&&a.type===U.Identifier?Q(a):(N(),"as"===$.value?P(a):Z.createTopLevel(a))),$.type!==S.EOF&&t($)}function P(a){q();var b=q().value;Z.createAsExpression(a,b)}function Q(a){var b;","===$.value&&(q(),$.type!==S.Identifier&&t($),b=q().value),q();var c=bb();N(),Z.createInExpression(a.name,b,c)}function R(a,b){return Z=b,W=a,X=0,Y=W.length,$=null,_={labelSet:{}},O()}var S,T,U,V,W,X,Y,Z,$,_;S={BooleanLiteral:1,EOF:2,Identifier:3,Keyword:4,NullLiteral:5,NumericLiteral:6,Punctuator:7,StringLiteral:8},T={},T[S.BooleanLiteral]="Boolean",T[S.EOF]="<end>",T[S.Identifier]="Identifier",T[S.Keyword]="Keyword",T[S.NullLiteral]="Null",T[S.NumericLiteral]="Numeric",T[S.Punctuator]="Punctuator",T[S.StringLiteral]="String",U={ArrayExpression:"ArrayExpression",BinaryExpression:"BinaryExpression",CallExpression:"CallExpression",ConditionalExpression:"ConditionalExpression",EmptyStatement:"EmptyStatement",ExpressionStatement:"ExpressionStatement",Identifier:"Identifier",Literal:"Literal",LabeledStatement:"LabeledStatement",LogicalExpression:"LogicalExpression",MemberExpression:"MemberExpression",ObjectExpression:"ObjectExpression",Program:"Program",Property:"Property",ThisExpression:"ThisExpression",UnaryExpression:"UnaryExpression"},V={UnexpectedToken:"Unexpected token %0",UnknownLabel:"Undefined label '%0'",Redeclaration:"%0 '%1' has already been declared"};var ab=H,bb=L;a.esprima={parse:R}}(this),function(a){"use strict";function b(a,b,d,e){var f;try{if(f=c(a),f.scopeIdent&&(d.nodeType!==Node.ELEMENT_NODE||"TEMPLATE"!==d.tagName||"bind"!==b&&"repeat"!==b))throw Error("as and in can only be used within <template bind/repeat>")}catch(g){return void console.error("Invalid expression syntax: "+a,g)}return function(a,b,c){var d=f.getBinding(a,e,c);return f.scopeIdent&&d&&(b.polymerExpressionScopeIdent_=f.scopeIdent,f.indexIdent&&(b.polymerExpressionIndexIdent_=f.indexIdent)),d}}function c(a){var b=q[a];if(!b){var c=new j;esprima.parse(a,c),b=new l(c),q[a]=b}return b}function d(a){this.value=a,this.valueFn_=void 0}function e(a){this.name=a,this.path=Path.get(a)}function f(a,b,c){this.computed="["==c,this.dynamicDeps="function"==typeof a||a.dynamicDeps||this.computed&&!(b instanceof d),this.simplePath=!this.dynamicDeps&&(b instanceof e||b instanceof d)&&(a instanceof f||a instanceof e),this.object=this.simplePath?a:i(a),this.property=!this.computed||this.simplePath?b:i(b)}function g(a,b){this.name=a,this.args=[];for(var c=0;c<b.length;c++)this.args[c]=i(b[c])}function h(){throw Error("Not Implemented")}function i(a){return"function"==typeof a?a:a.valueFn()}function j(){this.expression=null,this.filters=[],this.deps={},this.currentPath=void 0,this.scopeIdent=void 0,this.indexIdent=void 0,this.dynamicDeps=!1}function k(a){this.value_=a}function l(a){if(this.scopeIdent=a.scopeIdent,this.indexIdent=a.indexIdent,!a.expression)throw Error("No expression found.");this.expression=a.expression,i(this.expression),this.filters=a.filters,this.dynamicDeps=a.dynamicDeps}function m(a){return String(a).replace(/[A-Z]/g,function(a){return"-"+a.toLowerCase()})}function n(a,b){for(;a[t]&&!Object.prototype.hasOwnProperty.call(a,b);)a=a[t];return a}function o(a){switch(a){case"":return!1;case"false":case"null":case"true":return!0}return isNaN(Number(a))?!1:!0}function p(){}var q=Object.create(null);
d.prototype={valueFn:function(){if(!this.valueFn_){var a=this.value;this.valueFn_=function(){return a}}return this.valueFn_}},e.prototype={valueFn:function(){if(!this.valueFn_){var a=(this.name,this.path);this.valueFn_=function(b,c){return c&&c.addPath(b,a),a.getValueFrom(b)}}return this.valueFn_},setValue:function(a,b){return 1==this.path.length,a=n(a,this.path[0]),this.path.setValueFrom(a,b)}},f.prototype={get fullPath(){if(!this.fullPath_){var a=this.object instanceof f?this.object.fullPath.slice():[this.object.name];a.push(this.property instanceof e?this.property.name:this.property.value),this.fullPath_=Path.get(a)}return this.fullPath_},valueFn:function(){if(!this.valueFn_){var a=this.object;if(this.simplePath){var b=this.fullPath;this.valueFn_=function(a,c){return c&&c.addPath(a,b),b.getValueFrom(a)}}else if(this.computed){var c=this.property;this.valueFn_=function(b,d,e){var f=a(b,d,e),g=c(b,d,e);return d&&d.addPath(f,[g]),f?f[g]:void 0}}else{var b=Path.get(this.property.name);this.valueFn_=function(c,d,e){var f=a(c,d,e);return d&&d.addPath(f,b),b.getValueFrom(f)}}}return this.valueFn_},setValue:function(a,b){if(this.simplePath)return this.fullPath.setValueFrom(a,b),b;var c=this.object(a),d=this.property instanceof e?this.property.name:this.property(a);return c[d]=b}},g.prototype={transform:function(a,b,c,d,e){var f=c[this.name],g=a;if(f)g=void 0;else if(f=g[this.name],!f)return void console.error("Cannot find function or filter: "+this.name);if(d?f=f.toModel:"function"==typeof f.toDOM&&(f=f.toDOM),"function"!=typeof f)return void console.error("Cannot find function or filter: "+this.name);for(var h=e||[],j=0;j<this.args.length;j++)h.push(i(this.args[j])(a,b,c));return f.apply(g,h)}};var r={"+":function(a){return+a},"-":function(a){return-a},"!":function(a){return!a}},s={"+":function(a,b){return a+b},"-":function(a,b){return a-b},"*":function(a,b){return a*b},"/":function(a,b){return a/b},"%":function(a,b){return a%b},"<":function(a,b){return b>a},">":function(a,b){return a>b},"<=":function(a,b){return b>=a},">=":function(a,b){return a>=b},"==":function(a,b){return a==b},"!=":function(a,b){return a!=b},"===":function(a,b){return a===b},"!==":function(a,b){return a!==b},"&&":function(a,b){return a&&b},"||":function(a,b){return a||b}};j.prototype={createUnaryExpression:function(a,b){if(!r[a])throw Error("Disallowed operator: "+a);return b=i(b),function(c,d,e){return r[a](b(c,d,e))}},createBinaryExpression:function(a,b,c){if(!s[a])throw Error("Disallowed operator: "+a);return b=i(b),c=i(c),function(d,e,f){return s[a](b(d,e,f),c(d,e,f))}},createConditionalExpression:function(a,b,c){return a=i(a),b=i(b),c=i(c),function(d,e,f){return a(d,e,f)?b(d,e,f):c(d,e,f)}},createIdentifier:function(a){var b=new e(a);return b.type="Identifier",b},createMemberExpression:function(a,b,c){var d=new f(b,c,a);return d.dynamicDeps&&(this.dynamicDeps=!0),d},createCallExpression:function(a,b){if(!(a instanceof e))throw Error("Only identifier function invocations are allowed");var c=new g(a.name,b);return function(a,b,d){return c.transform(a,b,d,!1)}},createLiteral:function(a){return new d(a.value)},createArrayExpression:function(a){for(var b=0;b<a.length;b++)a[b]=i(a[b]);return function(b,c,d){for(var e=[],f=0;f<a.length;f++)e.push(a[f](b,c,d));return e}},createProperty:function(a,b,c){return{key:b instanceof e?b.name:b.value,value:c}},createObjectExpression:function(a){for(var b=0;b<a.length;b++)a[b].value=i(a[b].value);return function(b,c,d){for(var e={},f=0;f<a.length;f++)e[a[f].key]=a[f].value(b,c,d);return e}},createFilter:function(a,b){this.filters.push(new g(a,b))},createAsExpression:function(a,b){this.expression=a,this.scopeIdent=b},createInExpression:function(a,b,c){this.expression=c,this.scopeIdent=a,this.indexIdent=b},createTopLevel:function(a){this.expression=a},createThisExpression:h},k.prototype={open:function(){return this.value_},discardChanges:function(){return this.value_},deliver:function(){},close:function(){}},l.prototype={getBinding:function(a,b,c){function d(){if(h)return h=!1,g;i.dynamicDeps&&f.startReset();var c=i.getValue(a,i.dynamicDeps?f:void 0,b);return i.dynamicDeps&&f.finishReset(),c}function e(c){return i.setValue(a,c,b),c}if(c)return this.getValue(a,void 0,b);var f=new CompoundObserver,g=this.getValue(a,f,b),h=!0,i=this;return new ObserverTransform(f,d,e,!0)},getValue:function(a,b,c){for(var d=i(this.expression)(a,b,c),e=0;e<this.filters.length;e++)d=this.filters[e].transform(a,b,c,!1,[d]);return d},setValue:function(a,b,c){for(var d=this.filters?this.filters.length:0;d-->0;)b=this.filters[d].transform(a,void 0,c,!0,[b]);return this.expression.setValue?this.expression.setValue(a,b):void 0}};var t="@"+Math.random().toString(36).slice(2);p.prototype={styleObject:function(a){var b=[];for(var c in a)b.push(m(c)+": "+a[c]);return b.join("; ")},tokenList:function(a){var b=[];for(var c in a)a[c]&&b.push(c);return b.join(" ")},prepareInstancePositionChanged:function(a){var b=a.polymerExpressionIndexIdent_;if(b)return function(a,c){a.model[b]=c}},prepareBinding:function(a,c,d){var e=Path.get(a);{if(o(a)||!e.valid)return b(a,c,d,this);if(1==e.length)return function(a,b,c){if(c)return e.getValueFrom(a);var d=n(a,e[0]);return new PathObserver(d,e)}}},prepareInstanceModel:function(a){var b=a.polymerExpressionScopeIdent_;if(b){var c=a.templateInstance?a.templateInstance.model:a.model,d=a.polymerExpressionIndexIdent_;return function(a){return u(c,a,b,d)}}}};var u="__proto__"in{}?function(a,b,c,d){var e={};return e[c]=b,e[d]=void 0,e[t]=a,e.__proto__=a,e}:function(a,b,c,d){var e=Object.create(a);return Object.defineProperty(e,c,{value:b,configurable:!0,writable:!0}),Object.defineProperty(e,d,{value:void 0,configurable:!0,writable:!0}),Object.defineProperty(e,t,{value:a,configurable:!0,writable:!0}),e};a.PolymerExpressions=p,p.getExpression=c}(this),Polymer={version:"0.3.4"},"function"==typeof window.Polymer&&(Polymer={}),function(a){function b(a,b){return a&&b&&Object.getOwnPropertyNames(b).forEach(function(c){var d=Object.getOwnPropertyDescriptor(b,c);d&&(Object.defineProperty(a,c,d),"function"==typeof d.value&&(d.value.nom=c))}),a}a.extend=b}(Polymer),function(a){function b(a,b,d){return a?a.stop():a=new c(this),a.go(b,d),a}var c=function(a){this.context=a,this.boundComplete=this.complete.bind(this)};c.prototype={go:function(a,b){this.callback=a;var c;b?(c=setTimeout(this.boundComplete,b),this.handle=function(){clearTimeout(c)}):(c=requestAnimationFrame(this.boundComplete),this.handle=function(){cancelAnimationFrame(c)})},stop:function(){this.handle&&(this.handle(),this.handle=null)},complete:function(){this.handle&&(this.stop(),this.callback.call(this.context))}},a.job=b}(Polymer),function(){var a={};HTMLElement.register=function(b,c){a[b]=c},HTMLElement.getPrototypeForTag=function(b){var c=b?a[b]:HTMLElement.prototype;return c||Object.getPrototypeOf(document.createElement(b))};var b=Event.prototype.stopPropagation;Event.prototype.stopPropagation=function(){this.cancelBubble=!0,b.apply(this,arguments)}}(Polymer),function(a){function b(a){var e=b.caller,g=e.nom,h=e._super;h||(g||(g=e.nom=c.call(this,e)),g||console.warn("called super() on a method not installed declaratively (has no .nom property)"),h=d(e,g,f(this)));var i=h[g];return i?(i._super||d(i,g,h),i.apply(this,a||[])):void 0}function c(a){for(var b=this.__proto__;b&&b!==HTMLElement.prototype;){for(var c,d=Object.getOwnPropertyNames(b),e=0,f=d.length;f>e&&(c=d[e]);e++){var g=Object.getOwnPropertyDescriptor(b,c);if("function"==typeof g.value&&g.value===a)return c}b=b.__proto__}}function d(a,b,c){var d=e(c,b,a);return d[b]&&(d[b].nom=b),a._super=d}function e(a,b,c){for(;a;){if(a[b]!==c&&a[b])return a;a=f(a)}return Object}function f(a){return a.__proto__}a.super=b}(Polymer),function(a){function b(a,b){var d=typeof b;return b instanceof Date&&(d="date"),c[d](a,b)}var c={string:function(a){return a},date:function(a){return new Date(Date.parse(a)||Date.now())},"boolean":function(a){return""===a?!0:"false"===a?!1:!!a},number:function(a){var b=parseFloat(a);return 0===b&&(b=parseInt(a)),isNaN(b)?a:b},object:function(a,b){if(null===b)return a;try{return JSON.parse(a.replace(/'/g,'"'))}catch(c){return a}},"function":function(a,b){return b}};a.deserializeValue=b}(Polymer),function(a){var b=a.extend,c={};c.declaration={},c.instance={},c.publish=function(a,c){for(var d in a)b(c,a[d])},a.api=c}(Polymer),function(a){var b={async:function(a,b,c){Platform.flush(),b=b&&b.length?b:[b];var d=function(){(this[a]||a).apply(this,b)}.bind(this),e=c?setTimeout(d,c):requestAnimationFrame(d);return c?e:~e},cancelAsync:function(a){0>a?cancelAnimationFrame(~a):clearTimeout(a)},fire:function(a,b,c,d,e){var f=c||this,b=b||{},g=new CustomEvent(a,{bubbles:void 0!==d?d:!0,cancelable:void 0!==e?e:!0,detail:b});return f.dispatchEvent(g),g},asyncFire:function(){this.async("fire",arguments)},classFollows:function(a,b,c){b&&b.classList.remove(c),a&&a.classList.add(c)},injectBoundHTML:function(a,b){var c=document.createElement("template");c.innerHTML=a;var d=this.instanceTemplate(c);return b&&(b.textContent="",b.appendChild(d)),d}},c=function(){},d={};b.asyncMethod=b.async,a.api.instance.utils=b,a.nop=c,a.nob=d}(Polymer),function(a){var b=window.logFlags||{},c="on-",d={EVENT_PREFIX:c,addHostListeners:function(){var a=this.eventDelegates;b.events&&Object.keys(a).length>0&&console.log("[%s] addHostListeners:",this.localName,a);for(var c in a){var d=a[c];this.addEventListener(c,this.element.getEventHandler(this,this,d))}},dispatchMethod:function(a,c,d){if(a){b.events&&console.group("[%s] dispatch [%s]",a.localName,c);var e="function"==typeof c?c:a[c];e&&e[d?"apply":"call"](a,d),b.events&&console.groupEnd(),Platform.flush()}}};a.api.instance.events=d}(Polymer),function(a){var b={copyInstanceAttributes:function(){var a=this._instanceAttributes;for(var b in a)this.hasAttribute(b)||this.setAttribute(b,a[b])},takeAttributes:function(){if(this._publishLC)for(var a,b=0,c=this.attributes,d=c.length;(a=c[b])&&d>b;b++)this.attributeToProperty(a.name,a.value)},attributeToProperty:function(b,c){var b=this.propertyForAttribute(b);if(b){if(c&&c.search(a.bindPattern)>=0)return;var d=this[b],c=this.deserializeValue(c,d);c!==d&&(this[b]=c)}},propertyForAttribute:function(a){var b=this._publishLC&&this._publishLC[a];return b},deserializeValue:function(b,c){return a.deserializeValue(b,c)},serializeValue:function(a,b){return"boolean"===b?a?"":void 0:"object"!==b&&"function"!==b&&void 0!==a?a:void 0},reflectPropertyToAttribute:function(a){var b=typeof this[a],c=this.serializeValue(this[a],b);void 0!==c?this.setAttribute(a,c):"boolean"===b&&this.removeAttribute(a)}};a.api.instance.attributes=b}(Polymer),function(a){function b(a,b){return a===b?0!==a||1/a===1/b:f(a)&&f(b)?!0:a!==a&&b!==b}function c(a,b){return void 0===b&&null===a?b:null===b||void 0===b?a:b}var d=window.logFlags||{},e={object:void 0,type:"update",name:void 0,oldValue:void 0},f=Number.isNaN||function(a){return"number"==typeof a&&isNaN(a)},g={createPropertyObserver:function(){var a=this._observeNames;if(a&&a.length){var b=this._propertyObserver=new CompoundObserver(!0);this.registerObserver(b);for(var c,d=0,e=a.length;e>d&&(c=a[d]);d++)b.addPath(this,c),this.observeArrayValue(c,this[c],null)}},openPropertyObserver:function(){this._propertyObserver&&this._propertyObserver.open(this.notifyPropertyChanges,this)},notifyPropertyChanges:function(a,b,c){var d,e,f={};for(var g in b)if(d=c[2*g+1],e=this.observe[d]){var h=b[g],i=a[g];this.observeArrayValue(d,i,h),f[e]||(void 0!==h&&null!==h||void 0!==i&&null!==i)&&(f[e]=!0,this.invokeMethod(e,[h,i,arguments]))}},deliverChanges:function(){this._propertyObserver&&this._propertyObserver.deliver()},propertyChanged_:function(a){this.reflect[a]&&this.reflectPropertyToAttribute(a)},observeArrayValue:function(a,b,c){var e=this.observe[a];if(e&&(Array.isArray(c)&&(d.observe&&console.log("[%s] observeArrayValue: unregister observer [%s]",this.localName,a),this.closeNamedObserver(a+"__array")),Array.isArray(b))){d.observe&&console.log("[%s] observeArrayValue: register observer [%s]",this.localName,a,b);var f=new ArrayObserver(b);f.open(function(a,b){this.invokeMethod(e,[b])},this),this.registerNamedObserver(a+"__array",f)}},emitPropertyChangeRecord:function(a,c,d){if(!b(c,d)&&(this.propertyChanged_(a,c,d),Observer.hasObjectObserve)){var f=this.notifier_;f||(f=this.notifier_=Object.getNotifier(this)),e.object=this,e.name=a,e.oldValue=d,f.notify(e)}},bindToAccessor:function(a,c,d){var e=a+"_",f=a+"Observable_";this[f]=c;var g=this[e],h=this,i=c.open(function(b,c){h[e]=b,h.emitPropertyChangeRecord(a,b,c)});if(d&&!b(g,i)){var j=d(g,i);b(i,j)||(i=j,c.setValue&&c.setValue(i))}this[e]=i,this.emitPropertyChangeRecord(a,i,g);var k={close:function(){c.close(),h[f]=void 0}};return this.registerObserver(k),k},createComputedProperties:function(){if(this._computedNames)for(var a=0;a<this._computedNames.length;a++){var b=this._computedNames[a],c=this.computed[b];try{var d=PolymerExpressions.getExpression(c),e=d.getBinding(this,this.element.syntax);this.bindToAccessor(b,e)}catch(f){console.error("Failed to create computed property",f)}}},bindProperty:function(a,b,d){return d?void(this[a]=b):this.bindToAccessor(a,b,c)},invokeMethod:function(a,b){var c=this[a]||a;"function"==typeof c&&c.apply(this,b)},registerObserver:function(a){return this._observers?void this._observers.push(a):void(this._observers=[a])},closeObservers:function(){if(this._observers){for(var a=this._observers,b=0;b<a.length;b++){var c=a[b];c&&"function"==typeof c.close&&c.close()}this._observers=[]}},registerNamedObserver:function(a,b){var c=this._namedObservers||(this._namedObservers={});c[a]=b},closeNamedObserver:function(a){var b=this._namedObservers;return b&&b[a]?(b[a].close(),b[a]=null,!0):void 0},closeNamedObservers:function(){if(this._namedObservers){for(var a in this._namedObservers)this.closeNamedObserver(a);this._namedObservers={}}}};a.api.instance.properties=g}(Polymer),function(a){var b=window.logFlags||0,c={instanceTemplate:function(a){for(var b=this.syntax||!a.bindingDelegate&&this.element.syntax,c=a.createInstance(this,b),d=c.bindings_,e=0;e<d.length;e++)this.registerObserver(d[e]);return c},bind:function(a,b,c){var d=this.propertyForAttribute(a);if(d){var e=this.bindProperty(d,b,c);return Platform.enableBindingsReflection&&e&&(e.path=b.path_,this._recordBinding(d,e)),this.reflect[d]&&this.reflectPropertyToAttribute(d),e}return this.mixinSuper(arguments)},bindFinished:function(){this.makeElementReady()},_recordBinding:function(a,b){this.bindings_=this.bindings_||{},this.bindings_[a]=b},asyncUnbindAll:function(){this._unbound||(b.unbind&&console.log("[%s] asyncUnbindAll",this.localName),this._unbindAllJob=this.job(this._unbindAllJob,this.unbindAll,0))},unbindAll:function(){this._unbound||(this.closeObservers(),this.closeNamedObservers(),this._unbound=!0)},cancelUnbindAll:function(){return this._unbound?void(b.unbind&&console.warn("[%s] already unbound, cannot cancel unbindAll",this.localName)):(b.unbind&&console.log("[%s] cancelUnbindAll",this.localName),void(this._unbindAllJob&&(this._unbindAllJob=this._unbindAllJob.stop())))}},d=/\{\{([^{}]*)}}/;a.bindPattern=d,a.api.instance.mdv=c}(Polymer),function(a){function b(a){return a.hasOwnProperty("PolymerBase")}function c(){}var d={PolymerBase:!0,job:function(a,b,c){if("string"!=typeof a)return Polymer.job.call(this,a,b,c);var d="___"+a;this[d]=Polymer.job.call(this,this[d],b,c)},"super":Polymer.super,created:function(){},ready:function(){},createdCallback:function(){this.templateInstance&&this.templateInstance.model&&console.warn("Attributes on "+this.localName+" were data bound prior to Polymer upgrading the element. This may result in incorrect binding types."),this.created(),this.prepareElement(),(!this.ownerDocument.isStagingDocument||window.ShadowDOMPolyfill)&&this.makeElementReady()},prepareElement:function(){return this._elementPrepared?void console.warn("Element already prepared",this.localName):(this._elementPrepared=!0,this.shadowRoots={},this.createPropertyObserver(),this.openPropertyObserver(),this.copyInstanceAttributes(),this.takeAttributes(),void this.addHostListeners())},makeElementReady:function(){this._readied||(this._readied=!0,this.createComputedProperties(),this.parseDeclarations(this.__proto__),this.removeAttribute("unresolved"),this.ready())},attachedCallback:function(){this.cancelUnbindAll(),this.attached&&this.attached(),this.enteredView&&this.enteredView(),this.hasBeenAttached||(this.hasBeenAttached=!0,this.domReady&&this.async("domReady"))},detachedCallback:function(){this.preventDispose||this.asyncUnbindAll(),this.detached&&this.detached(),this.leftView&&this.leftView()},enteredViewCallback:function(){this.attachedCallback()},leftViewCallback:function(){this.detachedCallback()},enteredDocumentCallback:function(){this.attachedCallback()},leftDocumentCallback:function(){this.detachedCallback()},parseDeclarations:function(a){a&&a.element&&(this.parseDeclarations(a.__proto__),a.parseDeclaration.call(this,a.element))},parseDeclaration:function(a){var b=this.fetchTemplate(a);if(b){var c=this.shadowFromTemplate(b);this.shadowRoots[a.name]=c}},fetchTemplate:function(a){return a.querySelector("template")},shadowFromTemplate:function(a){if(a){var b=this.createShadowRoot(),c=this.instanceTemplate(a);return b.appendChild(c),this.shadowRootReady(b,a),b}},lightFromTemplate:function(a,b){if(a){this.eventController=this;var c=this.instanceTemplate(a);return b?this.insertBefore(c,b):this.appendChild(c),this.shadowRootReady(this),c}},shadowRootReady:function(a){this.marshalNodeReferences(a),PolymerGestures.register(a)},marshalNodeReferences:function(a){var b=this.$=this.$||{};if(a)for(var c,d=a.querySelectorAll("[id]"),e=0,f=d.length;f>e&&(c=d[e]);e++)b[c.id]=c},attributeChangedCallback:function(a){"class"!==a&&"style"!==a&&this.attributeToProperty(a,this.getAttribute(a)),this.attributeChanged&&this.attributeChanged.apply(this,arguments)},onMutation:function(a,b){var c=new MutationObserver(function(a){b.call(this,c,a),c.disconnect()}.bind(this));c.observe(a,{childList:!0,subtree:!0})}};c.prototype=d,d.constructor=c,a.Base=c,a.isBase=b,a.api.instance.base=d}(Polymer),function(a){function b(a){return a.__proto__}function c(a,b){var c="",d=!1;b&&(c=b.localName,d=b.hasAttribute("is"));var e=Platform.ShadowCSS.makeScopeSelector(c,d);return Platform.ShadowCSS.shimCssText(a,e)}var d=(window.logFlags||{},"element"),e="controller",f={STYLE_SCOPE_ATTRIBUTE:d,installControllerStyles:function(){var a=this.findStyleScope();if(a&&!this.scopeHasNamedStyle(a,this.localName)){for(var c=b(this),d="";c&&c.element;)d+=c.element.cssTextForScope(e),c=b(c);d&&this.installScopeCssText(d,a)}},installScopeStyle:function(a,b,c){var c=c||this.findStyleScope(),b=b||"";if(c&&!this.scopeHasNamedStyle(c,this.localName+b)){var d="";if(a instanceof Array)for(var e,f=0,g=a.length;g>f&&(e=a[f]);f++)d+=e.textContent+"\n\n";else d=a.textContent;this.installScopeCssText(d,c,b)}},installScopeCssText:function(a,b,d){if(b=b||this.findStyleScope(),d=d||"",b){window.ShadowDOMPolyfill&&(a=c(a,b.host));var f=this.element.cssTextToScopeStyle(a,e);Polymer.applyStyleToScope(f,b),this.styleCacheForScope(b)[this.localName+d]=!0}},findStyleScope:function(a){for(var b=a||this;b.parentNode;)b=b.parentNode;return b},scopeHasNamedStyle:function(a,b){var c=this.styleCacheForScope(a);return c[b]},styleCacheForScope:function(a){if(window.ShadowDOMPolyfill){var b=a.host?a.host.localName:a.localName;return g[b]||(g[b]={})}return a._scopeStyles=a._scopeStyles||{}}},g={};a.api.instance.styles=f}(Polymer),function(a){function b(a,b){if(1===arguments.length&&"string"!=typeof arguments[0]){b=a;var c=document._currentScript;if(a=c&&c.parentNode&&c.parentNode.getAttribute?c.parentNode.getAttribute("name"):"",!a)throw"Element name could not be inferred."}if(f[a])throw"Already registered (Polymer) prototype for element "+a;e(a,b),d(a)}function c(a,b){h[a]=b}function d(a){h[a]&&(h[a].registerWhenReady(),delete h[a])}function e(a,b){return i[a]=b||{}}function f(a){return i[a]}var g=a.extend,h=(a.api,{}),i={};a.getRegisteredPrototype=f,a.waitingForPrototype=c,window.Polymer=b,g(Polymer,a);var j=Platform.deliverDeclarations();if(j)for(var k,l=0,m=j.length;m>l&&(k=j[l]);l++)b.apply(null,k)}(Polymer),function(a){var b={resolveElementPaths:function(a){Platform.urlResolver.resolveDom(a)},addResolvePathApi:function(){var a=this.getAttribute("assetpath")||"",b=new URL(a,this.ownerDocument.baseURI);this.prototype.resolvePath=function(a,c){var d=new URL(a,c||b);return d.href}}};a.api.declaration.path=b}(Polymer),function(a){function b(a,b){var c=new URL(a.getAttribute("href"),b).href;return"@import '"+c+"';"}function c(a,b){if(a){b===document&&(b=document.head),window.ShadowDOMPolyfill&&(b=document.head);var c=d(a.textContent),e=a.getAttribute(h);e&&c.setAttribute(h,e);var f=b.firstElementChild;if(b===document.head){var g="style["+h+"]",i=document.head.querySelectorAll(g);i.length&&(f=i[i.length-1].nextElementSibling)}b.insertBefore(c,f)}}function d(a,b){b=b||document,b=b.createElement?b:b.ownerDocument;var c=b.createElement("style");return c.textContent=a,c}function e(a){return a&&a.__resource||""}function f(a,b){return p?p.call(a,b):void 0}var g=(window.logFlags||{},a.api.instance.styles),h=g.STYLE_SCOPE_ATTRIBUTE,i="style",j="@import",k="link[rel=stylesheet]",l="global",m="polymer-scope",n={loadStyles:function(a){var b=this.fetchTemplate(),c=b&&this.templateContent();if(c){this.convertSheetsToStyles(c);var d=this.findLoadableStyles(c);if(d.length){var e=b.ownerDocument.baseURI;return Platform.styleResolver.loadStyles(d,e,a)}}a&&a()},convertSheetsToStyles:function(a){for(var c,e,f=a.querySelectorAll(k),g=0,h=f.length;h>g&&(c=f[g]);g++)e=d(b(c,this.ownerDocument.baseURI),this.ownerDocument),this.copySheetAttributes(e,c),c.parentNode.replaceChild(e,c)},copySheetAttributes:function(a,b){for(var c,d=0,e=b.attributes,f=e.length;(c=e[d])&&f>d;d++)"rel"!==c.name&&"href"!==c.name&&a.setAttribute(c.name,c.value)},findLoadableStyles:function(a){var b=[];if(a)for(var c,d=a.querySelectorAll(i),e=0,f=d.length;f>e&&(c=d[e]);e++)c.textContent.match(j)&&b.push(c);return b},installSheets:function(){this.cacheSheets(),this.cacheStyles(),this.installLocalSheets(),this.installGlobalStyles()},cacheSheets:function(){this.sheets=this.findNodes(k),this.sheets.forEach(function(a){a.parentNode&&a.parentNode.removeChild(a)})},cacheStyles:function(){this.styles=this.findNodes(i+"["+m+"]"),this.styles.forEach(function(a){a.parentNode&&a.parentNode.removeChild(a)})},installLocalSheets:function(){var a=this.sheets.filter(function(a){return!a.hasAttribute(m)}),b=this.templateContent();if(b){var c="";if(a.forEach(function(a){c+=e(a)+"\n"}),c){var f=d(c,this.ownerDocument);b.insertBefore(f,b.firstChild)}}},findNodes:function(a,b){var c=this.querySelectorAll(a).array(),d=this.templateContent();if(d){var e=d.querySelectorAll(a).array();c=c.concat(e)}return b?c.filter(b):c},installGlobalStyles:function(){var a=this.styleForScope(l);c(a,document.head)},cssTextForScope:function(a){var b="",c="["+m+"="+a+"]",d=function(a){return f(a,c)},g=this.sheets.filter(d);g.forEach(function(a){b+=e(a)+"\n\n"});var h=this.styles.filter(d);return h.forEach(function(a){b+=a.textContent+"\n\n"}),b},styleForScope:function(a){var b=this.cssTextForScope(a);return this.cssTextToScopeStyle(b,a)},cssTextToScopeStyle:function(a,b){if(a){var c=d(a);return c.setAttribute(h,this.getAttribute("name")+"-"+b),c}}},o=HTMLElement.prototype,p=o.matches||o.matchesSelector||o.webkitMatchesSelector||o.mozMatchesSelector;a.api.declaration.styles=n,a.applyStyleToScope=c}(Polymer),function(a){var b=(window.logFlags||{},a.api.instance.events),c=b.EVENT_PREFIX,d={};["webkitAnimationStart","webkitAnimationEnd","webkitTransitionEnd","DOMFocusOut","DOMFocusIn","DOMMouseScroll"].forEach(function(a){d[a.toLowerCase()]=a});var e={parseHostEvents:function(){var a=this.prototype.eventDelegates;this.addAttributeDelegates(a)},addAttributeDelegates:function(a){for(var b,c=0;b=this.attributes[c];c++)this.hasEventPrefix(b.name)&&(a[this.removeEventPrefix(b.name)]=b.value.replace("{{","").replace("}}","").trim())},hasEventPrefix:function(a){return a&&"o"===a[0]&&"n"===a[1]&&"-"===a[2]},removeEventPrefix:function(a){return a.slice(f)},findController:function(a){for(;a.parentNode;){if(a.eventController)return a.eventController;a=a.parentNode}return a.host},getEventHandler:function(a,b,c){var d=this;return function(e){a&&a.PolymerBase||(a=d.findController(b));var f=[e,e.detail,e.currentTarget];a.dispatchMethod(a,c,f)}},prepareEventBinding:function(a,b){if(this.hasEventPrefix(b)){var c=this.removeEventPrefix(b);c=d[c]||c;var e=this;return function(b,d,f){function g(){return"{{ "+a+" }}"}var h=e.getEventHandler(void 0,d,a);return d.addEventListener(c,h),f?void 0:{open:g,discardChanges:g,close:function(){d.removeEventListener(c,h)}}}}}},f=c.length;a.api.declaration.events=e}(Polymer),function(a){var b={inferObservers:function(a){var b,c=a.observe;for(var d in a)"Changed"===d.slice(-7)&&(c||(c=a.observe={}),b=d.slice(0,-7),c[b]=c[b]||d)},explodeObservers:function(a){var b=a.observe;if(b){var c={};for(var d in b)for(var e,f=d.split(" "),g=0;e=f[g];g++)c[e]=b[d];a.observe=c}},optimizePropertyMaps:function(a){if(a.observe){var b=a._observeNames=[];for(var c in a.observe)for(var d,e=c.split(" "),f=0;d=e[f];f++)b.push(d)}if(a.publish){var b=a._publishNames=[];for(var c in a.publish)b.push(c)}if(a.computed){var b=a._computedNames=[];for(var c in a.computed)b.push(c)}},publishProperties:function(a,b){var c=a.publish;c&&(this.requireProperties(c,a,b),a._publishLC=this.lowerCaseMap(c))},requireProperties:function(a,b){b.reflect=b.reflect||{};for(var c in a){var d=a[c],e=this.reflectHintForDescriptor(d);void 0===b.reflect[c]&&void 0!==e&&(b.reflect[c]=e),void 0===b[c]&&(b[c]=this.valueForDescriptor(d))}},valueForDescriptor:function(a){var b="object"==typeof a&&a?a.value:a;return void 0!==b?b:null},reflectHintForDescriptor:function(a){return"object"==typeof a&&a&&void 0!==a.reflect?a.reflect:void 0},lowerCaseMap:function(a){var b={};for(var c in a)b[c.toLowerCase()]=c;return b},createPropertyAccessor:function(a){var b=this.prototype,c=a+"_",d=a+"Observable_";b[c]=b[a],Object.defineProperty(b,a,{get:function(){var a=this[d];return a&&a.deliver(),this[c]},set:function(b){var e=this[d];if(e)return void e.setValue(b);var f=this[c];return this[c]=b,this.emitPropertyChangeRecord(a,b,f),b},configurable:!0})},createPropertyAccessors:function(a){var b=a._publishNames;if(b&&b.length)for(var c,d=0,e=b.length;e>d&&(c=b[d]);d++)this.createPropertyAccessor(c);var b=a._computedNames;if(b&&b.length)for(var c,d=0,e=b.length;e>d&&(c=b[d]);d++)this.createPropertyAccessor(c)}};a.api.declaration.properties=b}(Polymer),function(a){var b="attributes",c=/\s|,/,d={inheritAttributesObjects:function(a){this.inheritObject(a,"publishLC"),this.inheritObject(a,"_instanceAttributes")},publishAttributes:function(a,d){var e=this.getAttribute(b);if(e)for(var f,g=a.publish||(a.publish={}),h=e.split(c),i=0,j=h.length;j>i;i++)if(f=h[i].trim(),f&&void 0===g[f]){try{var k=void 0!==d[f]}catch(l){k=!1}k||(g[f]=Polymer.nob)}},accumulateInstanceAttributes:function(){for(var a,b=this.prototype._instanceAttributes,c=this.attributes,d=0,e=c.length;e>d&&(a=c[d]);d++)this.isInstanceAttribute(a.name)&&(b[a.name]=a.value)},isInstanceAttribute:function(a){return!this.blackList[a]&&"on-"!==a.slice(0,3)},blackList:{name:1,"extends":1,constructor:1,noscript:1,assetpath:1,"cache-csstext":1}};d.blackList[b]=1,a.api.declaration.attributes=d}(Polymer),function(a){var b=a.api.declaration.events,c=new PolymerExpressions,d=c.prepareBinding;c.prepareBinding=function(a,e,f){return b.prepareEventBinding(a,e,f)||d.call(c,a,e,f)};var e={syntax:c,fetchTemplate:function(){return this.querySelector("template")},templateContent:function(){var a=this.fetchTemplate();return a&&Platform.templateContent(a)},installBindingDelegate:function(a){a&&(a.bindingDelegate=this.syntax)}};a.api.declaration.mdv=e}(Polymer),function(a){function b(a){if(!Object.__proto__){var b=Object.getPrototypeOf(a);a.__proto__=b,d(b)&&(b.__proto__=Object.getPrototypeOf(b))}}var c=a.api,d=a.isBase,e=a.extend,f={register:function(a,b){this.buildPrototype(a,b),this.registerPrototype(a,b),this.publishConstructor()},buildPrototype:function(b,c){var d=a.getRegisteredPrototype(b),e=this.generateBasePrototype(c);this.desugarBeforeChaining(d,e),this.prototype=this.chainPrototypes(d,e),this.desugarAfterChaining(b,c)},desugarBeforeChaining:function(a,b){a.element=this,this.publishAttributes(a,b),this.publishProperties(a,b),this.inferObservers(a),this.explodeObservers(a)},chainPrototypes:function(a,c){this.inheritMetaData(a,c);var d=this.chainObject(a,c);return b(d),d},inheritMetaData:function(a,b){this.inheritObject("observe",a,b),this.inheritObject("publish",a,b),this.inheritObject("reflect",a,b),this.inheritObject("_publishLC",a,b),this.inheritObject("_instanceAttributes",a,b),this.inheritObject("eventDelegates",a,b)},desugarAfterChaining:function(a,b){this.optimizePropertyMaps(this.prototype),this.createPropertyAccessors(this.prototype),this.installBindingDelegate(this.fetchTemplate()),this.installSheets(),this.resolveElementPaths(this),this.accumulateInstanceAttributes(),this.parseHostEvents(),this.addResolvePathApi(),window.ShadowDOMPolyfill&&Platform.ShadowCSS.shimStyling(this.templateContent(),a,b),this.prototype.registerCallback&&this.prototype.registerCallback(this)},publishConstructor:function(){var a=this.getAttribute("constructor");a&&(window[a]=this.ctor)},generateBasePrototype:function(a){var b=this.findBasePrototype(a);if(!b){var b=HTMLElement.getPrototypeForTag(a);b=this.ensureBaseApi(b),g[a]=b}return b},findBasePrototype:function(a){return g[a]},ensureBaseApi:function(a){if(a.PolymerBase)return a;var b=Object.create(a);return c.publish(c.instance,b),this.mixinMethod(b,a,c.instance.mdv,"bind"),b},mixinMethod:function(a,b,c,d){var e=function(a){return b[d].apply(this,a)};a[d]=function(){return this.mixinSuper=e,c[d].apply(this,arguments)}},inheritObject:function(a,b,c){var d=b[a]||{};b[a]=this.chainObject(d,c[a])},registerPrototype:function(a,b){var c={prototype:this.prototype},d=this.findTypeExtension(b);d&&(c.extends=d),HTMLElement.register(a,this.prototype),this.ctor=document.registerElement(a,c)},findTypeExtension:function(a){if(a&&a.indexOf("-")<0)return a;var b=this.findBasePrototype(a);return b.element?this.findTypeExtension(b.element.extends):void 0}},g={};f.chainObject=Object.__proto__?function(a,b){return a&&b&&a!==b&&(a.__proto__=b),a}:function(a,b){if(a&&b&&a!==b){var c=Object.create(b);a=e(c,a)}return a},c.declaration.prototype=f}(Polymer),function(a){function b(a){return document.contains(a)?h:g}function c(){return g.length?g[0]:h[0]}function d(a){e.waitToReady=!0,CustomElements.ready=!1,HTMLImports.whenImportsReady(function(){e.addReadyCallback(a),e.waitToReady=!1,e.check()})}var e={wait:function(a,b,c){var d=-1===this.indexOf(a)&&-1===f.indexOf(a);return d&&(this.add(a),a.__check=b,a.__go=c),0!==this.indexOf(a)},add:function(a){b(a).push(a)},indexOf:function(a){var c=b(a).indexOf(a);return c>=0&&document.contains(a)&&(c+=HTMLImports.useNative||HTMLImports.ready?g.length:1e9),c},go:function(a){var b=this.remove(a);b&&(this.addToFlushQueue(b),this.check())},remove:function(a){var c=this.indexOf(a);if(0===c)return b(a).shift()},check:function(){var a=this.nextElement();return a&&a.__check.call(a),this.canReady()?(this.ready(),!0):void 0},nextElement:function(){return c()},canReady:function(){return!this.waitToReady&&this.isEmpty()},isEmpty:function(){return!g.length&&!h.length},addToFlushQueue:function(a){f.push(a)},flush:function(){for(var a;f.length;)a=f.shift(),a.__go.call(a),a.__check=a.__go=null},ready:function(){this.flush(),CustomElements.ready===!1&&(CustomElements.upgradeDocumentTree(document),CustomElements.ready=!0),Platform.flush(),requestAnimationFrame(this.flushReadyCallbacks)
},addReadyCallback:function(a){a&&i.push(a)},flushReadyCallbacks:function(){if(i)for(var a;i.length;)(a=i.shift())()},waitToReady:!0},f=[],g=[],h=[],i=[];document.addEventListener("WebComponentsReady",function(){CustomElements.ready=!1}),a.queue=e,a.whenReady=a.whenPolymerReady=d}(Polymer),function(a){function b(a,b){a?(document.head.appendChild(a),d(b)):b&&b()}function c(a,c){if(a&&a.length){for(var d,e,f=document.createDocumentFragment(),g=0,h=a.length;h>g&&(d=a[g]);g++)e=document.createElement("link"),e.rel="import",e.href=d,f.appendChild(e);b(f,c)}else c&&c()}var d=a.whenPolymerReady;a.import=c,a.importElements=b}(Polymer),function(a){function b(a){return Boolean(HTMLElement.getPrototypeForTag(a))}function c(a){return a&&a.indexOf("-")>=0}var d=a.extend,e=a.api,f=a.queue,g=a.whenPolymerReady,h=a.getRegisteredPrototype,i=a.waitingForPrototype,j=d(Object.create(HTMLElement.prototype),{createdCallback:function(){this.getAttribute("name")&&this.init()},init:function(){this.name=this.getAttribute("name"),this.extends=this.getAttribute("extends"),this.loadResources(),this.registerWhenReady()},registerWhenReady:function(){this.registered||this.waitingForPrototype(this.name)||this.waitingForQueue()||this.waitingForResources()||f.go(this)},_register:function(){c(this.extends)&&!b(this.extends)&&console.warn("%s is attempting to extend %s, an unregistered element or one that was not registered with Polymer.",this.name,this.extends),this.register(this.name,this.extends),this.registered=!0},waitingForPrototype:function(a){return h(a)?void 0:(i(a,this),this.handleNoScript(a),!0)},handleNoScript:function(a){if(this.hasAttribute("noscript")&&!this.noscript)if(this.noscript=!0,window.CustomElements&&!CustomElements.useNative)Polymer(a);else{var b=document.createElement("script");b.textContent="Polymer('"+a+"');",this.appendChild(b)}},waitingForResources:function(){return this._needsResources},waitingForQueue:function(){return f.wait(this,this.registerWhenReady,this._register)},loadResources:function(){this._needsResources=!0,this.loadStyles(function(){this._needsResources=!1,this.registerWhenReady()}.bind(this))}});e.publish(e.declaration,j),g(function(){document.body.removeAttribute("unresolved"),document.dispatchEvent(new CustomEvent("polymer-ready",{bubbles:!0}))}),document.registerElement("polymer-element",{prototype:j})}(Polymer),function(){var a=document.createElement("polymer-element");a.setAttribute("name","auto-binding"),a.setAttribute("extends","template"),a.init(),Polymer("auto-binding",{createdCallback:function(){this.syntax=this.bindingDelegate=this.makeSyntax(),Polymer.whenPolymerReady(function(){this.model=this,this.setAttribute("bind",""),this.async(function(){this.marshalNodeReferences(this.parentNode),this.fire("template-bound")})}.bind(this))},makeSyntax:function(){var a=Object.create(Polymer.api.declaration.events),b=this;a.findController=function(){return b.model};var c=new PolymerExpressions,d=c.prepareBinding;return c.prepareBinding=function(b,e,f){return a.prepareEventBinding(b,e,f)||d.call(c,b,e,f)},c}})}();
//# sourceMappingURL=polymer.js.map;

    Polymer('core-selection', {
      /**
       * If true, multiple selections are allowed.
       *
       * @attribute multi
       * @type boolean
       * @default false
       */
      multi: false,
      ready: function() {
        this.clear();
      },
      clear: function() {
        this.selection = [];
      },
      /**
       * Retrieves the selected item(s).
       * @method getSelection
       * @returns Returns the selected item(s). If the multi property is true,
       * getSelection will return an array, otherwise it will return 
       * the selected item or undefined if there is no selection.
      */
      getSelection: function() {
        return this.multi ? this.selection : this.selection[0];
      },
      /**
       * Indicates if a given item is selected.
       * @method isSelected
       * @param {any} item The item whose selection state should be checked.
       * @returns Returns true if `item` is selected.
      */
      isSelected: function(item) {
        return this.selection.indexOf(item) >= 0;
      },
      setItemSelected: function(item, isSelected) {
        if (item !== undefined && item !== null) {
          if (isSelected) {
            this.selection.push(item);
          } else {
            var i = this.selection.indexOf(item);
            if (i >= 0) {
              this.selection.splice(i, 1);
            }
          }
          this.fire("core-select", {isSelected: isSelected, item: item});
        }
      },
      /**
       * Set the selection state for a given `item`. If the multi property
       * is true, then the selected state of `item` will be toggled; otherwise
       * the `item` will be selected.
       * @method select
       * @param {any} item: The item to select.
      */
      select: function(item) {
        if (this.multi) {
          this.toggle(item);
        } else if (this.getSelection() !== item) {
          this.setItemSelected(this.getSelection(), false);
          this.setItemSelected(item, true);
        }
      },
      /**
       * Toggles the selection state for `item`.
       * @method toggle
       * @param {any} item: The item to toggle.
      */
      toggle: function(item) {
        this.setItemSelected(item, !this.isSelected(item));
      }
    });
  ;


    Polymer('core-selector', {

      /**
       * Gets or sets the selected element.  Default to use the index
       * of the item element.
       *
       * If you want a specific attribute value of the element to be
       * used instead of index, set "valueattr" to that attribute name.
       *
       * Example:
       *
       *     <core-selector valueattr="label" selected="foo">
       *       <div label="foo"></div>
       *       <div label="bar"></div>
       *       <div label="zot"></div>
       *     </core-selector>
       *
       * In multi-selection this should be an array of values.
       *
       * Example:
       *
       *     <core-selector id="selector" valueattr="label" multi>
       *       <div label="foo"></div>
       *       <div label="bar"></div>
       *       <div label="zot"></div>
       *     </core-selector>
       *
       *     this.$.selector.selected = ['foo', 'zot'];
       *
       * @attribute selected
       * @type Object
       * @default null
       */
      selected: null,

      /**
       * If true, multiple selections are allowed.
       *
       * @attribute multi
       * @type boolean
       * @default false
       */
      multi: false,

      /**
       * Specifies the attribute to be used for "selected" attribute.
       *
       * @attribute valueattr
       * @type string
       * @default 'name'
       */
      valueattr: 'name',

      /**
       * Specifies the CSS class to be used to add to the selected element.
       * 
       * @attribute selectedClass
       * @type string
       * @default 'core-selected'
       */
      selectedClass: 'core-selected',

      /**
       * Specifies the property to be used to set on the selected element
       * to indicate its active state.
       *
       * @attribute selectedProperty
       * @type string
       * @default ''
       */
      selectedProperty: '',

      /**
       * Specifies the property to be used to set on the selected element
       * to indicate its active state.
       *
       * @attribute selectedProperty
       * @type string
       * @default 'active'
       */
      selectedAttribute: 'active',

      /**
       * Returns the currently selected element. In multi-selection this returns
       * an array of selected elements.
       * 
       * @attribute selectedItem
       * @type Object
       * @default null
       */
      selectedItem: null,

      /**
       * In single selection, this returns the model associated with the
       * selected element.
       * 
       * @attribute selectedModel
       * @type Object
       * @default null
       */
      selectedModel: null,

      /**
       * In single selection, this returns the selected index.
       *
       * @attribute selectedIndex
       * @type number
       * @default -1
       */
      selectedIndex: -1,

      /**
       * The target element that contains items.  If this is not set 
       * core-selector is the container.
       * 
       * @attribute target
       * @type Object
       * @default null
       */
      target: null,

      /**
       * This can be used to query nodes from the target node to be used for 
       * selection items.  Note this only works if the 'target' property is set.
       *
       * Example:
       *
       *     <core-selector target="{{$.myForm}}" itemsSelector="input[type=radio]"></core-selector>
       *     <form id="myForm">
       *       <label><input type="radio" name="color" value="red"> Red</label> <br>
       *       <label><input type="radio" name="color" value="green"> Green</label> <br>
       *       <label><input type="radio" name="color" value="blue"> Blue</label> <br>
       *       <p>color = {{color}}</p>
       *     </form>
       * 
       * @attribute itemSelector
       * @type string
       * @default ''
       */
      itemsSelector: '',

      /**
       * The event that would be fired from the item element to indicate
       * it is being selected.
       *
       * @attribute activateEvent
       * @type string
       * @default 'tap'
       */
      activateEvent: 'tap',

      /**
       * Set this to true to disallow changing the selection via the
       * `activateEvent`.
       *
       * @attribute notap
       * @type boolean
       * @default false
       */
      notap: false,

      ready: function() {
        this.activateListener = this.activateHandler.bind(this);
        this.observer = new MutationObserver(this.updateSelected.bind(this));
        if (!this.target) {
          this.target = this;
        }
      },

      get items() {
        if (!this.target) {
          return [];
        }
        var nodes = this.target !== this ? (this.itemsSelector ? 
            this.target.querySelectorAll(this.itemsSelector) : 
                this.target.children) : this.$.items.getDistributedNodes();
        return Array.prototype.filter.call(nodes || [], function(n) {
          return n && n.localName !== 'template';
        });
      },

      targetChanged: function(old) {
        if (old) {
          this.removeListener(old);
          this.observer.disconnect();
          this.clearSelection();
        }
        if (this.target) {
          this.addListener(this.target);
          this.observer.observe(this.target, {childList: true});
          this.updateSelected();
        }
      },

      addListener: function(node) {
        node.addEventListener(this.activateEvent, this.activateListener);
      },

      removeListener: function(node) {
        node.removeEventListener(this.activateEvent, this.activateListener);
      },

      get selection() {
        return this.$.selection.getSelection();
      },

      selectedChanged: function() {
        this.updateSelected();
      },

      updateSelected: function() {
        this.validateSelected();
        if (this.multi) {
          this.clearSelection();
          this.selected && this.selected.forEach(function(s) {
            this.valueToSelection(s);
          }, this);
        } else {
          this.valueToSelection(this.selected);
        }
      },

      validateSelected: function() {
        // convert to an array for multi-selection
        if (this.multi && !Array.isArray(this.selected) && 
            this.selected !== null && this.selected !== undefined) {
          this.selected = [this.selected];
        }
      },

      clearSelection: function() {
        if (this.multi) {
          this.selection.slice().forEach(function(s) {
            this.$.selection.setItemSelected(s, false);
          }, this);
        } else {
          this.$.selection.setItemSelected(this.selection, false);
        }
        this.selectedItem = null;
        this.$.selection.clear();
      },

      valueToSelection: function(value) {
        var item = (value === null || value === undefined) ? 
            null : this.items[this.valueToIndex(value)];
        this.$.selection.select(item);
      },

      updateSelectedItem: function() {
        this.selectedItem = this.selection;
      },

      selectedItemChanged: function() {
        if (this.selectedItem) {
          var t = this.selectedItem.templateInstance;
          this.selectedModel = t ? t.model : undefined;
        } else {
          this.selectedModel = null;
        }
        this.selectedIndex = this.selectedItem ? 
            parseInt(this.valueToIndex(this.selected)) : -1;
      },

      valueToIndex: function(value) {
        // find an item with value == value and return it's index
        for (var i=0, items=this.items, c; (c=items[i]); i++) {
          if (this.valueForNode(c) == value) {
            return i;
          }
        }
        // if no item found, the value itself is probably the index
        return value;
      },

      valueForNode: function(node) {
        return node[this.valueattr] || node.getAttribute(this.valueattr);
      },

      // events fired from <core-selection> object
      selectionSelect: function(e, detail) {
        this.updateSelectedItem();
        if (detail.item) {
          this.applySelection(detail.item, detail.isSelected);
        }
      },

      applySelection: function(item, isSelected) {
        if (this.selectedClass) {
          item.classList.toggle(this.selectedClass, isSelected);
        }
        if (this.selectedProperty) {
          item[this.selectedProperty] = isSelected;
        }
        if (this.selectedAttribute && item.setAttribute) {
          if (isSelected) {
            item.setAttribute(this.selectedAttribute, '');
          } else {
            item.removeAttribute(this.selectedAttribute);
          }
        }
      },

      // event fired from host
      activateHandler: function(e) {
        if (!this.notap) {
          var i = this.findDistributedTarget(e.target, this.items);
          if (i >= 0) {
            var item = this.items[i];
            var s = this.valueForNode(item) || i;
            if (this.multi) {
              if (this.selected) {
                this.addRemoveSelected(s);
              } else {
                this.selected = [s];
              }
            } else {
              this.selected = s;
            }
            this.asyncFire('core-activate', {item: item});
          }
        }
      },

      addRemoveSelected: function(value) {
        var i = this.selected.indexOf(value);
        if (i >= 0) {
          this.selected.splice(i, 1);
        } else {
          this.selected.push(value);
        }
        this.valueToSelection(value);
      },

      findDistributedTarget: function(target, nodes) {
        // find first ancestor of target (including itself) that
        // is in nodes, if any
        while (target && target != this) {
          var i = Array.prototype.indexOf.call(nodes, target);
          if (i >= 0) {
            return i;
          }
          target = target.parentNode;
        }
      }
    });
  ;
Polymer('core-pages', {});


  Polymer('core-header-panel', {

    publish: {
      /**
       * Controls header and scrolling behavior. Options are
       * `standard`, `seamed`, `waterfall`, `waterfall-tall`, 
       * `waterfall-medium-tall`, `scroll` and `cover`.
       * Default is `standard`.
       *
       * `standard`: The header is a step above the panel. The header will consume the 
       * panel at the point of entry, preventing it from passing through to the 
       * opposite side.
       *
       * `seamed`: The header is presented as seamed with the panel.
       *
       * `waterfall`: Similar to standard mode, but header is initially presented as 
       * seamed with panel, but then separates to form the step.
       *
       * `waterfall-tall`: The header is initially taller (`tall` class is added to 
       * the header).  As the user scrolls, the header separates (forming an edge)
       * while condensing (`tall` class is removed from the header).
       *
       * `scroll`: The header keeps its seam with the panel, and is pushed off screen.
       *
       * `cover`: The panel covers the whole `core-header-panel` including the
       * header. This allows user to style the panel in such a way that the panel is
       * partially covering the header.
       *
       *     <style>
       *       core-header-panel[mode=cover]::shadow #mainContainer {
       *         left: 80px;
       *       }
       *       .content {
       *         margin: 60px 60px 60px 0;
       *       }
       *     </style>
       * 
       *     <core-header-panel mode="cover">
       *       <core-appbar class="tall">
       *         <core-icon-button icon="menu"></core-icon-button>
       *       </core-appbar>
       *       <div class="content"></div>
       *     </core-header-panel>
       *
       * @attribute mode
       * @type string
       * @default ''
       */
      mode: {value: '', reflect: true},
      
      /**
       * The class used in waterfall-tall mode.  Change this if the header
       * accepts a different class for toggling height, e.g. "medium-tall"
       *
       * @attribute tallClass
       * @type string
       * @default 'tall'
       */
      tallClass: 'tall',
      
      /**
       * If true, the drop-shadow is always shown no matter what mode is set to.
       *
       * @attribute shadow
       * @type boolean
       * @default false
       */
      shadow: false,
    },
    
    domReady: function() {
      this.async('scroll');
    },

    modeChanged: function() {
      this.scroll();
    },

    get header() {
      return this.$.headerContent.getDistributedNodes()[0];
    },
    
    scroll: function() {
      var shadowMode = {'waterfall': 1, 'waterfall-tall': 1};
      var noShadow = {'seamed': 1, 'cover': 1, 'scroll': 1};
      var tallMode = {'waterfall-tall': 1};
      
      var main = this.$.mainContainer;
      var header = this.header;
      
      var sTop = main.scrollTop;
      var atTop = sTop === 0;
      
      if (header) {
        this.$.dropShadow.classList.toggle('hidden', !this.shadow &&
            (atTop && shadowMode[this.mode] || noShadow[this.mode]));
        
        if (tallMode[this.mode]) {
          header.classList.toggle(this.tallClass, atTop);
        }
        
        header.classList.toggle('animate', tallMode[this.mode]);
      }
    }

  });

;
Polymer('core-toolbar', {});


  (function() {
    
    var SKIP_ID = 'meta';
    var metaData = {}, metaArray = {};

    Polymer('core-meta', {
      
      /**
       * The type of meta-data.  All meta-data with the same type with be
       * stored together.
       * 
       * @attribute type
       * @type string
       * @default 'default'
       */
      type: 'default',
      
      alwaysPrepare: true,
      
      ready: function() {
        this.register(this.id);
      },
      
      get metaArray() {
        var t = this.type;
        if (!metaArray[t]) {
          metaArray[t] = [];
        }
        return metaArray[t];
      },
      
      get metaData() {
        var t = this.type;
        if (!metaData[t]) {
          metaData[t] = {};
        }
        return metaData[t];
      },
      
      register: function(id, old) {
        if (id && id !== SKIP_ID) {
          this.unregister(this, old);
          this.metaData[id] = this;
          this.metaArray.push(this);
        }
      },
      
      unregister: function(meta, id) {
        delete this.metaData[id || meta.id];
        var i = this.metaArray.indexOf(meta);
        if (i >= 0) {
          this.metaArray.splice(i, 1);
        }
      },
      
      /**
       * Returns a list of all meta-data elements with the same type.
       * 
       * @attribute list
       * @type array
       * @default []
       */
      get list() {
        return this.metaArray;
      },
      
      /**
       * Retrieves meta-data by ID.
       *
       * @method byId
       * @param {String} id The ID of the meta-data to be returned.
       * @returns Returns meta-data.
       */
      byId: function(id) {
        return this.metaData[id];
      }
      
    });
    
  })();
  
;

  
    Polymer('core-iconset', {
  
      /**
       * The URL of the iconset image.
       *
       * @attribute src
       * @type string
       * @default ''
       */
      src: '',

      /**
       * The width of the iconset image. This must only be specified if the
       * icons are arranged into separate rows inside the image.
       *
       * @attribute width
       * @type string
       * @default ''
       */
      width: 0,

      /**
       * A space separated list of names corresponding to icons in the iconset
       * image file. This list must be ordered the same as the icon images
       * in the image file.
       *
       * @attribute icons
       * @type string
       * @default ''
       */
      icons: '',

      /**
       * The size of an individual icon. Note that icons must be square.
       *
       * @attribute iconSize
       * @type number
       * @default 24
       */
      iconSize: 24,

      /**
       * The horizontal offset of the icon images in the inconset src image.
       * This is typically used if the image resource contains additional images
       * beside those intended for the iconset.
       *
       * @attribute offsetX
       * @type number
       * @default 0
       */
      offsetX: 0,
      /**
       * The vertical offset of the icon images in the inconset src image.
       * This is typically used if the image resource contains additional images
       * beside those intended for the iconset.
       *
       * @attribute offsetY
       * @type number
       * @default 0
       */
      offsetY: 0,
      type: 'iconset',

      created: function() {
        this.iconMap = {};
        this.iconNames = [];
        this.themes = {};
      },
  
      ready: function() {
        // TODO(sorvell): ensure iconset's src is always relative to the main
        // document
        if (this.src && (this.ownerDocument !== document)) {
          this.src = this.resolvePath(this.src, this.ownerDocument.baseURI);
        }
        this.super();
        this.updateThemes();
      },

      iconsChanged: function() {
        var ox = this.offsetX;
        var oy = this.offsetY;
        this.icons && this.icons.split(/\s+/g).forEach(function(name, i) {
          this.iconNames.push(name);
          this.iconMap[name] = {
            offsetX: ox,
            offsetY: oy
          }
          if (ox + this.iconSize < this.width) {
            ox += this.iconSize;
          } else {
            ox = this.offsetX;
            oy += this.iconSize;
          }
        }, this);
      },

      updateThemes: function() {
        var ts = this.querySelectorAll('property[theme]');
        ts && ts.array().forEach(function(t) {
          this.themes[t.getAttribute('theme')] = {
            offsetX: parseInt(t.getAttribute('offsetX')) || 0,
            offsetY: parseInt(t.getAttribute('offsetY')) || 0
          };
        }, this);
      },

      // TODO(ffu): support retrived by index e.g. getOffset(10);
      /**
       * Returns an object containing `offsetX` and `offsetY` properties which
       * specify the pixel locaion in the iconset's src file for the given
       * `icon` and `theme`. It's uncommon to call this method. It is useful,
       * for example, to manually position a css backgroundImage to the proper
       * offset. It's more common to use the `applyIcon` method.
       *
       * @method getOffset
       * @param {String|Number} icon The name of the icon or the index of the
       * icon within in the icon image.
       * @param {String} theme The name of the theme.
       * @returns {Object} An object specifying the offset of the given icon 
       * within the icon resource file; `offsetX` is the horizontal offset and
       * `offsetY` is the vertical offset. Both values are in pixel units.
       */
      getOffset: function(icon, theme) {
        var i = this.iconMap[icon];
        if (!i) {
          var n = this.iconNames[Number(icon)];
          i = this.iconMap[n];
        }
        var t = this.themes[theme];
        if (i && t) {
          return {
            offsetX: i.offsetX + t.offsetX,
            offsetY: i.offsetY + t.offsetY
          }
        }
        return i;
      },

      /**
       * Applies an icon to the given element as a css background image. This
       * method does not size the element, and it's often necessary to set 
       * the element's height and width so that the background image is visible.
       *
       * @method applyIcon
       * @param {Element} element The element to which the background is
       * applied.
       * @param {String|Number} icon The name or index of the icon to apply.
       * @param {String} theme (optional) The name of the theme for the icon.
       * @param {Number} scale (optional, defaults to 1) A scaling factor 
       * with which the icon can be magnified.
       */
      applyIcon: function(element, icon, scale) {
         var offset = this.getOffset(icon);
         scale = scale || 1;
         if (element && offset) {
           var style = element.style;
           style.backgroundImage = 'url(' + this.src + ')';
           style.backgroundPosition = (-offset.offsetX * scale + 'px') + 
              ' ' + (-offset.offsetY * scale + 'px');
           style.backgroundSize = scale === 1 ? 'auto' :
              this.width * scale + 'px';
         }
      }

    });

  ;

(function() {
  
  // mono-state
  var meta;
  
  Polymer('core-icon', {

    /**
     * The URL of an image for the icon. If the src property is specified,
     * the icon property should not be.
     *
     * @attribute src
     * @type string
     * @default ''
     */
    src: '',

    /**
     * Specifies the size of the icon in pixel units.
     *
     * @attribute size
     * @type string
     * @default 24
     */
    size: 24,

    /**
     * Specifies the icon name or index in the set of icons available in
     * the icon's icon set. If the icon property is specified,
     * the src property should not be.
     *
     * @attribute icon
     * @type string
     * @default ''
     */
    icon: '',

    observe: {
      'size icon': 'updateIcon'
    },

    defaultIconset: 'icons',

    ready: function() {
      if (!meta) {
        meta = document.createElement('core-iconset');
      }
      this.updateIcon();
    },

    srcChanged: function() {
      this.style.backgroundImage = 'url(' + this.src + ')';
      this.style.backgroundPosition = 'center';
      this.style.backgroundSize = this.size + 'px ' + this.size + 'px';
    },

    getIconset: function(name) {
      return meta.byId(name || this.defaultIconset);
    },

    updateIcon: function() {
      if (this.size) {
        this.style.width = this.style.height = this.size + 'px';
      }
      if (this.icon) {
        var parts = String(this.icon).split(':');
        var icon = parts.pop();
        if (icon) {
          var set = this.getIconset(parts.pop());
          if (set) {
            set.applyIcon(this, icon, this.size / set.iconSize);
          }
        }
      }
    }

  });
  
})();
;


    Polymer('core-iconset-svg', {


      /**
       * The size of an individual icon. Note that icons must be square.
       *
       * @attribute iconSize
       * @type number
       * @default 24
       */
      iconSize: 24,
      type: 'iconset',

      created: function() {
        this._icons = {};
      },

      ready: function() {
        this.super();
        this.updateIcons();
      },

      iconById: function(id) {
        return this._icons[id] || (this._icons[id] = this.querySelector('#' + id));
      },

      cloneIcon: function(id) {
        var icon = this.iconById(id);
        if (icon) {
          var content = icon.cloneNode(true);
          var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          svg.setAttribute('viewBox', '0 0 ' + this.iconSize + ' ' +
              this.iconSize);
          // NOTE(dfreedm): work around https://crbug.com/370136
          svg.style.pointerEvents = 'none';
          svg.appendChild(content);
          return svg;
        }
      },

      get iconNames() {
        if (!this._iconNames) {
          this._iconNames = this.findIconNames();
        }
        return this._iconNames;
      },

      findIconNames: function() {
        var icons = this.querySelectorAll('[id]').array();
        if (icons.length) {
          return icons.map(function(n){ return n.id });
        }
      },

      /**
       * Applies an icon to the given element. The svg icon is added to the
       * element's shadowRoot if one exists or directly to itself.
       *
       * @method applyIcon
       * @param {Element} element The element to which the icon is
       * applied.
       * @param {String|Number} icon The name the icon to apply.
       */
      applyIcon: function(element, icon, scale) {
        var root = element.shadowRoot || element;
        // remove old
        var old = root.querySelector('svg');
        if (old) {
          old.remove();
        }
        // install new
        var svg = this.cloneIcon(icon);
        if (!svg) {
          return;
        }
        var size = scale * this.iconSize;
        if (size) {
          svg.style.height = svg.style.width = size + 'px';
        } else {
          svg.setAttribute('height', '100%');
          svg.setAttribute('width', '100%');
          svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        }
        svg.style.display = 'block';
        root.insertBefore(svg, root.firstElementChild);
      },
      
      /**
       * Tell users of the iconset, that the set has loaded.
       * This finds all elements matching the selector argument and calls 
       * the method argument on them.
       * @method updateIcons
       * @param selector {string} css selector to identify iconset users, 
       * defaults to '[icon]'
       * @param method {string} method to call on found elements, 
       * defaults to 'updateIcon'
       */
      updateIcons: function(selector, method) {
        selector = selector || '[icon]';
        method = method || 'updateIcon';
        var deep = window.ShadowDOMPolyfill ? '' : 'html /deep/ ';
        var i$ = document.querySelectorAll(deep + selector);
        for (var i=0, e; e=i$[i]; i++) {
          if (e[method]) {
            e[method].call(e);
          }
        }
      }
      

    });

  ;


    Polymer('core-icon-button', {

      /**
       * The URL of an image for the icon.  Should not use `icon` property
       * if you are using this property.
       *
       * @attribute src
       * @type string
       * @default ''
       */
      src: '',

      /**
       * If true, border is placed around the button to indicate it's
       * active state.
       *
       * @attribute active
       * @type boolean
       * @default false
       */
      active: false,

      /**
       * Specifies the icon name or index in the set of icons available in
       * the icon set.  Should not use `src` property if you are using this
       * property.
       *
       * @attribute icon
       * @type string
       * @default ''
       */
      icon: '',

      activeChanged: function() {
        this.classList.toggle('selected', this.active);
      }

    });

  ;


  Polymer('core-item', {
    
    /**
     * The URL of an image for the icon.
     *
     * @attribute src
     * @type string
     * @default ''
     */

    /**
     * Specifies the icon from the Polymer icon set.
     *
     * @attribute icon
     * @type string
     * @default ''
     */

    /**
     * Specifies the label for the menu item.
     *
     * @attribute label
     * @type string
     * @default ''
     */

  });

;


    Polymer('core-input', {

      /**
       * Placeholder text that hints to the user what can be entered in
       * the input.
       *
       * @attribute placeholder
       * @type string
       * @default ''
       */
      placeholder: '',

      /**
       * If true, this input cannot be focused and the user cannot change
       * its value.
       *
       * @attribute disabled
       * @type boolean
       * @default false
       */
      disabled: false,

      /**
       * If true, this input accepts multi-line input like a `<textarea>`
       *
       * @attribute multiline
       * @type boolean
       * @default false
       */
      multiline: false,

      /**
       * (multiline only) The height of this text input in rows. The input
       * will scroll internally if more input is entered beyond the size
       * of the component. This property is meaningless if multiline is
       * false. You can also set this property to "fit" and size the
       * component with CSS to make the input fit the CSS size.
       *
       * @attribute rows
       * @type number|'fit'
       * @default 'fit'
       */
      rows: 'fit',

      /**
       * The current value of this input.
       *
       * @attribute inputValue
       * @type string
       * @default ''
       */
      inputValue: '',

      /**
       * The value of the input committed by the user, either by changing the
       * inputValue and blurring the input, or by hitting the `enter` key.
       *
       * @attribute value
       * @type string
       * @default ''
       */
      value: '',

      /**
       * If this property is not null, the text input's inputValue will be
       * validated. You can validate the value with either a regular expression
       * or a custom function.
       *
       * To use a regular expression, set this property to a RegExp object or
       * a string containing the regular expression to match against. To use a
       * custom validator, set this property to a function with the signature
       * function(value) that returns a boolean. The input is valid if the
       * function returns true.
       *
       * Example:
       *
       *     // valid only if the value is a number
       *     <core-input validate="^[0-9]*$"></core-input> 
       * 
       *     // valid only if the value is a number
       *     this.$.input.validate = /^[0-9]*$/;
       *
       *     this.$.input2.validate = function(value) {
       *         // valid only if the value is 'foo'
       *         return value === 'foo';  
       *     }
       *
       * @attribute validate
       * @type string|RegExp|Function(value)
       * @default null
       */
      validate: null,

      /**
       * If this property is true, the text input's inputValue failed validation.
       *
       * @attribute invalid
       * @type boolean
       * @default false
       */
      invalid: false,

      validateValue: function() {
        var valid = true;
        if (!this.inputValue) {
          valid = true;
        } else if (typeof this.validate === 'string') {
          valid = new RegExp(this.validate).exec(this.inputValue);
        } else if (this.validate.exec) {
          valid = this.validate.exec(this.inputValue);
        } else if (this.validate instanceof Function) {
          valid = this.validate.call(this.inputValue);
        }
        this.invalid = !valid;
      },

      invalidChanged: function() {
        this.classList.toggle('invalid', this.invalid);
        if (this.invalid) {
          this.fire('input-invalid', {value: this.inputValue});
        }
      },

      inputValueChanged: function() {
        if (this.validate) {
          this.validateValue();
        }

        if (!this.inputValue) {
          this.value = '';
        }
      },

      valueChanged: function() {
        this.inputValue = this.value;
      },

      inputChangeAction: function() {
        this.value = this.inputValue;
        if (!window.ShadowDOMPolyfill) {
          // re-fire non-bubbling event
          this.fire('change', null, this, false);
        }
      },

      focusAction: function() {
        // re-fire non-bubbling event
        this.fire('focus', null, this, false);
      },

      blurAction: function() {
        // re-fire non-bubbling event
        this.fire('blur', null, this, false);
      }

    });

    CoreInput = function() {
      return document.createElement('core-input');
    };
    CoreInput.validate = {
      number: /^[0-9]*$/
    };
  ;


    Polymer('paper-input', {

      /**
       * The label for this input. It normally appears as grey text inside
       * the text input and disappears once the user enters text.
       *
       * @attribute label
       * @type string
       * @default ''
       */
      label: '',

      /**
       * If true, the label will "float" above the text input once the
       * user enters text instead of disappearing.
       *
       * @attribute floatingLabel
       * @type boolean
       * @default false
       */
      floatingLabel: false,

      /**
       * (multiline only) If set to a non-zero value, the height of this
       * text input will grow with the value changes until it is maxRows
       * rows tall. If the maximum size does not fit the value, the text
       * input will scroll internally.
       *
       * @attribute maxRows
       * @type number
       * @default 0
       */
      maxRows: 0,

      focused: false,
      pressed: false,

      attached: function() {
        if (this.multiline) {
          this.resizeInput();
          window.requestAnimationFrame(function() {
            this.$.underlineContainer.classList.add('animating');
          }.bind(this));
        }
      },

      resizeInput: function() {
        var height = this.$.inputClone.getBoundingClientRect().height;
        var bounded = this.maxRows > 0 || this.rows > 0;
        if (bounded) {
          var minHeight = this.$.minInputHeight.getBoundingClientRect().height;
          var maxHeight = this.$.maxInputHeight.getBoundingClientRect().height;
          height = Math.max(minHeight, Math.min(height, maxHeight));
        }
        this.$.inputContainer.style.height = height + 'px';
        this.$.underlineContainer.style.top = height + 'px';
      },

      rowsChanged: function() {
        if (this.multiline && !isNaN(parseInt(this.rows))) {
          this.$.minInputHeight.innerHTML = '';
          for (var i = 0; i < this.rows; i++) {
            this.$.minInputHeight.appendChild(document.createElement('br'));
          }
          this.resizeInput();
        }
      },

      maxRowsChanged: function() {
        if (this.multiline && !isNaN(parseInt(this.maxRows))) {
          this.$.maxInputHeight.innerHTML = '';
          for (var i = 0; i < this.maxRows; i++) {
            this.$.maxInputHeight.appendChild(document.createElement('br'));
          }
          this.resizeInput();
        }
      },

      inputValueChanged: function() {
        this.super();

        if (this.multiline) {
          var escaped = this.inputValue.replace(/\n/gm, '<br>');
          if (!escaped || escaped.lastIndexOf('<br>') === escaped.length - 4) {
            escaped += ' ';
          }
          this.$.inputCloneSpan.innerHTML = escaped;
          this.resizeInput();
        }

        if (!this.floatingLabel) {
          this.$.label.classList.toggle('hidden', this.inputValue);
        }

        if (this.floatingLabel && !this.focused) {
          this.$.label.classList.toggle('hidden', this.inputValue);
          this.$.floatedLabel.classList.toggle('hidden', !this.inputValue);
        }
      },

      labelChanged: function() {
        if (this.floatingLabel && this.$.floatedLabel && this.$.label) {
          var toRect = this.$.floatedLabelSpan.getBoundingClientRect();
          var fromRect = this.$.labelSpan.getBoundingClientRect();
          this.$.label.cachedTransform = 'scale(' + (toRect.width / fromRect.width) + ') ' +
            'translateY(' + (toRect.bottom - fromRect.bottom) + 'px)'
        }
      },

      placeholderChanged: function() {
        this.label = this.placeholder;
      },

      focusAction: function(e) {
        if (!this.pressed) {
          if (this.floatingLabel) {
            this.$.floatedLabel.classList.remove('hidden');
            this.$.floatedLabel.classList.add('focused');
            this.$.floatedLabel.classList.add('focusedColor');
          }
          this.$.label.classList.add('hidden');
          this.$.underlineHighlight.classList.add('focused');
          this.$.caret.classList.add('focused');
          this.$.input.focus();
        }
        this.focused = true;
      },

      blurAction: function() {
        this.$.underlineHighlight.classList.remove('focused');
        this.$.caret.classList.remove('focused');
        if (this.floatingLabel) {
          this.$.floatedLabel.classList.remove('focused');
          this.$.floatedLabel.classList.remove('focusedColor');
          if (!this.inputValue) {
            this.$.floatedLabel.classList.add('hidden');
          }
        }
        if (!this.inputValue) {
          this.$.label.classList.remove('hidden');
          this.$.label.classList.add('animating');
          this.async(function() {
            this.$.label.style.webkitTransform = 'none';
          });
        }
        this.focused = false;
      },

      downAction: function(e) {
        if (this.disabled) {
          return;
        }

        if (this.focused) {
          return;
        }

        this.pressed = true;
        var rect = this.$.underline.getBoundingClientRect();
        var right = e.x - rect.left;
        this.$.underlineHighlight.style.webkitTransformOriginX = right + 'px';
        this.$.underlineHighlight.classList.remove('focused');
        this.underlineAsync = this.async(function() {
          this.$.underlineHighlight.classList.add('pressed');
        }, null, 200);

        // No caret animation if there is text in the input.
        if (!this.inputValue) {
          var width = this.$.inputCloneSpan.getBoundingClientRect().width;
          if (width < right) {
            this.$.caret.style.left = width + 'px';
            this.$.caret.classList.remove('focused');
          }
        }
      },

      upAction: function(e) {
        if (this.disabled) {
          return;
        }

        if (!this.pressed) {
          return;
        }

        // if a touchevent caused the up, the synthentic mouseevents will blur
        // the input, make sure to prevent those from being generated.
        if (e._source === 'touch') {
          e.preventDefault();
        }

        if (this.underlineAsync) {
          clearTimeout(this.underlineAsync);
          this.underlineAsync = null;
        }

        // Focus the input here to bring up the virtual keyboard.
        this.$.input.focus();
        this.pressed = false;
        this.animating = true;

        this.$.underlineHighlight.classList.remove('pressed');
        this.$.underlineHighlight.classList.add('animating');
        this.async(function() {
          this.$.underlineHighlight.classList.add('focused');
        });

        // No caret animation if there is text in the input.
        if (!this.inputValue) {
          this.$.caret.classList.add('animating');
          this.async(function() {
            this.$.caret.classList.add('focused');
          }, null, 100);
        }

        if (this.floatingLabel) {
          this.$.label.classList.add('focusedColor');
          this.$.label.classList.add('animating');
          this.$.label.style.webkitTransform = this.$.label.cachedTransform;
        }
      },

      keypressAction: function() {
        if (this.animating) {
          this.transitionEndAction();
        }
      },

      transitionEndAction: function(e) {
        this.animating = false;
        if (this.pressed) {
          return;
        }

        if (this.focused) {

          if (this.floatingLabel || this.inputValue) {
            this.$.label.classList.add('hidden');
          }

          if (this.floatingLabel) {
            this.$.label.classList.remove('focusedColor');
            this.$.label.classList.remove('animating');
            this.$.floatedLabel.classList.remove('hidden');
            this.$.floatedLabel.classList.add('focused');
            this.$.floatedLabel.classList.add('focusedColor');
          }

          this.async(function() {
            this.$.underlineHighlight.classList.remove('animating');
            this.$.caret.classList.remove('animating');
          }, null, 100);

        } else {

          this.$.label.classList.remove('animating');

        }
      }

    });

  ;

    Polymer('paper-focusable', {

      publish: {

        /**
         * If true, the button is currently active either because the
         * user is holding down the button, or the button is a toggle
         * and is currently in the active state.
         *
         * @attribute active
         * @type boolean
         * @default false
         */
        active: {value: false, reflect: true},

        /**
         * If true, the element currently has focus due to keyboard
         * navigation.
         *
         * @attribute focused
         * @type boolean
         * @default false
         */
        focused: {value: false, reflect: true},

        /**
         * If true, the user is currently holding down the button.
         *
         * @attribute pressed
         * @type boolean
         * @default false
         */
        pressed: {value: false, reflect: true},

        /**
         * If true, the user cannot interact with this element.
         *
         * @attribute disabled
         * @type boolean
         * @default false
         */
        disabled: {value: false, reflect: true},

        /**
         * If true, the button toggles the active state with each tap.
         * Otherwise, the button becomes active when the user is holding
         * it down.
         *
         * @attribute isToggle
         * @type boolean
         * @default false
         */
        isToggle: {value: false, reflect: false}

      },

      disabledChanged: function() {
        if (this.disabled) {
          this.removeAttribute('tabindex');
        } else {
          this.setAttribute('tabindex', 0);
        }
      },

      _downAction: function(e) {
        if (this.disabled) {
          return;
        }
        this.downAction(e);
      },

      downAction: function() {
        this.pressed = true;
        this.focused = false;

        if (this.isToggle) {
          this.active = !this.active;
        } else {
          this.active = true;
        }
      },

      _upAction: function(e) {
        if (this.disabled) {
          return;
        }
        this.upAction(e);
      },

      upAction: function() {
        this.pressed = false;

        if (!this.isToggle) {
          this.active = false;
        }
      },

      focusAction: function() {
        if (!this.pressed) {
          // Only render the "focused" state if the element gains focus due to
          // keyboard navigation.
          this.focused = true;
        }
      },

      blurAction: function() {
        this.focused = false;
      }

    });

  ;


  (function() {

    var waveMaxRadius = 150;
    //
    // INK EQUATIONS
    //
    function waveRadiusFn(touchDownMs, touchUpMs, anim) {
      // Convert from ms to s.
      var touchDown = touchDownMs / 1000;
      var touchUp = touchUpMs / 1000;
      var totalElapsed = touchDown + touchUp;
      var ww = anim.width, hh = anim.height;
      // use diagonal size of container to avoid floating point math sadness
      var waveRadius = Math.min(Math.sqrt(ww * ww + hh * hh), waveMaxRadius) * 1.1 + 5;
      var duration = 1.1 - .2 * (waveRadius / waveMaxRadius);
      var tt = (totalElapsed / duration);

      var size = waveRadius * (1 - Math.pow(80, -tt));
      return Math.abs(size);
    }

    function waveOpacityFn(td, tu, anim) {
      // Convert from ms to s.
      var touchDown = td / 1000;
      var touchUp = tu / 1000;
      var totalElapsed = touchDown + touchUp;

      if (tu <= 0) {  // before touch up
        return anim.initialOpacity;
      }
      return Math.max(0, anim.initialOpacity - touchUp * anim.opacityDecayVelocity);
    }

    function waveOuterOpacityFn(td, tu, anim) {
      // Convert from ms to s.
      var touchDown = td / 1000;
      var touchUp = tu / 1000;

      // Linear increase in background opacity, capped at the opacity
      // of the wavefront (waveOpacity).
      var outerOpacity = touchDown * 0.3;
      var waveOpacity = waveOpacityFn(td, tu, anim);
      return Math.max(0, Math.min(outerOpacity, waveOpacity));
    }

    function waveGravityToCenterPercentageFn(td, tu, r) {
      // Convert from ms to s.
      var touchDown = td / 1000;
      var touchUp = tu / 1000;
      var totalElapsed = touchDown + touchUp;

      return Math.min(1.0, touchUp * 6);
    }

    // Determines whether the wave should be completely removed.
    function waveDidFinish(wave, radius, anim) {
      var waveOpacity = waveOpacityFn(wave.tDown, wave.tUp, anim);
      // If the wave opacity is 0 and the radius exceeds the bounds
      // of the element, then this is finished.
      if (waveOpacity < 0.01 && radius >= Math.min(wave.maxRadius, waveMaxRadius)) {
        return true;
      }
      return false;
    };

    function waveAtMaximum(wave, radius, anim) {
      var waveOpacity = waveOpacityFn(wave.tDown, wave.tUp, anim);
      if (waveOpacity >= anim.initialOpacity && radius >= Math.min(wave.maxRadius, waveMaxRadius)) {
        return true;
      }
      return false;
    }

    //
    // DRAWING
    //
    function drawRipple(ctx, x, y, radius, innerColor, outerColor) {
      if (outerColor) {
        ctx.fillStyle = outerColor;
        ctx.fillRect(0,0,ctx.canvas.width, ctx.canvas.height);
      }
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
      ctx.fillStyle = innerColor;
      ctx.fill();
    }

    //
    // SETUP
    //
    function createWave(elem) {
      var elementStyle = window.getComputedStyle(elem);
      var fgColor = elementStyle.color;

      var wave = {
        waveColor: fgColor,
        maxRadius: 0,
        isMouseDown: false,
        mouseDownStart: 0.0,
        mouseUpStart: 0.0,
        tDown: 0,
        tUp: 0
      };
      return wave;
    }

    function removeWaveFromScope(scope, wave) {
      if (scope.waves) {
        var pos = scope.waves.indexOf(wave);
        scope.waves.splice(pos, 1);
      }
    };

    // Shortcuts.
    var pow = Math.pow;
    var now = Date.now;
    if (window.performance && performance.now) {
      now = performance.now.bind(performance);
    }

    function cssColorWithAlpha(cssColor, alpha) {
        var parts = cssColor.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        if (typeof alpha == 'undefined') {
            alpha = 1;
        }
        if (!parts) {
          return 'rgba(255, 255, 255, ' + alpha + ')';
        }
        return 'rgba(' + parts[1] + ', ' + parts[2] + ', ' + parts[3] + ', ' + alpha + ')';
    }

    function dist(p1, p2) {
      return Math.sqrt(pow(p1.x - p2.x, 2) + pow(p1.y - p2.y, 2));
    }

    function distanceFromPointToFurthestCorner(point, size) {
      var tl_d = dist(point, {x: 0, y: 0});
      var tr_d = dist(point, {x: size.w, y: 0});
      var bl_d = dist(point, {x: 0, y: size.h});
      var br_d = dist(point, {x: size.w, y: size.h});
      return Math.max(tl_d, tr_d, bl_d, br_d);
    }

    Polymer('paper-ripple', {

      /**
       * The initial opacity set on the wave.
       *
       * @attribute initialOpacity
       * @type number
       * @default 0.25
       */
      initialOpacity: 0.25,

      /**
       * How fast (opacity per second) the wave fades out.
       *
       * @attribute opacityDecayVelocity
       * @type number
       * @default 0.8
       */
      opacityDecayVelocity: 0.8,

      backgroundFill: true,
      pixelDensity: 2,

      eventDelegates: {
        down: 'downAction',
        up: 'upAction'
      },

      attached: function() {
        // create the canvas element manually becase ios
        // does not render the canvas element if it is not created in the
        // main document (component templates are created in a
        // different document). See:
        // https://bugs.webkit.org/show_bug.cgi?id=109073.
        if (!this.$.canvas) {
          var canvas = document.createElement('canvas');
          canvas.id = 'canvas';
          this.shadowRoot.appendChild(canvas);
          this.$.canvas = canvas;
        }
      },

      ready: function() {
        this.waves = [];
      },

      setupCanvas: function() {
        this.$.canvas.setAttribute('width', this.$.canvas.clientWidth * this.pixelDensity + "px");
        this.$.canvas.setAttribute('height', this.$.canvas.clientHeight * this.pixelDensity + "px");
        var ctx = this.$.canvas.getContext('2d');
        ctx.scale(this.pixelDensity, this.pixelDensity);
        if (!this._loop) {
          this._loop = this.animate.bind(this, ctx);
        }
      },

      downAction: function(e) {
        this.setupCanvas();
        var wave = createWave(this.$.canvas);

        this.cancelled = false;
        wave.isMouseDown = true;
        wave.tDown = 0.0;
        wave.tUp = 0.0;
        wave.mouseUpStart = 0.0;
        wave.mouseDownStart = now();

        var width = this.$.canvas.width / 2; // Retina canvas
        var height = this.$.canvas.height / 2;
        var rect = this.getBoundingClientRect();
        var touchX = e.x - rect.left;
        var touchY = e.y - rect.top;

        wave.startPosition = {x:touchX, y:touchY};

        if (this.classList.contains("recenteringTouch")) {
          wave.endPosition = {x: width / 2,  y: height / 2};
          wave.slideDistance = dist(wave.startPosition, wave.endPosition);
        }
        wave.containerSize = Math.max(width, height);
        wave.maxRadius = distanceFromPointToFurthestCorner(wave.startPosition, {w: width, h: height});
        this.waves.push(wave);
        requestAnimationFrame(this._loop);
      },

      upAction: function() {
        for (var i = 0; i < this.waves.length; i++) {
          // Declare the next wave that has mouse down to be mouse'ed up.
          var wave = this.waves[i];
          if (wave.isMouseDown) {
            wave.isMouseDown = false
            wave.mouseUpStart = now();
            wave.mouseDownStart = 0;
            wave.tUp = 0.0;
            break;
          }
        }
        this._loop && requestAnimationFrame(this._loop);
      },

      cancel: function() {
        this.cancelled = true;
      },

      animate: function(ctx) {
        var shouldRenderNextFrame = false;

        // Clear the canvas
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        var deleteTheseWaves = [];
        // The oldest wave's touch down duration
        var longestTouchDownDuration = 0;
        var longestTouchUpDuration = 0;
        // Save the last known wave color
        var lastWaveColor = null;
        // wave animation values
        var anim = {
          initialOpacity: this.initialOpacity,
          opacityDecayVelocity: this.opacityDecayVelocity,
          height: ctx.canvas.height,
          width: ctx.canvas.width
        }

        for (var i = 0; i < this.waves.length; i++) {
          var wave = this.waves[i];

          if (wave.mouseDownStart > 0) {
            wave.tDown = now() - wave.mouseDownStart;
          }
          if (wave.mouseUpStart > 0) {
            wave.tUp = now() - wave.mouseUpStart;
          }

          // Determine how long the touch has been up or down.
          var tUp = wave.tUp;
          var tDown = wave.tDown;
          longestTouchDownDuration = Math.max(longestTouchDownDuration, tDown);
          longestTouchUpDuration = Math.max(longestTouchUpDuration, tUp);

          // Obtain the instantenous size and alpha of the ripple.
          var radius = waveRadiusFn(tDown, tUp, anim);
          var waveAlpha =  waveOpacityFn(tDown, tUp, anim);
          var waveColor = cssColorWithAlpha(wave.waveColor, waveAlpha);
          lastWaveColor = wave.waveColor;

          // Position of the ripple.
          var x = wave.startPosition.x;
          var y = wave.startPosition.y;

          // Ripple gravitational pull to the center of the canvas.
          if (wave.endPosition) {

            var translateFraction = waveGravityToCenterPercentageFn(tDown, tUp, wave.maxRadius);

            // This translates from the origin to the center of the view  based on the max dimension of  
            var translateFraction = Math.min(1, radius / wave.containerSize * 2 / Math.sqrt(2) );

            x += translateFraction * (wave.endPosition.x - wave.startPosition.x);
            y += translateFraction * (wave.endPosition.y - wave.startPosition.y);
          }

          // If we do a background fill fade too, work out the correct color.
          var bgFillColor = null;
          if (this.backgroundFill) {
            var bgFillAlpha = waveOuterOpacityFn(tDown, tUp, anim);
            bgFillColor = cssColorWithAlpha(wave.waveColor, bgFillAlpha);
          }

          // Draw the ripple.
          drawRipple(ctx, x, y, radius, waveColor, bgFillColor);

          // Determine whether there is any more rendering to be done.
          var maximumWave = waveAtMaximum(wave, radius, anim);
          var waveDissipated = waveDidFinish(wave, radius, anim);
          var shouldKeepWave = !waveDissipated || maximumWave;
          var shouldRenderWaveAgain = !waveDissipated && !maximumWave;
          shouldRenderNextFrame = shouldRenderNextFrame || shouldRenderWaveAgain;
          if (!shouldKeepWave || this.cancelled) {
            deleteTheseWaves.push(wave);
          }
       }

        if (shouldRenderNextFrame) {
          requestAnimationFrame(this._loop);
        }

        for (var i = 0; i < deleteTheseWaves.length; ++i) {
          var wave = deleteTheseWaves[i];
          removeWaveFromScope(this, wave);
        }

        if (!this.waves.length) {
          // If there is nothing to draw, clear any drawn waves now because
          // we're not going to get another requestAnimationFrame any more.
          ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
          this._loop = null;
        }
      }

    });

  })();

;

    Polymer('paper-shadow', {

      publish: {
        /**
         * If set, the shadow is applied to this node.
         *
         * @attribute target
         * @type Element
         * @default null
         */
        target: {value: null, reflect: true},

        /**
         * The z-depth of this shadow, from 0-5.
         *
         * @attribute z
         * @type number
         * @default 1
         */
        z: {value: 1, reflect: true},

        /**
         * If true, the shadow animates between z-depth changes.
         *
         * @attribute animated
         * @type boolean
         * @default false
         */
        animated: {value: false, reflect: true},

        /**
         * Workaround: getComputedStyle is wrong sometimes so `paper-shadow`
         * may overwrite the `position` CSS property. Set this property to
         * true to prevent this.
         *
         * @attribute hasPosition
         * @type boolean
         * @default false
         */
        hasPosition: {value: false}
      },

      // NOTE: include template so that styles are loaded, but remove
      // so that we can decide dynamically what part to include
      registerCallback: function(polymerElement) {
        var template = polymerElement.querySelector('template');
        this._style = template.content.querySelector('style');
        this._style.removeAttribute('no-shim');
      },

      fetchTemplate: function() {
        return null;
      },

      attached: function() {
        this.installScopeStyle(this._style);

        // If no target is bound at attach, default the target to the parent
        // element or shadow host.
        if (!this.target) {
          if (!this.parentElement && this.parentNode.host) {
            this.target = this.parentNode.host;
          } else if (this.parentElement && (window.ShadowDOMPolyfill ? this.parentElement !== wrap(document.body) : this.parentElement !== document.body)) {
            this.target = this.parentElement;
          }
        }
      },

      targetChanged: function(old) {
        if (old) {
          this.removeShadow(old);
        }
        if (this.target) {
          this.addShadow(this.target);
        }
      },

      zChanged: function(old) {
        if (this.target && this.target._paperShadow) {
          var shadow = this.target._paperShadow;
          ['top', 'bottom'].forEach(function(s) {
            shadow[s].classList.remove('paper-shadow-' + s + '-z-' + old);
            shadow[s].classList.add('paper-shadow-' + s + '-z-' + this.z);
          }.bind(this));
        }
      },

      animatedChanged: function() {
        if (this.target && this.target._paperShadow) {
          var shadow = this.target._paperShadow;
          ['top', 'bottom'].forEach(function(s) {
            if (this.animated) {
              shadow[s].classList.add('paper-shadow-animated');
            } else {
              shadow[s].classList.remove('paper-shadow-animated');
            }
          }.bind(this));
        }
      },

      addShadow: function(node) {
        if (node._paperShadow) {
          return;
        }

        var computed = getComputedStyle(node);
        if (!this.hasPosition && computed.position === 'static') {
          node.style.position = 'relative';
        }
        node.style.overflow = 'visible';

        // Both the top and bottom shadows are children of the target, so
        // it does not affect the classes and CSS properties of the target.
        ['top', 'bottom'].forEach(function(s) {
          var inner = (node._paperShadow && node._paperShadow[s]) || document.createElement('div');
          inner.classList.add('paper-shadow');
          inner.classList.add('paper-shadow-' + s + '-z-' + this.z);
          if (this.animated) {
            inner.classList.add('paper-shadow-animated');
          }

          if (node.shadowRoot) {
            node.shadowRoot.insertBefore(inner, node.shadowRoot.firstChild);
          } else {
            node.insertBefore(inner, node.firstChild);
          }

          node._paperShadow = node._paperShadow || {};
          node._paperShadow[s] = inner;
        }.bind(this));

      },

      removeShadow: function(node) {
        if (!node._paperShadow) {
          return;
        }

        ['top', 'bottom'].forEach(function(s) {
          node._paperShadow[s].remove();
        });
        node._paperShadow = null;

        node.style.position = null;
      }

    });
  ;

    Polymer('paper-button', {

      publish: {

        /**
         * The label of the button.
         *
         * @attribute label
         * @type string
         * @default ''
         */
        label: '',

        /**
         * If true, the button will be styled as a "raised" button.
         *
         * @attribute raisedButton
         * @type boolean
         * @default false
         */
        raisedButton: {value: false, reflect: true},

        /**
         * (optional) The URL of an image for an icon to use in the button.
         * Should not use `icon` property if you are using this property.
         *
         * @attribute iconSrc
         * @type string
         * @default ''
         */
         iconSrc: {value: ''},

         /**
          * (optional) Specifies the icon name or index in the set of icons
          * available in the icon set. If using this property, load the icon
          * set separately where the icon is used. Should not use `src`
          * if you are using this property.
          *
          * @attribute icon
          * @type string
          * @default ''
          */
         icon: {value: ''}

      },

      z: 1,

      attached: function() {
        if (this.textContent) {
          console.warn('Using textContent to label the button is deprecated. Use the "label" property instead');
          this.label = this.textContent;
        }
      },

      activeChanged: function() {
        this.super();

        if (this.active) {
          // FIXME: remove when paper-ripple can have a default 'down' state.
          if (!this.lastEvent) {
            var rect = this.getBoundingClientRect();
            this.lastEvent = {
              x: rect.left + rect.width / 2,
              y: rect.top + rect.height / 2
            }
          }
          this.$.ripple.downAction(this.lastEvent);
        } else {
          this.$.ripple.upAction();
        }
        this.adjustZ();
      },

      focusedChanged: function() {
        this.super();
        this.adjustZ();
      },

      disabledChanged: function() {
        this.super();
        this.adjustZ();
      },

      // waitForSpillCompleted: function(callback) {
      //   this.async(callback, null, (this.$.ink.spillCompleted ? 0 : this.duration));
      // },

      // resetInk: function() {
      //   this.active = false;
      //   this.$.ink.reset();
      // },

      insideButton: function(x, y) {
        var rect = this.getBoundingClientRect();
        return (rect.left <= x) && (x <= rect.right) && (rect.top <= y) && (y <= rect.bottom);
      },

      adjustZ: function() {
        if (this.focused) {
          this.classList.add('paper-shadow-animate-z-1-z-2');
        } else {
          this.classList.remove('paper-shadow-animate-z-1-z-2');

          if (this.active) {
            this.z = 2;
          } else if (this.disabled) {
            this.z = 0;
          } else {
            this.z = 1;
          }

        }
      },

      downAction: function(e) {
        this.super(e);
        this.lastEvent = e;
      },

      labelChanged: function() {
        this.setAttribute('aria-label', this.label);
      }

    });
  ;

		Polymer('sensorsbox-settings', {
		created: function(){
			this.remoteServer = this.remoteServer || 'http://beta.sensorsbox.com';
			this.localPort = this.localPort || 3333;
		},
		ready: function() {
			var _self = this;
			var inputs = this.shadowRoot.getElementsByTagName('paper-input');

			inputs[0].addEventListener('blur', function(){
				_self.remoteServer = inputs[0].value;
			});
			inputs[1].addEventListener('blur', function(){
				_self.localPort = inputs[1].value;
			});
		}
    });
	;


    Polymer('core-xhr', {

      /**
       * Sends a HTTP request to the server and returns the XHR object.
       *
       * @method request
       * @param {Object} inOptions
       *    @param {String} inOptions.url The url to which the request is sent.
       *    @param {String} inOptions.method The HTTP method to use, default is GET.
       *    @param {boolean} inOptions.sync By default, all requests are sent asynchronously. To send synchronous requests, set to true.
       *    @param {Object} inOptions.params Data to be sent to the server.
       *    @param {Object} inOptions.body The content for the request body for POST method.
       *    @param {Object} inOptions.headers HTTP request headers.
       *    @param {String} inOptions.responseType The response type. Default is 'text'.
       *    @param {boolean} inOptions.withCredentials Whether or not to send credentials on the request. Default is false.
       *    @param {Object} inOptions.callback Called when request is completed.
       * @returns {Object} XHR object.
       */
      request: function(options) {
        var xhr = new XMLHttpRequest();
        var url = options.url;
        var method = options.method || 'GET';
        var async = !options.sync;
        //
        var params = this.toQueryString(options.params);
        if (params && method == 'GET') {
          url += (url.indexOf('?') > 0 ? '&' : '?') + params;
        }
        var xhrParams = this.isBodyMethod(method) ? (options.body || params) : null;
        //
        xhr.open(method, url, async);
        if (options.responseType) {
          xhr.responseType = options.responseType;
        }
        if (options.withCredentials) {
          xhr.withCredentials = true;
        }
        this.makeReadyStateHandler(xhr, options.callback);
        this.setRequestHeaders(xhr, options.headers);
        xhr.send(xhrParams);
        if (!async) {
          xhr.onreadystatechange(xhr);
        }
        return xhr;
      },
    
      toQueryString: function(params) {
        var r = [];
        for (var n in params) {
          var v = params[n];
          n = encodeURIComponent(n);
          r.push(v == null ? n : (n + '=' + encodeURIComponent(v)));
        }
        return r.join('&');
      },

      isBodyMethod: function(method) {
        return this.bodyMethods[(method || '').toUpperCase()];
      },
      
      bodyMethods: {
        POST: 1,
        PUT: 1,
        DELETE: 1
      },

      makeReadyStateHandler: function(xhr, callback) {
        xhr.onreadystatechange = function() {
          if (xhr.readyState == 4) {
            callback && callback.call(null, xhr.response, xhr);
          }
        };
      },

      setRequestHeaders: function(xhr, headers) {
        if (headers) {
          for (var name in headers) {
            xhr.setRequestHeader(name, headers[name]);
          }
        }
      }

    });

  ;


  Polymer('core-ajax', {
    /**
     * Fired when a response is received.
     * 
     * @event core-response
     */

    /**
     * Fired when an error is received.
     * 
     * @event core-error
     */

    /**
     * Fired whenever a response or an error is received.
     *
     * @event core-complete
     */

    /**
     * The URL target of the request.
     * 
     * @attribute url
     * @type string
     * @default ''
     */
    url: '',

    /**
     * Specifies what data to store in the `response` property, and
     * to deliver as `event.response` in `response` events.
     * 
     * One of:
     * 
     *    `text`: uses `XHR.responseText`.
     *    
     *    `xml`: uses `XHR.responseXML`.
     *    
     *    `json`: uses `XHR.responseText` parsed as JSON.
     *
     *    `arraybuffer`: uses `XHR.response`.
     *
     *    `blob`: uses `XHR.response`.
     *
     *    `document`: uses `XHR.response`.
     *  
     * @attribute handleAs
     * @type string
     * @default 'text'
     */
    handleAs: '',

    /**
     * If true, automatically performs an Ajax request when either `url` or `params` changes.
     *
     * @attribute auto
     * @type boolean
     * @default false
     */
    auto: false,

    /**
     * Parameters to send to the specified URL, as JSON.
     *  
     * @attribute params
     * @type string (JSON)
     * @default ''
     */
    params: '',

    /**
     * Returns the response object.
     *
     * @attribute response
     * @type Object
     * @default null
     */
    response: null,

    /**
     * The HTTP method to use such as 'GET', 'POST', 'PUT', or 'DELETE'.
     * Default is 'GET'.
     *
     * @attribute method
     * @type string
     * @default ''
     */
    method: '',

    /**
     * HTTP request headers to send.
     *
     * Example:
     *
     *     <core-ajax 
     *         auto
     *         url="http://somesite.com"
     *         headers='{"X-Requested-With": "XMLHttpRequest"}'
     *         handleAs="json"
     *         on-core-response="{{handleResponse}}"></core-ajax>
     *  
     * @attribute headers
     * @type Object
     * @default null
     */
    headers: null,

    /**
     * Optional raw body content to send when method === "POST".
     *
     * Example:
     *
     *     <core-ajax method="POST" auto url="http://somesite.com"
     *         body='{"foo":1, "bar":2}'>
     *     </core-ajax>
     *  
     * @attribute body
     * @type Object
     * @default null
     */
    body: null,

    /**
     * Content type to use when sending data.
     *
     * @attribute contentType
     * @type string
     * @default 'application/x-www-form-urlencoded'
     */
    contentType: 'application/x-www-form-urlencoded',

    /**
     * Set the withCredentials flag on the request.
     * 
     * @attribute withCredentials
     * @type boolean
     * @default false
     */
    withCredentials: false,
    
    /**
     * Additional properties to send to core-xhr.
     *
     * Can be set to an object containing default properties
     * to send as arguments to the `core-xhr.request()` method
     * which implements the low-level communication.
     * 
     * @property xhrArgs
     * @type Object
     * @default null
     */
    xhrArgs: null,
     
    ready: function() {
      this.xhr = document.createElement('core-xhr');
    },

    receive: function(response, xhr) {
      if (this.isSuccess(xhr)) {
        this.processResponse(xhr);
      } else {
        this.error(xhr);
      }
      this.complete(xhr);
    },

    isSuccess: function(xhr) {
      var status = xhr.status || 0;
      return !status || (status >= 200 && status < 300);
    },

    processResponse: function(xhr) {
      var response = this.evalResponse(xhr);
      this.response = response;
      this.fire('core-response', {response: response, xhr: xhr});
    },

    error: function(xhr) {
      var response = xhr.status + ': ' + xhr.responseText;
      this.fire('core-error', {response: response, xhr: xhr});
    },

    complete: function(xhr) {
      this.fire('core-complete', {response: xhr.status, xhr: xhr});
    },

    evalResponse: function(xhr) {
      return this[(this.handleAs || 'text') + 'Handler'](xhr);
    },

    xmlHandler: function(xhr) {
      return xhr.responseXML;
    },

    textHandler: function(xhr) {
      return xhr.responseText;
    },

    jsonHandler: function(xhr) {
      var r = xhr.responseText;
      try {
        return JSON.parse(r);
      } catch (x) {
        return r;
      }
    },

    documentHandler: function(xhr) {
      return xhr.response;
    },

    blobHandler: function(xhr) {
      return xhr.response;
    },

    arraybufferHandler: function(xhr) {
      return xhr.response;
    },

    urlChanged: function() {
      if (!this.handleAs) {
        var ext = String(this.url).split('.').pop();
        switch (ext) {
          case 'json':
            this.handleAs = 'json';
            break;
        }
      }
      this.autoGo();
    },

    paramsChanged: function() {
      this.autoGo();
    },

    autoChanged: function() {
      this.autoGo();
    },

    // TODO(sorvell): multiple side-effects could call autoGo 
    // during one micro-task, use a job to have only one action 
    // occur
    autoGo: function() {
      if (this.auto) {
        this.goJob = this.job(this.goJob, this.go, 0);
      }
    },

    /**
     * Performs an Ajax request to the specified URL.
     *
     * @method go
     */
    go: function() {
      var args = this.xhrArgs || {};
      // TODO(sjmiles): we may want XHR to default to POST if body is set
      args.body = this.body || args.body;
      args.params = this.params || args.params;
      if (args.params && typeof(args.params) == 'string') {
        args.params = JSON.parse(args.params);
      }
      args.headers = this.headers || args.headers || {};
      if (args.headers && typeof(args.headers) == 'string') {
        args.headers = JSON.parse(args.headers);
      }
      if (this.contentType) {
        args.headers['content-type'] = this.contentType;
      }
      if (this.handleAs === 'arraybuffer' || this.handleAs === 'blob' ||
          this.handleAs === 'document') {
        args.responseType = this.handleAs;
      }
      args.withCredentials = this.withCredentials;
      args.callback = this.receive.bind(this);
      args.url = this.url;
      args.method = this.method;
      return args.url && this.xhr.request(args);
    }

  });

;


  Polymer('paper-radio-button', {
    
    /**
     * Fired when the checked state changes.
     *
     * @event change
     */
    
    publish: {
      /**
       * Gets or sets the state, `true` is checked and `false` is unchecked.
       *
       * @attribute checked
       * @type boolean
       * @default false
       */
      checked: {value: false, reflect: true},
      
      /**
       * The label for the radio button.
       *
       * @attribute label
       * @type string
       * @default ''
       */
      label: '',
      
      /**
       * Normally the user cannot uncheck the radio button by tapping once
       * checked.  Setting this property to `true` makes the radio button
       * toggleable from checked to unchecked.
       *
       * @attribute toggles
       * @type boolean
       * @default false
       */
      toggles: false
    },
    
    eventDelegates: {
      tap: 'tap'
    },
    
    tap: function() {
      this.toggle();
      this.fire('paper-radio-button-activate');
    },
    
    toggle: function() {
      this.checked = !this.toggles || !this.checked;
    },
    
    checkedChanged: function() {
      this.$.onRadio.classList.toggle('fill', this.checked);
      this.setAttribute('aria-checked', this.checked ? 'true': 'false');
      this.fire('change');
    },
    
    labelChanged: function() {
      this.setAttribute('aria-label', this.label);
    }
    
  });
  
;


  Polymer('paper-checkbox', {
    
    /**
     * Fired when the checked state changes.
     *
     * @event change
     */
    
    toggles: true,

    checkedChanged: function() {
      var cl = this.$.checkbox.classList;
      cl.toggle('checked', this.checked);
      cl.toggle('unchecked', !this.checked);
      cl.toggle('checkmark', !this.checked);
      cl.toggle('box', this.checked);
      this.setAttribute('aria-checked', this.checked ? 'true': 'false');
      this.fire('change');
    },

    checkboxAnimationEnd: function() {
      var cl = this.$.checkbox.classList;
      cl.toggle('checkmark', this.checked && !cl.contains('checkmark'));
      cl.toggle('box', !this.checked && !cl.contains('box'));
    }

  });
  
;

		Polymer('sensorsbox-boxes', {
		created: function() {
			this.boxes = [];
		},
		observe : {
			'remoteServer' : 'newRemoteServer'
		},
		newRemoteServer : function(oldValue, newValue){
			this.$.ajax.url = newValue + '/api/v1/box';
			this.$.ajax.go();
		},
		boxesLoaded: function() {
			this.boxes = this.$.ajax.response.slice(0);
			var _self = this;
			setTimeout(function(){
				var checkboxes = _self.shadowRoot.getElementsByTagName('paper-checkbox');

				for (var i = 0; i < checkboxes.length; i++) {

					checkboxes[i].addEventListener('change', function(e) {
						var boxid = this.dataset.value;
						if (this.checked) {
					        _self.fire('watchbox', {boxid: boxid});
						}
						else {
					        _self.fire('unwatchbox', {boxid: boxid});
						}
					});
				};
			}, 0);
		}
    });
	;
/*! Socket.IO.min.js build:0.9.16, production. Copyright(c) 2011 LearnBoost <dev@learnboost.com> MIT Licensed */
var io="undefined"==typeof module?{}:module.exports;(function(){(function(a,b){var c=a;c.version="0.9.16",c.protocol=1,c.transports=[],c.j=[],c.sockets={},c.connect=function(a,d){var e=c.util.parseUri(a),f,g;b&&b.location&&(e.protocol=e.protocol||b.location.protocol.slice(0,-1),e.host=e.host||(b.document?b.document.domain:b.location.hostname),e.port=e.port||b.location.port),f=c.util.uniqueUri(e);var h={host:e.host,secure:"https"==e.protocol,port:e.port||("https"==e.protocol?443:80),query:e.query||""};c.util.merge(h,d);if(h["force new connection"]||!c.sockets[f])g=new c.Socket(h);return!h["force new connection"]&&g&&(c.sockets[f]=g),g=g||c.sockets[f],g.of(e.path.length>1?e.path:"")}})("object"==typeof module?module.exports:this.io={},this),function(a,b){var c=a.util={},d=/^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,e=["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"];c.parseUri=function(a){var b=d.exec(a||""),c={},f=14;while(f--)c[e[f]]=b[f]||"";return c},c.uniqueUri=function(a){var c=a.protocol,d=a.host,e=a.port;return"document"in b?(d=d||document.domain,e=e||(c=="https"&&document.location.protocol!=="https:"?443:document.location.port)):(d=d||"localhost",!e&&c=="https"&&(e=443)),(c||"http")+"://"+d+":"+(e||80)},c.query=function(a,b){var d=c.chunkQuery(a||""),e=[];c.merge(d,c.chunkQuery(b||""));for(var f in d)d.hasOwnProperty(f)&&e.push(f+"="+d[f]);return e.length?"?"+e.join("&"):""},c.chunkQuery=function(a){var b={},c=a.split("&"),d=0,e=c.length,f;for(;d<e;++d)f=c[d].split("="),f[0]&&(b[f[0]]=f[1]);return b};var f=!1;c.load=function(a){if("document"in b&&document.readyState==="complete"||f)return a();c.on(b,"load",a,!1)},c.on=function(a,b,c,d){a.attachEvent?a.attachEvent("on"+b,c):a.addEventListener&&a.addEventListener(b,c,d)},c.request=function(a){if(a&&"undefined"!=typeof XDomainRequest&&!c.ua.hasCORS)return new XDomainRequest;if("undefined"!=typeof XMLHttpRequest&&(!a||c.ua.hasCORS))return new XMLHttpRequest;if(!a)try{return new(window[["Active"].concat("Object").join("X")])("Microsoft.XMLHTTP")}catch(b){}return null},"undefined"!=typeof window&&c.load(function(){f=!0}),c.defer=function(a){if(!c.ua.webkit||"undefined"!=typeof importScripts)return a();c.load(function(){setTimeout(a,100)})},c.merge=function(b,d,e,f){var g=f||[],h=typeof e=="undefined"?2:e,i;for(i in d)d.hasOwnProperty(i)&&c.indexOf(g,i)<0&&(typeof b[i]!="object"||!h?(b[i]=d[i],g.push(d[i])):c.merge(b[i],d[i],h-1,g));return b},c.mixin=function(a,b){c.merge(a.prototype,b.prototype)},c.inherit=function(a,b){function c(){}c.prototype=b.prototype,a.prototype=new c},c.isArray=Array.isArray||function(a){return Object.prototype.toString.call(a)==="[object Array]"},c.intersect=function(a,b){var d=[],e=a.length>b.length?a:b,f=a.length>b.length?b:a;for(var g=0,h=f.length;g<h;g++)~c.indexOf(e,f[g])&&d.push(f[g]);return d},c.indexOf=function(a,b,c){for(var d=a.length,c=c<0?c+d<0?0:c+d:c||0;c<d&&a[c]!==b;c++);return d<=c?-1:c},c.toArray=function(a){var b=[];for(var c=0,d=a.length;c<d;c++)b.push(a[c]);return b},c.ua={},c.ua.hasCORS="undefined"!=typeof XMLHttpRequest&&function(){try{var a=new XMLHttpRequest}catch(b){return!1}return a.withCredentials!=undefined}(),c.ua.webkit="undefined"!=typeof navigator&&/webkit/i.test(navigator.userAgent),c.ua.iDevice="undefined"!=typeof navigator&&/iPad|iPhone|iPod/i.test(navigator.userAgent)}("undefined"!=typeof io?io:module.exports,this),function(a,b){function c(){}a.EventEmitter=c,c.prototype.on=function(a,c){return this.$events||(this.$events={}),this.$events[a]?b.util.isArray(this.$events[a])?this.$events[a].push(c):this.$events[a]=[this.$events[a],c]:this.$events[a]=c,this},c.prototype.addListener=c.prototype.on,c.prototype.once=function(a,b){function d(){c.removeListener(a,d),b.apply(this,arguments)}var c=this;return d.listener=b,this.on(a,d),this},c.prototype.removeListener=function(a,c){if(this.$events&&this.$events[a]){var d=this.$events[a];if(b.util.isArray(d)){var e=-1;for(var f=0,g=d.length;f<g;f++)if(d[f]===c||d[f].listener&&d[f].listener===c){e=f;break}if(e<0)return this;d.splice(e,1),d.length||delete this.$events[a]}else(d===c||d.listener&&d.listener===c)&&delete this.$events[a]}return this},c.prototype.removeAllListeners=function(a){return a===undefined?(this.$events={},this):(this.$events&&this.$events[a]&&(this.$events[a]=null),this)},c.prototype.listeners=function(a){return this.$events||(this.$events={}),this.$events[a]||(this.$events[a]=[]),b.util.isArray(this.$events[a])||(this.$events[a]=[this.$events[a]]),this.$events[a]},c.prototype.emit=function(a){if(!this.$events)return!1;var c=this.$events[a];if(!c)return!1;var d=Array.prototype.slice.call(arguments,1);if("function"==typeof c)c.apply(this,d);else{if(!b.util.isArray(c))return!1;var e=c.slice();for(var f=0,g=e.length;f<g;f++)e[f].apply(this,d)}return!0}}("undefined"!=typeof io?io:module.exports,"undefined"!=typeof io?io:module.parent.exports),function(exports,nativeJSON){function f(a){return a<10?"0"+a:a}function date(a,b){return isFinite(a.valueOf())?a.getUTCFullYear()+"-"+f(a.getUTCMonth()+1)+"-"+f(a.getUTCDate())+"T"+f(a.getUTCHours())+":"+f(a.getUTCMinutes())+":"+f(a.getUTCSeconds())+"Z":null}function quote(a){return escapable.lastIndex=0,escapable.test(a)?'"'+a.replace(escapable,function(a){var b=meta[a];return typeof b=="string"?b:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+a+'"'}function str(a,b){var c,d,e,f,g=gap,h,i=b[a];i instanceof Date&&(i=date(a)),typeof rep=="function"&&(i=rep.call(b,a,i));switch(typeof i){case"string":return quote(i);case"number":return isFinite(i)?String(i):"null";case"boolean":case"null":return String(i);case"object":if(!i)return"null";gap+=indent,h=[];if(Object.prototype.toString.apply(i)==="[object Array]"){f=i.length;for(c=0;c<f;c+=1)h[c]=str(c,i)||"null";return e=h.length===0?"[]":gap?"[\n"+gap+h.join(",\n"+gap)+"\n"+g+"]":"["+h.join(",")+"]",gap=g,e}if(rep&&typeof rep=="object"){f=rep.length;for(c=0;c<f;c+=1)typeof rep[c]=="string"&&(d=rep[c],e=str(d,i),e&&h.push(quote(d)+(gap?": ":":")+e))}else for(d in i)Object.prototype.hasOwnProperty.call(i,d)&&(e=str(d,i),e&&h.push(quote(d)+(gap?": ":":")+e));return e=h.length===0?"{}":gap?"{\n"+gap+h.join(",\n"+gap)+"\n"+g+"}":"{"+h.join(",")+"}",gap=g,e}}"use strict";if(nativeJSON&&nativeJSON.parse)return exports.JSON={parse:nativeJSON.parse,stringify:nativeJSON.stringify};var JSON=exports.JSON={},cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},rep;JSON.stringify=function(a,b,c){var d;gap="",indent="";if(typeof c=="number")for(d=0;d<c;d+=1)indent+=" ";else typeof c=="string"&&(indent=c);rep=b;if(!b||typeof b=="function"||typeof b=="object"&&typeof b.length=="number")return str("",{"":a});throw new Error("JSON.stringify")},JSON.parse=function(text,reviver){function walk(a,b){var c,d,e=a[b];if(e&&typeof e=="object")for(c in e)Object.prototype.hasOwnProperty.call(e,c)&&(d=walk(e,c),d!==undefined?e[c]=d:delete e[c]);return reviver.call(a,b,e)}var j;text=String(text),cx.lastIndex=0,cx.test(text)&&(text=text.replace(cx,function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)}));if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,"")))return j=eval("("+text+")"),typeof reviver=="function"?walk({"":j},""):j;throw new SyntaxError("JSON.parse")}}("undefined"!=typeof io?io:module.exports,typeof JSON!="undefined"?JSON:undefined),function(a,b){var c=a.parser={},d=c.packets=["disconnect","connect","heartbeat","message","json","event","ack","error","noop"],e=c.reasons=["transport not supported","client not handshaken","unauthorized"],f=c.advice=["reconnect"],g=b.JSON,h=b.util.indexOf;c.encodePacket=function(a){var b=h(d,a.type),c=a.id||"",i=a.endpoint||"",j=a.ack,k=null;switch(a.type){case"error":var l=a.reason?h(e,a.reason):"",m=a.advice?h(f,a.advice):"";if(l!==""||m!=="")k=l+(m!==""?"+"+m:"");break;case"message":a.data!==""&&(k=a.data);break;case"event":var n={name:a.name};a.args&&a.args.length&&(n.args=a.args),k=g.stringify(n);break;case"json":k=g.stringify(a.data);break;case"connect":a.qs&&(k=a.qs);break;case"ack":k=a.ackId+(a.args&&a.args.length?"+"+g.stringify(a.args):"")}var o=[b,c+(j=="data"?"+":""),i];return k!==null&&k!==undefined&&o.push(k),o.join(":")},c.encodePayload=function(a){var b="";if(a.length==1)return a[0];for(var c=0,d=a.length;c<d;c++){var e=a[c];b+="\ufffd"+e.length+"\ufffd"+a[c]}return b};var i=/([^:]+):([0-9]+)?(\+)?:([^:]+)?:?([\s\S]*)?/;c.decodePacket=function(a){var b=a.match(i);if(!b)return{};var c=b[2]||"",a=b[5]||"",h={type:d[b[1]],endpoint:b[4]||""};c&&(h.id=c,b[3]?h.ack="data":h.ack=!0);switch(h.type){case"error":var b=a.split("+");h.reason=e[b[0]]||"",h.advice=f[b[1]]||"";break;case"message":h.data=a||"";break;case"event":try{var j=g.parse(a);h.name=j.name,h.args=j.args}catch(k){}h.args=h.args||[];break;case"json":try{h.data=g.parse(a)}catch(k){}break;case"connect":h.qs=a||"";break;case"ack":var b=a.match(/^([0-9]+)(\+)?(.*)/);if(b){h.ackId=b[1],h.args=[];if(b[3])try{h.args=b[3]?g.parse(b[3]):[]}catch(k){}}break;case"disconnect":case"heartbeat":}return h},c.decodePayload=function(a){if(a.charAt(0)=="\ufffd"){var b=[];for(var d=1,e="";d<a.length;d++)a.charAt(d)=="\ufffd"?(b.push(c.decodePacket(a.substr(d+1).substr(0,e))),d+=Number(e)+1,e=""):e+=a.charAt(d);return b}return[c.decodePacket(a)]}}("undefined"!=typeof io?io:module.exports,"undefined"!=typeof io?io:module.parent.exports),function(a,b){function c(a,b){this.socket=a,this.sessid=b}a.Transport=c,b.util.mixin(c,b.EventEmitter),c.prototype.heartbeats=function(){return!0},c.prototype.onData=function(a){this.clearCloseTimeout(),(this.socket.connected||this.socket.connecting||this.socket.reconnecting)&&this.setCloseTimeout();if(a!==""){var c=b.parser.decodePayload(a);if(c&&c.length)for(var d=0,e=c.length;d<e;d++)this.onPacket(c[d])}return this},c.prototype.onPacket=function(a){return this.socket.setHeartbeatTimeout(),a.type=="heartbeat"?this.onHeartbeat():(a.type=="connect"&&a.endpoint==""&&this.onConnect(),a.type=="error"&&a.advice=="reconnect"&&(this.isOpen=!1),this.socket.onPacket(a),this)},c.prototype.setCloseTimeout=function(){if(!this.closeTimeout){var a=this;this.closeTimeout=setTimeout(function(){a.onDisconnect()},this.socket.closeTimeout)}},c.prototype.onDisconnect=function(){return this.isOpen&&this.close(),this.clearTimeouts(),this.socket.onDisconnect(),this},c.prototype.onConnect=function(){return this.socket.onConnect(),this},c.prototype.clearCloseTimeout=function(){this.closeTimeout&&(clearTimeout(this.closeTimeout),this.closeTimeout=null)},c.prototype.clearTimeouts=function(){this.clearCloseTimeout(),this.reopenTimeout&&clearTimeout(this.reopenTimeout)},c.prototype.packet=function(a){this.send(b.parser.encodePacket(a))},c.prototype.onHeartbeat=function(a){this.packet({type:"heartbeat"})},c.prototype.onOpen=function(){this.isOpen=!0,this.clearCloseTimeout(),this.socket.onOpen()},c.prototype.onClose=function(){var a=this;this.isOpen=!1,this.socket.onClose(),this.onDisconnect()},c.prototype.prepareUrl=function(){var a=this.socket.options;return this.scheme()+"://"+a.host+":"+a.port+"/"+a.resource+"/"+b.protocol+"/"+this.name+"/"+this.sessid},c.prototype.ready=function(a,b){b.call(this)}}("undefined"!=typeof io?io:module.exports,"undefined"!=typeof io?io:module.parent.exports),function(a,b,c){function d(a){this.options={port:80,secure:!1,document:"document"in c?document:!1,resource:"socket.io",transports:b.transports,"connect timeout":1e4,"try multiple transports":!0,reconnect:!0,"reconnection delay":500,"reconnection limit":Infinity,"reopen delay":3e3,"max reconnection attempts":10,"sync disconnect on unload":!1,"auto connect":!0,"flash policy port":10843,manualFlush:!1},b.util.merge(this.options,a),this.connected=!1,this.open=!1,this.connecting=!1,this.reconnecting=!1,this.namespaces={},this.buffer=[],this.doBuffer=!1;if(this.options["sync disconnect on unload"]&&(!this.isXDomain()||b.util.ua.hasCORS)){var d=this;b.util.on(c,"beforeunload",function(){d.disconnectSync()},!1)}this.options["auto connect"]&&this.connect()}function e(){}a.Socket=d,b.util.mixin(d,b.EventEmitter),d.prototype.of=function(a){return this.namespaces[a]||(this.namespaces[a]=new b.SocketNamespace(this,a),a!==""&&this.namespaces[a].packet({type:"connect"})),this.namespaces[a]},d.prototype.publish=function(){this.emit.apply(this,arguments);var a;for(var b in this.namespaces)this.namespaces.hasOwnProperty(b)&&(a=this.of(b),a.$emit.apply(a,arguments))},d.prototype.handshake=function(a){function f(b){b instanceof Error?(c.connecting=!1,c.onError(b.message)):a.apply(null,b.split(":"))}var c=this,d=this.options,g=["http"+(d.secure?"s":"")+":/",d.host+":"+d.port,d.resource,b.protocol,b.util.query(this.options.query,"t="+ +(new Date))].join("/");if(this.isXDomain()&&!b.util.ua.hasCORS){var h=document.getElementsByTagName("script")[0],i=document.createElement("script");i.src=g+"&jsonp="+b.j.length,h.parentNode.insertBefore(i,h),b.j.push(function(a){f(a),i.parentNode.removeChild(i)})}else{var j=b.util.request();j.open("GET",g,!0),this.isXDomain()&&(j.withCredentials=!0),j.onreadystatechange=function(){j.readyState==4&&(j.onreadystatechange=e,j.status==200?f(j.responseText):j.status==403?c.onError(j.responseText):(c.connecting=!1,!c.reconnecting&&c.onError(j.responseText)))},j.send(null)}},d.prototype.getTransport=function(a){var c=a||this.transports,d;for(var e=0,f;f=c[e];e++)if(b.Transport[f]&&b.Transport[f].check(this)&&(!this.isXDomain()||b.Transport[f].xdomainCheck(this)))return new b.Transport[f](this,this.sessionid);return null},d.prototype.connect=function(a){if(this.connecting)return this;var c=this;return c.connecting=!0,this.handshake(function(d,e,f,g){function h(a){c.transport&&c.transport.clearTimeouts(),c.transport=c.getTransport(a);if(!c.transport)return c.publish("connect_failed");c.transport.ready(c,function(){c.connecting=!0,c.publish("connecting",c.transport.name),c.transport.open(),c.options["connect timeout"]&&(c.connectTimeoutTimer=setTimeout(function(){if(!c.connected){c.connecting=!1;if(c.options["try multiple transports"]){var a=c.transports;while(a.length>0&&a.splice(0,1)[0]!=c.transport.name);a.length?h(a):c.publish("connect_failed")}}},c.options["connect timeout"]))})}c.sessionid=d,c.closeTimeout=f*1e3,c.heartbeatTimeout=e*1e3,c.transports||(c.transports=c.origTransports=g?b.util.intersect(g.split(","),c.options.transports):c.options.transports),c.setHeartbeatTimeout(),h(c.transports),c.once("connect",function(){clearTimeout(c.connectTimeoutTimer),a&&typeof a=="function"&&a()})}),this},d.prototype.setHeartbeatTimeout=function(){clearTimeout(this.heartbeatTimeoutTimer);if(this.transport&&!this.transport.heartbeats())return;var a=this;this.heartbeatTimeoutTimer=setTimeout(function(){a.transport.onClose()},this.heartbeatTimeout)},d.prototype.packet=function(a){return this.connected&&!this.doBuffer?this.transport.packet(a):this.buffer.push(a),this},d.prototype.setBuffer=function(a){this.doBuffer=a,!a&&this.connected&&this.buffer.length&&(this.options.manualFlush||this.flushBuffer())},d.prototype.flushBuffer=function(){this.transport.payload(this.buffer),this.buffer=[]},d.prototype.disconnect=function(){if(this.connected||this.connecting)this.open&&this.of("").packet({type:"disconnect"}),this.onDisconnect("booted");return this},d.prototype.disconnectSync=function(){var a=b.util.request(),c=["http"+(this.options.secure?"s":"")+":/",this.options.host+":"+this.options.port,this.options.resource,b.protocol,"",this.sessionid].join("/")+"/?disconnect=1";a.open("GET",c,!1),a.send(null),this.onDisconnect("booted")},d.prototype.isXDomain=function(){var a=c.location.port||("https:"==c.location.protocol?443:80);return this.options.host!==c.location.hostname||this.options.port!=a},d.prototype.onConnect=function(){this.connected||(this.connected=!0,this.connecting=!1,this.doBuffer||this.setBuffer(!1),this.emit("connect"))},d.prototype.onOpen=function(){this.open=!0},d.prototype.onClose=function(){this.open=!1,clearTimeout(this.heartbeatTimeoutTimer)},d.prototype.onPacket=function(a){this.of(a.endpoint).onPacket(a)},d.prototype.onError=function(a){a&&a.advice&&a.advice==="reconnect"&&(this.connected||this.connecting)&&(this.disconnect(),this.options.reconnect&&this.reconnect()),this.publish("error",a&&a.reason?a.reason:a)},d.prototype.onDisconnect=function(a){var b=this.connected,c=this.connecting;this.connected=!1,this.connecting=!1,this.open=!1;if(b||c)this.transport.close(),this.transport.clearTimeouts(),b&&(this.publish("disconnect",a),"booted"!=a&&this.options.reconnect&&!this.reconnecting&&this.reconnect())},d.prototype.reconnect=function(){function e(){if(a.connected){for(var b in a.namespaces)a.namespaces.hasOwnProperty(b)&&""!==b&&a.namespaces[b].packet({type:"connect"});a.publish("reconnect",a.transport.name,a.reconnectionAttempts)}clearTimeout(a.reconnectionTimer),a.removeListener("connect_failed",f),a.removeListener("connect",f),a.reconnecting=!1,delete a.reconnectionAttempts,delete a.reconnectionDelay,delete a.reconnectionTimer,delete a.redoTransports,a.options["try multiple transports"]=c}function f(){if(!a.reconnecting)return;if(a.connected)return e();if(a.connecting&&a.reconnecting)return a.reconnectionTimer=setTimeout(f,1e3);a.reconnectionAttempts++>=b?a.redoTransports?(a.publish("reconnect_failed"),e()):(a.on("connect_failed",f),a.options["try multiple transports"]=!0,a.transports=a.origTransports,a.transport=a.getTransport(),a.redoTransports=!0,a.connect()):(a.reconnectionDelay<d&&(a.reconnectionDelay*=2),a.connect(),a.publish("reconnecting",a.reconnectionDelay,a.reconnectionAttempts),a.reconnectionTimer=setTimeout(f,a.reconnectionDelay))}this.reconnecting=!0,this.reconnectionAttempts=0,this.reconnectionDelay=this.options["reconnection delay"];var a=this,b=this.options["max reconnection attempts"],c=this.options["try multiple transports"],d=this.options["reconnection limit"];this.options["try multiple transports"]=!1,this.reconnectionTimer=setTimeout(f,this.reconnectionDelay),this.on("connect",f)}}("undefined"!=typeof io?io:module.exports,"undefined"!=typeof io?io:module.parent.exports,this),function(a,b){function c(a,b){this.socket=a,this.name=b||"",this.flags={},this.json=new d(this,"json"),this.ackPackets=0,this.acks={}}function d(a,b){this.namespace=a,this.name=b}a.SocketNamespace=c,b.util.mixin(c,b.EventEmitter),c.prototype.$emit=b.EventEmitter.prototype.emit,c.prototype.of=function(){return this.socket.of.apply(this.socket,arguments)},c.prototype.packet=function(a){return a.endpoint=this.name,this.socket.packet(a),this.flags={},this},c.prototype.send=function(a,b){var c={type:this.flags.json?"json":"message",data:a};return"function"==typeof b&&(c.id=++this.ackPackets,c.ack=!0,this.acks[c.id]=b),this.packet(c)},c.prototype.emit=function(a){var b=Array.prototype.slice.call(arguments,1),c=b[b.length-1],d={type:"event",name:a};return"function"==typeof c&&(d.id=++this.ackPackets,d.ack="data",this.acks[d.id]=c,b=b.slice(0,b.length-1)),d.args=b,this.packet(d)},c.prototype.disconnect=function(){return this.name===""?this.socket.disconnect():(this.packet({type:"disconnect"}),this.$emit("disconnect")),this},c.prototype.onPacket=function(a){function d(){c.packet({type:"ack",args:b.util.toArray(arguments),ackId:a.id})}var c=this;switch(a.type){case"connect":this.$emit("connect");break;case"disconnect":this.name===""?this.socket.onDisconnect(a.reason||"booted"):this.$emit("disconnect",a.reason);break;case"message":case"json":var e=["message",a.data];a.ack=="data"?e.push(d):a.ack&&this.packet({type:"ack",ackId:a.id}),this.$emit.apply(this,e);break;case"event":var e=[a.name].concat(a.args);a.ack=="data"&&e.push(d),this.$emit.apply(this,e);break;case"ack":this.acks[a.ackId]&&(this.acks[a.ackId].apply(this,a.args),delete this.acks[a.ackId]);break;case"error":a.advice?this.socket.onError(a):a.reason=="unauthorized"?this.$emit("connect_failed",a.reason):this.$emit("error",a.reason)}},d.prototype.send=function(){this.namespace.flags[this.name]=!0,this.namespace.send.apply(this.namespace,arguments)},d.prototype.emit=function(){this.namespace.flags[this.name]=!0,this.namespace.emit.apply(this.namespace,arguments)}}("undefined"!=typeof io?io:module.exports,"undefined"!=typeof io?io:module.parent.exports),function(a,b,c){function d(a){b.Transport.apply(this,arguments)}a.websocket=d,b.util.inherit(d,b.Transport),d.prototype.name="websocket",d.prototype.open=function(){var a=b.util.query(this.socket.options.query),d=this,e;return e||(e=c.MozWebSocket||c.WebSocket),this.websocket=new e(this.prepareUrl()+a),this.websocket.onopen=function(){d.onOpen(),d.socket.setBuffer(!1)},this.websocket.onmessage=function(a){d.onData(a.data)},this.websocket.onclose=function(){d.onClose(),d.socket.setBuffer(!0)},this.websocket.onerror=function(a){d.onError(a)},this},b.util.ua.iDevice?d.prototype.send=function(a){var b=this;return setTimeout(function(){b.websocket.send(a)},0),this}:d.prototype.send=function(a){return this.websocket.send(a),this},d.prototype.payload=function(a){for(var b=0,c=a.length;b<c;b++)this.packet(a[b]);return this},d.prototype.close=function(){return this.websocket.close(),this},d.prototype.onError=function(a){this.socket.onError(a)},d.prototype.scheme=function(){return this.socket.options.secure?"wss":"ws"},d.check=function(){return"WebSocket"in c&&!("__addTask"in WebSocket)||"MozWebSocket"in c},d.xdomainCheck=function(){return!0},b.transports.push("websocket")}("undefined"!=typeof io?io.Transport:module.exports,"undefined"!=typeof io?io:module.parent.exports,this),function(a,b){function c(){b.Transport.websocket.apply(this,arguments)}a.flashsocket=c,b.util.inherit(c,b.Transport.websocket),c.prototype.name="flashsocket",c.prototype.open=function(){var a=this,c=arguments;return WebSocket.__addTask(function(){b.Transport.websocket.prototype.open.apply(a,c)}),this},c.prototype.send=function(){var a=this,c=arguments;return WebSocket.__addTask(function(){b.Transport.websocket.prototype.send.apply(a,c)}),this},c.prototype.close=function(){return WebSocket.__tasks.length=0,b.Transport.websocket.prototype.close.call(this),this},c.prototype.ready=function(a,d){function e(){var b=a.options,e=b["flash policy port"],g=["http"+(b.secure?"s":"")+":/",b.host+":"+b.port,b.resource,"static/flashsocket","WebSocketMain"+(a.isXDomain()?"Insecure":"")+".swf"];c.loaded||(typeof WEB_SOCKET_SWF_LOCATION=="undefined"&&(WEB_SOCKET_SWF_LOCATION=g.join("/")),e!==843&&WebSocket.loadFlashPolicyFile("xmlsocket://"+b.host+":"+e),WebSocket.__initialize(),c.loaded=!0),d.call(f)}var f=this;if(document.body)return e();b.util.load(e)},c.check=function(){return typeof WebSocket!="undefined"&&"__initialize"in WebSocket&&!!swfobject?swfobject.getFlashPlayerVersion().major>=10:!1},c.xdomainCheck=function(){return!0},typeof window!="undefined"&&(WEB_SOCKET_DISABLE_AUTO_INITIALIZATION=!0),b.transports.push("flashsocket")}("undefined"!=typeof io?io.Transport:module.exports,"undefined"!=typeof io?io:module.parent.exports);if("undefined"!=typeof window)var swfobject=function(){function A(){if(t)return;try{var a=i.getElementsByTagName("body")[0].appendChild(Q("span"));a.parentNode.removeChild(a)}catch(b){return}t=!0;var c=l.length;for(var d=0;d<c;d++)l[d]()}function B(a){t?a():l[l.length]=a}function C(b){if(typeof h.addEventListener!=a)h.addEventListener("load",b,!1);else if(typeof i.addEventListener!=a)i.addEventListener("load",b,!1);else if(typeof h.attachEvent!=a)R(h,"onload",b);else if(typeof h.onload=="function"){var c=h.onload;h.onload=function(){c(),b()}}else h.onload=b}function D(){k?E():F()}function E(){var c=i.getElementsByTagName("body")[0],d=Q(b);d.setAttribute("type",e);var f=c.appendChild(d);if(f){var g=0;(function(){if(typeof f.GetVariable!=a){var b=f.GetVariable("$version");b&&(b=b.split(" ")[1].split(","),y.pv=[parseInt(b[0],10),parseInt(b[1],10),parseInt(b[2],10)])}else if(g<10){g++,setTimeout(arguments.callee,10);return}c.removeChild(d),f=null,F()})()}else F()}function F(){var b=m.length;if(b>0)for(var c=0;c<b;c++){var d=m[c].id,e=m[c].callbackFn,f={success:!1,id:d};if(y.pv[0]>0){var g=P(d);if(g)if(S(m[c].swfVersion)&&!(y.wk&&y.wk<312))U(d,!0),e&&(f.success=!0,f.ref=G(d),e(f));else if(m[c].expressInstall&&H()){var h={};h.data=m[c].expressInstall,h.width=g.getAttribute("width")||"0",h.height=g.getAttribute("height")||"0",g.getAttribute("class")&&(h.styleclass=g.getAttribute("class")),g.getAttribute("align")&&(h.align=g.getAttribute("align"));var i={},j=g.getElementsByTagName("param"),k=j.length;for(var l=0;l<k;l++)j[l].getAttribute("name").toLowerCase()!="movie"&&(i[j[l].getAttribute("name")]=j[l].getAttribute("value"));I(h,i,d,e)}else J(g),e&&e(f)}else{U(d,!0);if(e){var n=G(d);n&&typeof n.SetVariable!=a&&(f.success=!0,f.ref=n),e(f)}}}}function G(c){var d=null,e=P(c);if(e&&e.nodeName=="OBJECT")if(typeof e.SetVariable!=a)d=e;else{var f=e.getElementsByTagName(b)[0];f&&(d=f)}return d}function H(){return!u&&S("6.0.65")&&(y.win||y.mac)&&!(y.wk&&y.wk<312)}function I(b,c,d,e){u=!0,r=e||null,s={success:!1,id:d};var g=P(d);if(g){g.nodeName=="OBJECT"?(p=K(g),q=null):(p=g,q=d),b.id=f;if(typeof b.width==a||!/%$/.test(b.width)&&parseInt(b.width,10)<310)b.width="310";if(typeof b.height==a||!/%$/.test(b.height)&&parseInt(b.height,10)<137)b.height="137";i.title=i.title.slice(0,47)+" - Flash Player Installation";var j=y.ie&&y.win?["Active"].concat("").join("X"):"PlugIn",k="MMredirectURL="+h.location.toString().replace(/&/g,"%26")+"&MMplayerType="+j+"&MMdoctitle="+i.title;typeof c.flashvars!=a?c.flashvars+="&"+k:c.flashvars=k;if(y.ie&&y.win&&g.readyState!=4){var l=Q("div");d+="SWFObjectNew",l.setAttribute("id",d),g.parentNode.insertBefore(l,g),g.style.display="none",function(){g.readyState==4?g.parentNode.removeChild(g):setTimeout(arguments.callee,10)}()}L(b,c,d)}}function J(a){if(y.ie&&y.win&&a.readyState!=4){var b=Q("div");a.parentNode.insertBefore(b,a),b.parentNode.replaceChild(K(a),b),a.style.display="none",function(){a.readyState==4?a.parentNode.removeChild(a):setTimeout(arguments.callee,10)}()}else a.parentNode.replaceChild(K(a),a)}function K(a){var c=Q("div");if(y.win&&y.ie)c.innerHTML=a.innerHTML;else{var d=a.getElementsByTagName(b)[0];if(d){var e=d.childNodes;if(e){var f=e.length;for(var g=0;g<f;g++)(e[g].nodeType!=1||e[g].nodeName!="PARAM")&&e[g].nodeType!=8&&c.appendChild(e[g].cloneNode(!0))}}}return c}function L(c,d,f){var g,h=P(f);if(y.wk&&y.wk<312)return g;if(h){typeof c.id==a&&(c.id=f);if(y.ie&&y.win){var i="";for(var j in c)c[j]!=Object.prototype[j]&&(j.toLowerCase()=="data"?d.movie=c[j]:j.toLowerCase()=="styleclass"?i+=' class="'+c[j]+'"':j.toLowerCase()!="classid"&&(i+=" "+j+'="'+c[j]+'"'));var k="";for(var l in d)d[l]!=Object.prototype[l]&&(k+='<param name="'+l+'" value="'+d[l]+'" />');h.outerHTML='<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"'+i+">"+k+"</object>",n[n.length]=c.id,g=P(c.id)}else{var m=Q(b);m.setAttribute("type",e);for(var o in c)c[o]!=Object.prototype[o]&&(o.toLowerCase()=="styleclass"?m.setAttribute("class",c[o]):o.toLowerCase()!="classid"&&m.setAttribute(o,c[o]));for(var p in d)d[p]!=Object.prototype[p]&&p.toLowerCase()!="movie"&&M(m,p,d[p]);h.parentNode.replaceChild(m,h),g=m}}return g}function M(a,b,c){var d=Q("param");d.setAttribute("name",b),d.setAttribute("value",c),a.appendChild(d)}function N(a){var b=P(a);b&&b.nodeName=="OBJECT"&&(y.ie&&y.win?(b.style.display="none",function(){b.readyState==4?O(a):setTimeout(arguments.callee,10)}()):b.parentNode.removeChild(b))}function O(a){var b=P(a);if(b){for(var c in b)typeof b[c]=="function"&&(b[c]=null);b.parentNode.removeChild(b)}}function P(a){var b=null;try{b=i.getElementById(a)}catch(c){}return b}function Q(a){return i.createElement(a)}function R(a,b,c){a.attachEvent(b,c),o[o.length]=[a,b,c]}function S(a){var b=y.pv,c=a.split(".");return c[0]=parseInt(c[0],10),c[1]=parseInt(c[1],10)||0,c[2]=parseInt(c[2],10)||0,b[0]>c[0]||b[0]==c[0]&&b[1]>c[1]||b[0]==c[0]&&b[1]==c[1]&&b[2]>=c[2]?!0:!1}function T(c,d,e,f){if(y.ie&&y.mac)return;var g=i.getElementsByTagName("head")[0];if(!g)return;var h=e&&typeof e=="string"?e:"screen";f&&(v=null,w=null);if(!v||w!=h){var j=Q("style");j.setAttribute("type","text/css"),j.setAttribute("media",h),v=g.appendChild(j),y.ie&&y.win&&typeof i.styleSheets!=a&&i.styleSheets.length>0&&(v=i.styleSheets[i.styleSheets.length-1]),w=h}y.ie&&y.win?v&&typeof v.addRule==b&&v.addRule(c,d):v&&typeof i.createTextNode!=a&&v.appendChild(i.createTextNode(c+" {"+d+"}"))}function U(a,b){if(!x)return;var c=b?"visible":"hidden";t&&P(a)?P(a).style.visibility=c:T("#"+a,"visibility:"+c)}function V(b){var c=/[\\\"<>\.;]/,d=c.exec(b)!=null;return d&&typeof encodeURIComponent!=a?encodeURIComponent(b):b}var a="undefined",b="object",c="Shockwave Flash",d="ShockwaveFlash.ShockwaveFlash",e="application/x-shockwave-flash",f="SWFObjectExprInst",g="onreadystatechange",h=window,i=document,j=navigator,k=!1,l=[D],m=[],n=[],o=[],p,q,r,s,t=!1,u=!1,v,w,x=!0,y=function(){var f=typeof i.getElementById!=a&&typeof i.getElementsByTagName!=a&&typeof i.createElement!=a,g=j.userAgent.toLowerCase(),l=j.platform.toLowerCase(),m=l?/win/.test(l):/win/.test(g),n=l?/mac/.test(l):/mac/.test(g),o=/webkit/.test(g)?parseFloat(g.replace(/^.*webkit\/(\d+(\.\d+)?).*$/,"$1")):!1,p=!1,q=[0,0,0],r=null;if(typeof j.plugins!=a&&typeof j.plugins[c]==b)r=j.plugins[c].description,r&&(typeof j.mimeTypes==a||!j.mimeTypes[e]||!!j.mimeTypes[e].enabledPlugin)&&(k=!0,p=!1,r=r.replace(/^.*\s+(\S+\s+\S+$)/,"$1"),q[0]=parseInt(r.replace(/^(.*)\..*$/,"$1"),10),q[1]=parseInt(r.replace(/^.*\.(.*)\s.*$/,"$1"),10),q[2]=/[a-zA-Z]/.test(r)?parseInt(r.replace(/^.*[a-zA-Z]+(.*)$/,"$1"),10):0);else if(typeof h[["Active"].concat("Object").join("X")]!=a)try{var s=new(window[["Active"].concat("Object").join("X")])(d);s&&(r=s.GetVariable("$version"),r&&(p=!0,r=r.split(" ")[1].split(","),q=[parseInt(r[0],10),parseInt(r[1],10),parseInt(r[2],10)]))}catch(t){}return{w3:f,pv:q,wk:o,ie:p,win:m,mac:n}}(),z=function(){if(!y.w3)return;(typeof i.readyState!=a&&i.readyState=="complete"||typeof i.readyState==a&&(i.getElementsByTagName("body")[0]||i.body))&&A(),t||(typeof i.addEventListener!=a&&i.addEventListener("DOMContentLoaded",A,!1),y.ie&&y.win&&(i.attachEvent(g,function(){i.readyState=="complete"&&(i.detachEvent(g,arguments.callee),A())}),h==top&&function(){if(t)return;try{i.documentElement.doScroll("left")}catch(a){setTimeout(arguments.callee,0);return}A()}()),y.wk&&function(){if(t)return;if(!/loaded|complete/.test(i.readyState)){setTimeout(arguments.callee,0);return}A()}(),C(A))}(),W=function(){y.ie&&y.win&&window.attachEvent("onunload",function(){var a=o.length;for(var b=0;b<a;b++)o[b][0].detachEvent(o[b][1],o[b][2]);var c=n.length;for(var d=0;d<c;d++)N(n[d]);for(var e in y)y[e]=null;y=null;for(var f in swfobject)swfobject[f]=null;swfobject=null})}();return{registerObject:function(a,b,c,d){if(y.w3&&a&&b){var e={};e.id=a,e.swfVersion=b,e.expressInstall=c,e.callbackFn=d,m[m.length]=e,U(a,!1)}else d&&d({success:!1,id:a})},getObjectById:function(a){if(y.w3)return G(a)},embedSWF:function(c,d,e,f,g,h,i,j,k,l){var m={success:!1,id:d};y.w3&&!(y.wk&&y.wk<312)&&c&&d&&e&&f&&g?(U(d,!1),B(function(){e+="",f+="";var n={};if(k&&typeof k===b)for(var o in k)n[o]=k[o];n.data=c,n.width=e,n.height=f;var p={};if(j&&typeof j===b)for(var q in j)p[q]=j[q];if(i&&typeof i===b)for(var r in i)typeof p.flashvars!=a?p.flashvars+="&"+r+"="+i[r]:p.flashvars=r+"="+i[r];if(S(g)){var s=L(n,p,d);n.id==d&&U(d,!0),m.success=!0,m.ref=s}else{if(h&&H()){n.data=h,I(n,p,d,l);return}U(d,!0)}l&&l(m)})):l&&l(m)},switchOffAutoHideShow:function(){x=!1},ua:y,getFlashPlayerVersion:function(){return{major:y.pv[0],minor:y.pv[1],release:y.pv[2]}},hasFlashPlayerVersion:S,createSWF:function(a,b,c){return y.w3?L(a,b,c):undefined},showExpressInstall:function(a,b,c,d){y.w3&&H()&&I(a,b,c,d)},removeSWF:function(a){y.w3&&N(a)},createCSS:function(a,b,c,d){y.w3&&T(a,b,c,d)},addDomLoadEvent:B,addLoadEvent:C,getQueryParamValue:function(a){var b=i.location.search||i.location.hash;if(b){/\?/.test(b)&&(b=b.split("?")[1]);if(a==null)return V(b);var c=b.split("&");for(var d=0;d<c.length;d++)if(c[d].substring(0,c[d].indexOf("="))==a)return V(c[d].substring(c[d].indexOf("=")+1))}return""},expressInstallCallback:function(){if(u){var a=P(f);a&&p&&(a.parentNode.replaceChild(p,a),q&&(U(q,!0),y.ie&&y.win&&(p.style.display="block")),r&&r(s)),u=!1}}}}();(function(){if("undefined"==typeof window||window.WebSocket)return;var a=window.console;if(!a||!a.log||!a.error)a={log:function(){},error:function(){}};if(!swfobject.hasFlashPlayerVersion("10.0.0")){a.error("Flash Player >= 10.0.0 is required.");return}location.protocol=="file:"&&a.error("WARNING: web-socket-js doesn't work in file:///... URL unless you set Flash Security Settings properly. Open the page via Web server i.e. http://..."),WebSocket=function(a,b,c,d,e){var f=this;f.__id=WebSocket.__nextId++,WebSocket.__instances[f.__id]=f,f.readyState=WebSocket.CONNECTING,f.bufferedAmount=0,f.__events={},b?typeof b=="string"&&(b=[b]):b=[],setTimeout(function(){WebSocket.__addTask(function(){WebSocket.__flash.create(f.__id,a,b,c||null,d||0,e||null)})},0)},WebSocket.prototype.send=function(a){if(this.readyState==WebSocket.CONNECTING)throw"INVALID_STATE_ERR: Web Socket connection has not been established";var b=WebSocket.__flash.send(this.__id,encodeURIComponent(a));return b<0?!0:(this.bufferedAmount+=b,!1)},WebSocket.prototype.close=function(){if(this.readyState==WebSocket.CLOSED||this.readyState==WebSocket.CLOSING)return;this.readyState=WebSocket.CLOSING,WebSocket.__flash.close(this.__id)},WebSocket.prototype.addEventListener=function(a,b,c){a in this.__events||(this.__events[a]=[]),this.__events[a].push(b)},WebSocket.prototype.removeEventListener=function(a,b,c){if(!(a in this.__events))return;var d=this.__events[a];for(var e=d.length-1;e>=0;--e)if(d[e]===b){d.splice(e,1);break}},WebSocket.prototype.dispatchEvent=function(a){var b=this.__events[a.type]||[];for(var c=0;c<b.length;++c)b[c](a);var d=this["on"+a.type];d&&d(a)},WebSocket.prototype.__handleEvent=function(a){"readyState"in a&&(this.readyState=a.readyState),"protocol"in a&&(this.protocol=a.protocol);var b;if(a.type=="open"||a.type=="error")b=this.__createSimpleEvent(a.type);else if(a.type=="close")b=this.__createSimpleEvent("close");else{if(a.type!="message")throw"unknown event type: "+a.type;var c=decodeURIComponent(a.message);b=this.__createMessageEvent("message",c)}this.dispatchEvent(b)},WebSocket.prototype.__createSimpleEvent=function(a){if(document.createEvent&&window.Event){var b=document.createEvent("Event");return b.initEvent(a,!1,!1),b}return{type:a,bubbles:!1,cancelable:!1}},WebSocket.prototype.__createMessageEvent=function(a,b){if(document.createEvent&&window.MessageEvent&&!window.opera){var c=document.createEvent("MessageEvent");return c.initMessageEvent("message",!1,!1,b,null,null,window,null),c}return{type:a,data:b,bubbles:!1,cancelable:!1}},WebSocket.CONNECTING=0,WebSocket.OPEN=1,WebSocket.CLOSING=2,WebSocket.CLOSED=3,WebSocket.__flash=null,WebSocket.__instances={},WebSocket.__tasks=[],WebSocket.__nextId=0,WebSocket.loadFlashPolicyFile=function(a){WebSocket.__addTask(function(){WebSocket.__flash.loadManualPolicyFile(a)})},WebSocket.__initialize=function(){if(WebSocket.__flash)return;WebSocket.__swfLocation&&(window.WEB_SOCKET_SWF_LOCATION=WebSocket.__swfLocation);if(!window.WEB_SOCKET_SWF_LOCATION){a.error("[WebSocket] set WEB_SOCKET_SWF_LOCATION to location of WebSocketMain.swf");return}var b=document.createElement("div");b.id="webSocketContainer",b.style.position="absolute",WebSocket.__isFlashLite()?(b.style.left="0px",b.style.top="0px"):(b.style.left="-100px",b.style.top="-100px");var c=document.createElement("div");c.id="webSocketFlash",b.appendChild(c),document.body.appendChild(b),swfobject.embedSWF(WEB_SOCKET_SWF_LOCATION,"webSocketFlash","1","1","10.0.0",null,null,{hasPriority:!0,swliveconnect:!0,allowScriptAccess:"always"},null,function(b){b.success||a.error("[WebSocket] swfobject.embedSWF failed")})},WebSocket.__onFlashInitialized=function(){setTimeout(function(){WebSocket.__flash=document.getElementById("webSocketFlash"),WebSocket.__flash.setCallerUrl(location.href),WebSocket.__flash.setDebug(!!window.WEB_SOCKET_DEBUG);for(var a=0;a<WebSocket.__tasks.length;++a)WebSocket.__tasks[a]();WebSocket.__tasks=[]},0)},WebSocket.__onFlashEvent=function(){return setTimeout(function(){try{var b=WebSocket.__flash.receiveEvents();for(var c=0;c<b.length;++c)WebSocket.__instances[b[c].webSocketId].__handleEvent(b[c])}catch(d){a.error(d)}},0),!0},WebSocket.__log=function(b){a.log(decodeURIComponent(b))},WebSocket.__error=function(b){a.error(decodeURIComponent(b))},WebSocket.__addTask=function(a){WebSocket.__flash?a():WebSocket.__tasks.push(a)},WebSocket.__isFlashLite=function(){if(!window.navigator||!window.navigator.mimeTypes)return!1;var a=window.navigator.mimeTypes["application/x-shockwave-flash"];return!a||!a.enabledPlugin||!a.enabledPlugin.filename?!1:a.enabledPlugin.filename.match(/flashlite/i)?!0:!1},window.WEB_SOCKET_DISABLE_AUTO_INITIALIZATION||(window.addEventListener?window.addEventListener("load",function(){WebSocket.__initialize()},!1):window.attachEvent("onload",function(){WebSocket.__initialize()}))})(),function(a,b,c){function d(a){if(!a)return;b.Transport.apply(this,arguments),this.sendBuffer=[]}function e(){}a.XHR=d,b.util.inherit(d,b.Transport),d.prototype.open=function(){return this.socket.setBuffer(!1),this.onOpen(),this.get(),this.setCloseTimeout(),this},d.prototype.payload=function(a){var c=[];for(var d=0,e=a.length;d<e;d++)c.push(b.parser.encodePacket(a[d]));this.send(b.parser.encodePayload(c))},d.prototype.send=function(a){return this.post(a),this},d.prototype.post=function(a){function d(){this.readyState==4&&(this.onreadystatechange=e,b.posting=!1,this.status==200?b.socket.setBuffer(!1):b.onClose())}function f(){this.onload=e,b.socket.setBuffer(!1)}var b=this;this.socket.setBuffer(!0),this.sendXHR=this.request("POST"),c.XDomainRequest&&this.sendXHR instanceof XDomainRequest?this.sendXHR.onload=this.sendXHR.onerror=f:this.sendXHR.onreadystatechange=d,this.sendXHR.send(a)},d.prototype.close=function(){return this.onClose(),this},d.prototype.request=function(a){var c=b.util.request(this.socket.isXDomain()),d=b.util.query(this.socket.options.query,"t="+ +(new Date));c.open(a||"GET",this.prepareUrl()+d,!0);if(a=="POST")try{c.setRequestHeader?c.setRequestHeader("Content-type","text/plain;charset=UTF-8"):c.contentType="text/plain"}catch(e){}return c},d.prototype.scheme=function(){return this.socket.options.secure?"https":"http"},d.check=function(a,d){try{var e=b.util.request(d),f=c.XDomainRequest&&e instanceof XDomainRequest,g=a&&a.options&&a.options.secure?"https:":"http:",h=c.location&&g!=c.location.protocol;if(e&&(!f||!h))return!0}catch(i){}return!1},d.xdomainCheck=function(a){return d.check(a,!0)}}("undefined"!=typeof io?io.Transport:module.exports,"undefined"!=typeof io?io:module.parent.exports,this),function(a,b){function c(a){b.Transport.XHR.apply(this,arguments)}a.htmlfile=c,b.util.inherit(c,b.Transport.XHR),c.prototype.name="htmlfile",c.prototype.get=function(){this.doc=new(window[["Active"].concat("Object").join("X")])("htmlfile"),this.doc.open(),this.doc.write("<html></html>"),this.doc.close(),this.doc.parentWindow.s=this;var a=this.doc.createElement("div");a.className="socketio",this.doc.body.appendChild(a),this.iframe=this.doc.createElement("iframe"),a.appendChild(this.iframe);var c=this,d=b.util.query(this.socket.options.query,"t="+ +(new Date));this.iframe.src=this.prepareUrl()+d,b.util.on(window,"unload",function(){c.destroy()})},c.prototype._=function(a,b){a=a.replace(/\\\//g,"/"),this.onData(a);try{var c=b.getElementsByTagName("script")[0];c.parentNode.removeChild(c)}catch(d){}},c.prototype.destroy=function(){if(this.iframe){try{this.iframe.src="about:blank"}catch(a){}this.doc=null,this.iframe.parentNode.removeChild(this.iframe),this.iframe=null,CollectGarbage()}},c.prototype.close=function(){return this.destroy(),b.Transport.XHR.prototype.close.call(this)},c.check=function(a){if(typeof window!="undefined"&&["Active"].concat("Object").join("X")in window)try{var c=new(window[["Active"].concat("Object").join("X")])("htmlfile");return c&&b.Transport.XHR.check(a)}catch(d){}return!1},c.xdomainCheck=function(){return!1},b.transports.push("htmlfile")}("undefined"!=typeof io?io.Transport:module.exports,"undefined"!=typeof io?io:module.parent.exports),function(a,b,c){function d(){b.Transport.XHR.apply(this,arguments)}function e(){}a["xhr-polling"]=d,b.util.inherit(d,b.Transport.XHR),b.util.merge(d,b.Transport.XHR),d.prototype.name="xhr-polling",d.prototype.heartbeats=function(){return!1},d.prototype.open=function(){var a=this;return b.Transport.XHR.prototype.open.call(a),!1},d.prototype.get=function(){function b(){this.readyState==4&&(this.onreadystatechange=e,this.status==200?(a.onData(this.responseText),a.get()):a.onClose())}function d(){this.onload=e,this.onerror=e,a.retryCounter=1,a.onData(this.responseText),a.get()}function f(){a.retryCounter++,!a.retryCounter||a.retryCounter>3?a.onClose():a.get()}if(!this.isOpen)return;var a=this;this.xhr=this.request(),c.XDomainRequest&&this.xhr instanceof XDomainRequest?(this.xhr.onload=d,this.xhr.onerror=f):this.xhr.onreadystatechange=b,this.xhr.send(null)},d.prototype.onClose=function(){b.Transport.XHR.prototype.onClose.call(this);if(this.xhr){this.xhr.onreadystatechange=this.xhr.onload=this.xhr.onerror=e;try{this.xhr.abort()}catch(a){}this.xhr=null}},d.prototype.ready=function(a,c){var d=this;b.util.defer(function(){c.call(d)})},b.transports.push("xhr-polling")}("undefined"!=typeof io?io.Transport:module.exports,"undefined"!=typeof io?io:module.parent.exports,this),function(a,b,c){function e(a){b.Transport["xhr-polling"].apply(this,arguments),this.index=b.j.length;var c=this;b.j.push(function(a){c._(a)})}var d=c.document&&"MozAppearance"in c.document.documentElement.style;a["jsonp-polling"]=e,b.util.inherit(e,b.Transport["xhr-polling"]),e.prototype.name="jsonp-polling",e.prototype.post=function(a){function i(){j(),c.socket.setBuffer(!1)}function j(){c.iframe&&c.form.removeChild(c.iframe);try{h=document.createElement('<iframe name="'+c.iframeId+'">')}catch(a){h=document.createElement("iframe"),h.name=c.iframeId}h.id=c.iframeId,c.form.appendChild(h),c.iframe=h}var c=this,d=b.util.query(this.socket.options.query,"t="+ +(new Date)+"&i="+this.index);if(!this.form){var e=document.createElement("form"),f=document.createElement("textarea"),g=this.iframeId="socketio_iframe_"+this.index,h;e.className="socketio",e.style.position="absolute",e.style.top="0px",e.style.left="0px",e.style.display="none",e.target=g,e.method="POST",e.setAttribute("accept-charset","utf-8"),f.name="d",e.appendChild(f),document.body.appendChild(e),this.form=e,this.area=f}this.form.action=this.prepareUrl()+d,j(),this.area.value=b.JSON.stringify(a);try{this.form.submit()}catch(k){}this.iframe.attachEvent?h.onreadystatechange=function(){c.iframe.readyState=="complete"&&i()}:this.iframe.onload=i,this.socket.setBuffer(!0)},e.prototype.get=function(){var a=this,c=document.createElement("script"),e=b.util.query(this.socket.options.query,"t="+ +(new Date)+"&i="+this.index);this.script&&(this.script.parentNode.removeChild(this.script),this.script=null),c.async=!0,c.src=this.prepareUrl()+e,c.onerror=function(){a.onClose()};var f=document.getElementsByTagName("script")[0];f.parentNode.insertBefore(c,f),this.script=c,d&&setTimeout(function(){var a=document.createElement("iframe");document.body.appendChild(a),document.body.removeChild(a)},100)},e.prototype._=function(a){return this.onData(a),this.isOpen&&this.get(),this},e.prototype.ready=function(a,c){var e=this;if(!d)return c.call(this);b.util.load(function(){c.call(e)})},e.check=function(){return"document"in c},e.xdomainCheck=function(){return!0},b.transports.push("jsonp-polling")}("undefined"!=typeof io?io.Transport:module.exports,"undefined"!=typeof io?io:module.parent.exports,this),typeof define=="function"&&define.amd&&define([],function(){return io})})();

/**
 * sails.io.js
 * ------------------------------------------------------------------------
 * JavaScript Client (SDK) for communicating with Sails.
 *
 * Note that this script is completely optional, but it is handy if you're
 * using WebSockets from the browser to talk to your Sails server.
 *
 * For tips and documentation, visit:
 * http://sailsjs.org/#!documentation/reference/BrowserSDK/BrowserSDK.html
 * ------------------------------------------------------------------------
 *
 * This file allows you to send and receive socket.io messages to & from Sails
 * by simulating a REST client interface on top of socket.io. It models its API
 * after the $.ajax pattern from jQuery you might already be familiar with.
 *
 * So if you're switching from using AJAX to sockets, instead of:
 *    `$.post( url, [data], [cb] )`
 *
 * You would use:
 *    `socket.post( url, [data], [cb] )`
 */


(function() {

  // Save the URL that this script was fetched from for use below.
  // (skip this if this SDK is being used outside of the DOM, i.e. in a Node process)
  var urlThisScriptWasFetchedFrom = (function() {
    if (
      typeof window !== 'object' ||
      typeof window.document !== 'object' ||
      typeof window.document.getElementsByTagName !== 'function'
    ) {
      return '';
    }

    // Return the URL of the last script loaded (i.e. this one)
    // (this must run before nextTick; see http://stackoverflow.com/a/2976714/486547)
    var allScriptsCurrentlyInDOM = window.document.getElementsByTagName('script');
    var thisScript = allScriptsCurrentlyInDOM[allScriptsCurrentlyInDOM.length - 1];
    return thisScript.src;
  })();

  // Constants
  var CONNECTION_METADATA_PARAMS = {
    version: '__sails_io_sdk_version',
    platform: '__sails_io_sdk_platform',
    language: '__sails_io_sdk_language'
  };

  // Current version of this SDK (sailsDK?!?!) and other metadata
  // that will be sent along w/ the initial connection request.
  var SDK_INFO = {
    version: '0.10.0', // TODO: pull this automatically from package.json during build.
    platform: typeof module === 'undefined' ? 'browser' : 'node',
    language: 'javascript'
  };
  SDK_INFO.versionString =
    CONNECTION_METADATA_PARAMS.version + '=' + SDK_INFO.version + '&' +
    CONNECTION_METADATA_PARAMS.platform + '=' + SDK_INFO.platform + '&' +
    CONNECTION_METADATA_PARAMS.language + '=' + SDK_INFO.language;


  // In case you're wrapping the socket.io client to prevent pollution of the
  // global namespace, you can pass in your own `io` to replace the global one.
  // But we still grab access to the global one if it's available here:
  var _io = (typeof io !== 'undefined') ? io : null;

  /**
   * Augment the `io` object passed in with methods for talking and listening
   * to one or more Sails backend(s).  Automatically connects a socket and
   * exposes it on `io.socket`.  If a socket tries to make requests before it
   * is connected, the sails.io.js client will queue it up.
   *
   * @param {SocketIO} io
   */

  function SailsIOClient(io) {

    // Prefer the passed-in `io` instance, but also use the global one if we've got it.
    io = io || _io;

    // If the socket.io client is not available, none of this will work.
    if (!io) throw new Error('`sails.io.js` requires a socket.io client, but `io` was not passed in.');



    //////////////////////////////////////////////////////////////
    /////                              ///////////////////////////
    ///// PRIVATE METHODS/CONSTRUCTORS ///////////////////////////
    /////                              ///////////////////////////
    //////////////////////////////////////////////////////////////

    /**
     * TmpSocket
     *
     * A mock Socket used for binding events before the real thing
     * has been instantiated (since we need to use io.connect() to
     * instantiate the real thing, which would kick off the connection
     * process w/ the server, and we don't necessarily have the valid
     * configuration to know WHICH SERVER to talk to yet.)
     *
     * @api private
     * @constructor
     */

    function TmpSocket() {
      var boundEvents = {};
      this.on = function (evName, fn) {
        boundEvents[evName] = fn;
        return this;
      };
      this.become = function(actualSocket) {

        // Pass events and a reference to the request queue
        // off to the actualSocket for consumption
        for (var evName in boundEvents) {
          actualSocket.on(evName, boundEvents[evName]);
        }
        actualSocket.requestQueue = this.requestQueue;

        // Bind a one-time function to run the request queue
        // when the actualSocket connects.
        if (!_isConnected(actualSocket)) {
          var alreadyRanRequestQueue = false;
          actualSocket.on('connect', function onActualSocketConnect() {
            if (alreadyRanRequestQueue) return;
            runRequestQueue(actualSocket);
            alreadyRanRequestQueue = true;
          });
        }
        // Or run it immediately if actualSocket is already connected
        else {
          runRequestQueue(actualSocket);
        }

        return actualSocket;
      };

      // Uses `this` instead of `TmpSocket.prototype` purely
      // for convenience, since it makes more sense to attach
      // our extra methods to the `Socket` prototype down below.
      // This could be optimized by moving those Socket method defs
      // to the top of this SDK file instead of the bottom.  Will
      // gladly do it if it is an issue for anyone.
      this.get = Socket.prototype.get;
      this.post = Socket.prototype.post;
      this.put = Socket.prototype.put;
      this['delete'] = Socket.prototype['delete'];
      this.request = Socket.prototype.request;
      this._request = Socket.prototype._request;
    }



    /**
     * A little logger for this library to use internally.
     * Basically just a wrapper around `console.log` with
     * support for feature-detection.
     *
     * @api private
     * @factory
     */
    function LoggerFactory(options) {
      options = options || {
        prefix: true
      };

      // If `console.log` is not accessible, `log` is a noop.
      if (
        typeof console !== 'object' ||
        typeof console.log !== 'function' ||
        typeof console.log.bind !== 'function'
      ) {
        return function noop() {};
      }

      return function log() {
        var args = Array.prototype.slice.call(arguments);

        // All logs are disabled when `io.sails.environment = 'production'`.
        if (io.sails.environment === 'production') return;

        // Add prefix to log messages (unless disabled)
        var PREFIX = '';
        if (options.prefix) {
          args.unshift(PREFIX);
        }

        // Call wrapped logger
        console.log
          .bind(console)
          .apply(this, args);
      };
    }

    // Create a private logger instance
    var consolog = LoggerFactory();
    consolog.noPrefix = LoggerFactory({
      prefix: false
    });



    /**
     * _isConnected
     *
     * @api private
     * @param  {Socket}  socket
     * @return {Boolean} whether the socket is connected and able to
     *                           communicate w/ the server.
     */

    function _isConnected(socket) {
      return socket.socket && socket.socket.connected;
    }



    /**
     * What is the `requestQueue`?
     * 
     * The request queue is used to simplify app-level connection logic--
     * i.e. so you don't have to wait for the socket to be connected
     * to start trying to  synchronize data.
     * 
     * @api private
     * @param  {Socket}  socket
     */

    function runRequestQueue (socket) {
      var queue = socket.requestQueue;

      if (!queue) return;
      for (var i in queue) {

        // Double-check that `queue[i]` will not
        // inadvertently discover extra properties attached to the Object
        // and/or Array prototype by other libraries/frameworks/tools.
        // (e.g. Ember does this. See https://github.com/balderdashy/sails.io.js/pull/5)
        var isSafeToDereference = ({}).hasOwnProperty.call(queue, i);
        if (isSafeToDereference) {
          // Emit the request.
          _emitFrom(socket, queue[i]);
        }
      }
    }



    /**
     * Send an AJAX request.
     * 
     * @param  {Object}   opts [optional]
     * @param  {Function} cb
     * @return {XMLHttpRequest}
     */

    function ajax(opts, cb) {
      opts = opts || {};
      var xmlhttp;

      if (typeof window === 'undefined') {
        // TODO: refactor node usage to live in here
        return cb();
      }

      if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
      } else {
        // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
      }

      xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
          cb(xmlhttp.responseText);
        }
      };

      xmlhttp.open(opts.method, opts.url, true);
      xmlhttp.send();
      return xmlhttp;
    }



    /**
     * The JWR (JSON WebSocket Response) received from a Sails server.
     *
     * @api private
     * @param  {Object}  responseCtx
     *         => :body
     *         => :statusCode
     *         => :headers
     * @constructor
     */

    function JWR(responseCtx) {
      this.body = responseCtx.body || {};
      this.headers = responseCtx.headers || {};
      this.statusCode = responseCtx.statusCode || 200;
    }
    JWR.prototype.toString = function() {
      return '[ResponseFromSails]' + '  -- ' +
        'Status: ' + this.statusCode + '  -- ' +
        'Headers: ' + this.headers + '  -- ' +
        'Body: ' + this.body;
    };
    JWR.prototype.toPOJO = function() {
      return {
        body: this.body,
        headers: this.headers,
        statusCode: this.statusCode
      };
    };
    JWR.prototype.pipe = function() {
      // TODO: look at substack's stuff
      return new Error('Not implemented yet.');
    };


    /**
     * @api private
     * @param  {Socket} socket  [description]
     * @param  {Object} requestCtx [description]
     */

    function _emitFrom(socket, requestCtx) {

      // Since callback is embedded in requestCtx,
      // retrieve it and delete the key before continuing.
      var cb = requestCtx.cb;
      delete requestCtx.cb;


      // Name of socket request listener on the server
      // ( === the request method, e.g. 'get', 'post', 'put', etc. )
      var sailsEndpoint = requestCtx.method;
      socket.emit(sailsEndpoint, requestCtx, function serverResponded(responseCtx) {

        // Adds backwards-compatibility for 0.9.x projects
        // If `responseCtx.body` does not exist, the entire
        // `responseCtx` object must actually be the `body`.
        var body;
        if (!responseCtx.body) {
          body = responseCtx;
        } else {
          body = responseCtx.body;
        }

        // Send back (emulatedHTTPBody, jsonWebSocketResponse)
        if (cb) {
          cb(body, new JWR(responseCtx));
        }
      });
    }

    //////////////////////////////////////////////////////////////
    ///// </PRIVATE METHODS/CONSTRUCTORS> ////////////////////////
    //////////////////////////////////////////////////////////////



    // We'll be adding methods to `io.SocketNamespace.prototype`, the prototype for the 
    // Socket instance returned when the browser connects with `io.connect()`
    var Socket = io.SocketNamespace;



    /**
     * Simulate a GET request to sails
     * e.g.
     *    `socket.get('/user/3', Stats.populate)`
     *
     * @api public
     * @param {String} url    ::    destination URL
     * @param {Object} params ::    parameters to send with the request [optional]
     * @param {Function} cb   ::    callback function to call when finished [optional]
     */

    Socket.prototype.get = function(url, data, cb) {

      // `data` is optional
      if (typeof data === 'function') {
        cb = data;
        data = {};
      }

      return this._request({
        method: 'get',
        data: data,
        url: url
      }, cb);
    };



    /**
     * Simulate a POST request to sails
     * e.g.
     *    `socket.post('/event', newMeeting, $spinner.hide)`
     *
     * @api public
     * @param {String} url    ::    destination URL
     * @param {Object} params ::    parameters to send with the request [optional]
     * @param {Function} cb   ::    callback function to call when finished [optional]
     */

    Socket.prototype.post = function(url, data, cb) {

      // `data` is optional
      if (typeof data === 'function') {
        cb = data;
        data = {};
      }

      return this._request({
        method: 'post',
        data: data,
        url: url
      }, cb);
    };



    /**
     * Simulate a PUT request to sails
     * e.g.
     *    `socket.post('/event/3', changedFields, $spinner.hide)`
     *
     * @api public
     * @param {String} url    ::    destination URL
     * @param {Object} params ::    parameters to send with the request [optional]
     * @param {Function} cb   ::    callback function to call when finished [optional]
     */

    Socket.prototype.put = function(url, data, cb) {

      // `data` is optional
      if (typeof data === 'function') {
        cb = data;
        data = {};
      }

      return this._request({
        method: 'put',
        data: data,
        url: url
      }, cb);
    };



    /**
     * Simulate a DELETE request to sails
     * e.g.
     *    `socket.delete('/event', $spinner.hide)`
     *
     * @api public
     * @param {String} url    ::    destination URL
     * @param {Object} params ::    parameters to send with the request [optional]
     * @param {Function} cb   ::    callback function to call when finished [optional]
     */

    Socket.prototype['delete'] = function(url, data, cb) {

      // `data` is optional
      if (typeof data === 'function') {
        cb = data;
        data = {};
      }

      return this._request({
        method: 'delete',
        data: data,
        url: url
      }, cb);
    };



    /**
     * Simulate an HTTP request to sails
     * e.g.
     *    `socket.request('/user', newUser, $spinner.hide, 'post')`
     *
     * @api public
     * @param {String} url    ::    destination URL
     * @param {Object} params ::    parameters to send with the request [optional]
     * @param {Function} cb   ::    callback function to call when finished [optional]
     * @param {String} method ::    HTTP request method [optional]
     */

    Socket.prototype.request = function(url, data, cb, method) {

      // `cb` is optional
      if (typeof cb === 'string') {
        method = cb;
        cb = null;
      }

      // `data` is optional
      if (typeof data === 'function') {
        cb = data;
        data = {};
      }

      return this._request({
        method: method || 'get',
        data: data,
        url: url
      }, cb);
    };



    /**
     * Socket.prototype._request
     *
     * Simulate HTTP over Socket.io.
     *
     * @api private
     * @param  {[type]}   options [description]
     * @param  {Function} cb      [description]
     */
    Socket.prototype._request = function(options, cb) {

      // Sanitize options (also data & headers)
      var usage = 'Usage:\n socket.' +
        (options.method || 'request') +
        '( destinationURL, [dataToSend], [fnToCallWhenComplete] )';

      options = options || {};
      options.data = options.data || {};
      options.headers = options.headers || {};

      // Remove trailing slashes and spaces to make packets smaller.
      options.url = options.url.replace(/^(.+)\/*\s*$/, '$1');
      if (typeof options.url !== 'string') {
        throw new Error('Invalid or missing URL!\n' + usage);
      }

      // Build a simulated request object.
      var request = {
        method: options.method,
        data: options.data,
        url: options.url,
        headers: options.headers,
        cb: cb
      };

      // If this socket is not connected yet, queue up this request
      // instead of sending it.
      // (so it can be replayed when the socket comes online.)
      if (!_isConnected(this)) {

        // If no queue array exists for this socket yet, create it.
        this.requestQueue = this.requestQueue || [];
        this.requestQueue.push(request);
        return;
      }


      // Otherwise, our socket is ok!
      // Send the request.
      _emitFrom(this, request);
    };



    // Set a `sails` object that may be used for configuration before the
    // first socket connects (i.e. to prevent auto-connect)
    io.sails = {

      // Whether to automatically connect a socket and save it as `io.socket`.
      autoConnect: true,

      // Whether to use JSONP to get a cookie for cross-origin requests
      useCORSRouteToGetCookie: true,

      // The environment we're running in.
      // (logs are not displayed when this is set to 'production')
      // 
      // Defaults to development unless this script was fetched from a URL
      // that ends in `*.min.js` or '#production' (may also be manually overridden.)
      // 
      environment: urlThisScriptWasFetchedFrom.match(/(\#production|\.min\.js)/) ? 'production' : 'development'
    };



    /**
     * Override `io.connect` to coerce it into using the io.sails
     * connection URL config, as well as sending identifying information
     * (most importantly, the current version of this SDK)
     *
     * @param  {String} url  [optional]
     * @param  {Object} opts [optional]
     * @return {Socket}
     */
    io.sails._origConnectFn = io.connect;
    io.connect = function(url, opts) {
      opts = opts || {};

      // If explicit connection url is specified, use it
      url = url || io.sails.url || undefined;

      // Ensure URL has no trailing slash
      url = url ? url.replace(/(\/)$/, '') : undefined;

      // Mix the current SDK version into the query string in
      // the connection request to the server:
      if (typeof opts.query !== 'string') opts.query = SDK_INFO.versionString;
      else opts.query += '&' + SDK_INFO.versionString;

      return io.sails._origConnectFn(url, opts);

    };



    // io.socket
    // 
    // The eager instance of Socket which will automatically try to connect
    // using the host that this js file was served from.
    // 
    // This can be disabled or configured by setting `io.socket.options` within the
    // first cycle of the event loop.
    // 

    // In the mean time, this eager socket will be defined as a TmpSocket
    // so that events bound by the user before the first cycle of the event
    // loop (using `.on()`) can be rebound on the true socket.
    io.socket = new TmpSocket();

    setTimeout(function() {

      // If autoConnect is disabled, delete the TmpSocket and bail out.
      if (!io.sails.autoConnect) {
        delete io.socket;
        return io;
      }

      // If this is an attempt at a cross-origin or cross-port
      // socket connection, send an AJAX request first to ensure
      // that a valid cookie is available.  This can be disabled
      // by setting `io.sails.useCORSRouteToGetCookie` to false.
      var isXOrigin = io.sails.url && true; //url.match();
      // TODO: check whether the URL is cross-domain

      // var port = global.location.port || ('https:' == global.location.protocol ? 443 : 80);
      // this.options.host !== global.location.hostname || this.options.port != port;
      if (io.sails.useCORSRouteToGetCookie && isXOrigin) {

        // Figure out the x-origin CORS route
        // (Sails provides a default)
        var xOriginCookieRoute = '/__getcookie';
        if (typeof io.sails.useCORSRouteToGetCookie === 'string') {
          xOriginCookieRoute = io.sails.useCORSRouteToGetCookie;
        }

        var xOriginCookieURL = io.sails.url + xOriginCookieRoute;

        // Make the AJAX request (CORS)
        if (typeof window !== 'undefined') {

          ajax({
            url: xOriginCookieURL,
            method: 'GET'
          }, goAheadAndActuallyConnect);

        }

        // If there's no `window` object, we must be running in Node.js
        // so just require the request module and send the HTTP request that
        // way.
        else {
          var mikealsReq = require('request');
          mikealsReq.get(io.sails.url + xOriginCookieRoute, function(err, httpResponse, body) {
            if (err) {
              consolog(
                'Failed to connect socket (failed to get cookie)',
                'Error:', err
              );
              return;
            }
            goAheadAndActuallyConnect();
          });
        }
      } else goAheadAndActuallyConnect();

      // Start connecting after the current cycle of the event loop
      // has completed.
      // consolog('Auto-connecting `io.socket` to Sails... (requests will be queued in the mean-time)');
      function goAheadAndActuallyConnect() {

        // Initiate connection
        var actualSocket = io.connect(io.sails.url);

        // Replay event bindings from the existing TmpSocket
        io.socket = io.socket.become(actualSocket);


        /**
         * 'connect' event is triggered when the socket establishes a connection
         *  successfully.
         */
        io.socket.on('connect', function socketConnected() {

          consolog.noPrefix(
            '\n' +
            '    |>    ' + '\n' +
            '  \\___/  '
          );
          consolog(
            '`io.socket` connected successfully.' + '\n' +
            // 'e.g. to send a GET request to Sails via WebSockets, run:'+ '\n' +
            // '`io.socket.get("/foo", function serverRespondedWith (body, jwr) { console.log(body); })`'+ '\n' +
            ' (for help, see: http://sailsjs.org/#!documentation/reference/BrowserSDK/BrowserSDK.html)'
          );
          // consolog('(this app is running in development mode - log messages will be displayed)');


          if (!io.socket.$events.disconnect) {
            io.socket.on('disconnect', function() {
              consolog('====================================');
              consolog('io.socket was disconnected from Sails.');
              consolog('Usually, this is due to one of the following reasons:' + '\n' +
                ' -> the server ' + (io.sails.url ? io.sails.url + ' ' : '') + 'was taken down' + '\n' +
                ' -> your browser lost internet connectivity');
              consolog('====================================');
            });
          }

          if (!io.socket.$events.reconnect) {
            io.socket.on('reconnect', function(transport, numAttempts) {
              var numSecsOffline = io.socket.msSinceConnectionLost / 1000;
              consolog(
                'io.socket reconnected successfully after being offline ' +
                'for ' + numSecsOffline + ' seconds.');
            });
          }

          if (!io.socket.$events.reconnecting) {
            io.socket.on('reconnecting', function(msSinceConnectionLost, numAttempts) {
              io.socket.msSinceConnectionLost = msSinceConnectionLost;
              consolog(
                'io.socket is trying to reconnect to Sails...' +
                '(attempt #' + numAttempts + ')');
            });
          }


          // 'error' event is triggered if connection can not be established.
          // (usually because of a failed authorization, which is in turn
          // usually due to a missing or invalid cookie)
          if (!io.socket.$events.error) {
            io.socket.on('error', function failedToConnect(err) {

              // TODO:
              // handle failed connections due to failed authorization
              // in a smarter way (probably can listen for a different event)

              // A bug in Socket.io 0.9.x causes `connect_failed`
              // and `reconnect_failed` not to fire.
              // Check out the discussion in github issues for details:
              // https://github.com/LearnBoost/socket.io/issues/652
              // io.socket.on('connect_failed', function () {
              //  consolog('io.socket emitted `connect_failed`');
              // });
              // io.socket.on('reconnect_failed', function () {
              //  consolog('io.socket emitted `reconnect_failed`');
              // });

              consolog(
                'Failed to connect socket (probably due to failed authorization on server)',
                'Error:', err
              );
            });
          }
        });

      }



      // TODO:
      // Listen for a special private message on any connected that allows the server
      // to set the environment (giving us 100% certainty that we guessed right)
      // However, note that the `console.log`s called before and after connection
      // are still forced to rely on our existing heuristics (to disable, tack #production
      // onto the URL used to fetch this file.)

    }, 0); // </setTimeout>


    // Return the `io` object.
    return io;
  }


  // Add CommonJS support to allow this client SDK to be used from Node.js.
  if (typeof module === 'object' && typeof module.exports !== 'undefined') {
    module.exports = SailsIOClient;
    return SailsIOClient;
  }

  // Otherwise, try to instantiate the client:
  // In case you're wrapping the socket.io client to prevent pollution of the
  // global namespace, you can replace the global `io` with your own `io` here:
  return SailsIOClient();

})();

;(function(root) {

	var EventEmitter = function() {};

	EventEmitter.prototype.on = function(event, callback) {
		this._events = this._events || {};
		this._events[event] = this._events[event] || [];
		this._events[event].push(callback);
	};

	EventEmitter.prototype.off = function(event, callback) {
		this._events = this._events || {};
		if (event in this._events === false) return;
		this._events[event].splice(this._events[event].indexOf(callback), 1);
	};

	EventEmitter.prototype.emit = function(event /* , args... */) {
		this._events = this._events || {};
		if (event in this._events === false) return;
		for (var i = 0; i < this._events[event].length; i++){
			this._events[event][i].apply(this, Array.prototype.slice.call(arguments, 1));
		}
	};

	EventEmitter.inherits = function(object) {
		var functions = ['on', 'off', 'emit'];
		for (var i = 0; i < functions.length; i ++) {
			if (typeof object === 'function') {
				object.prototype[functions[i]] = EventEmitter.prototype[functions[i]];
			}
			else {
				object[functions[i]] = EventEmitter.prototype[functions[i]];
			}
		}
	};

	root.SensorsBox = root.SensorsBox || {};
	root.SensorsBox.EventEmitter = EventEmitter;

})(window);

;(function(root) {

	root.io.sails.autoConnect = false;

	/*
	============================
	CONNECTION INITIALIZATION
	============================
	*/

	var Connection = function(opts) {

		opts = opts || {};

		this.verbose = opts.verbose || false;

		this.host = opts.host || 'http://beta.sensorsbox.com';
		this.port = opts.port || 80;
		this.socket = root.io.connect(this.host + ':' + this.port);

		this.boxes = {};
		this.sensors = {};

		SensorsBox.EventEmitter.inherits(this);
		initSocketEvents(this);
	};

	/*
	============================
	EVENT PROPAGATION
	============================
	*/

	var initSocketEvents = function(connection) {
		connection.socket.on('connect', function(){
			if (connection.verbose) console.log('connection success');
			connection.emit('connect');
		});
		connection.socket.on('measure', function (measure) {
			if (connection.verbose) console.log(measure);
			connection.emit('measure', measure);
		});
		connection.socket.on('box', function (body) {
			if (connection.verbose) console.log(body);
			connection.boxes[body.data.id] = body.data;
			body.data.sensor.forEach(function(sensor){
				connection.sensors[sensor.id] = sensor;
			});
			connection.emit('box', body);
		});
		connection.socket.on('sensor', function (body) {
			if (connection.verbose) console.log(body);
			connection.sensors[body.data.id] = body.data;
			connection.emit('sensor', body);
		});
	};

	/*
	============================
	BOX SUBSCRIPTION
	============================
	*/

	Connection.prototype.watchBox = function(boxId, callback) {
		var _self = this;
		var route = '/api/v1/watch/box/';

		if (this.boxes[boxId]) {
			if (callback) {
				callback(new Error('You are already watching this box!'));
			}
		}
		else {
			this.socket.get(this.host + route + boxId, function(boxConfig, response){
				_self.boxes[boxId] = boxConfig;
				boxConfig.sensor.forEach(function(sensor){
					_self.sensors[sensor.id] = sensor;
				});
				if (callback) {
					callback(null, boxConfig);
				}
			});
		}
	};

	Connection.prototype.unwatchBox = function(boxId, callback) {
		var _self = this;
		var route = '/api/v1/unwatch/box/';

		if (this.boxes[boxId]) {
			this.socket.get(this.host + route + boxId, function(boxConfig, response) {
				if (_self.verbose) console.log('Unwatching all the sensors attached to the box...');
				delete _self.boxes[boxId];
				boxConfig.sensor.forEach(function(sensor){
					delete _self.sensors[sensor.id];
				});
				if (callback) {
					callback(null, boxConfig);
				}
			});
		}
		else {
			if (callback) {
				callback(new Error('You are not watching this box!'));
			}
		}
	};

	/*
	============================
	SENSOR SUBSCRIPTION
	============================
	*/

	Connection.prototype.watchSensor = function(sensorId, callback) {
		var _self = this;
		var route = '/api/v1/watch/sensor/';

		if (this.sensors[sensorId]) {
			callback(new Error('You are already watching this sensor!'));
		}
		else {
			this.socket.get(this.host + route + sensorId, function(sensorConfig, response){
				_self.sensors[sensorId] = sensorConfig;
				if (callback) {
					callback(null, sensorConfig);
				}
			});
		}
	};

	Connection.prototype.unwatchSensor = function(sensorId, callback) {
		var _self = this;
		var route = '/api/v1/unwatch/sensor/';

		if (this.sensors[sensorId]) {
			this.socket.get(this.host + route + sensorId, function(sensorConfig, response) {
				if (_self.verbose) console.log('Sensor unwatched...');
				delete _self.sensors[sensorId];
				if (callback) {
					callback(null, sensorConfig);
				}
			});
		}
		else {
			callback(new Error('You are not watching this sensor!'));
		}
	};

	root.SensorsBox = root.SensorsBox || {};
	root.SensorsBox.Connection = Connection;

})(window);
;
/*
 * slip.js: A plain JavaScript SLIP implementation that works in both the browser and Node.js
 *
 * Copyright 2014, Colin Clark
 * Licensed under the MIT and GPL 3 licenses.
 */

/* global module */

var slip = slip || {};

(function () {

    "use strict";

    // If we're in a require-compatible environment, export ourselves.
    if (typeof module !== "undefined" && module.exports) {
        module.exports = slip;
    }

    slip.END = 192;
    slip.ESC = 219;
    slip.ESC_END = 220;
    slip.ESC_ESC = 221;

    slip.byteArray = function (data, offset, length) {
        return data instanceof ArrayBuffer ? new Uint8Array(data, offset, length) : data;
    };

    slip.expandByteArray = function (arr) {
        var expanded = new Uint8Array(arr.length * 2);
        expanded.set(arr);

        return expanded;
    };

    slip.sliceByteArray = function (arr, start, end) {
        var sliced = arr.buffer.slice ? arr.buffer.slice(start, end) : arr.subarray(start, end);
        return new Uint8Array(sliced);
    };

    /**
     * SLIP encodes a byte array.
     *
     * @param {Array-like} data a Uint8Array, Node.js Buffer, ArrayBuffer, or [] containing raw bytes
     * @param {Object} options encoder options
     * @return {Uint8Array} the encoded copy of the data
     */
    slip.encode = function (data, o) {
        o = o || {};
        o.bufferPadding = o.bufferPadding || 4; // Will be rounded to the nearest 4 bytes.
        data = slip.byteArray(data, o.offset, o.byteLength);

        var bufLen = (data.length + o.bufferPadding + 3) & ~0x03,
            encoded = new Uint8Array(bufLen),
            j = 1;

        encoded[0] = slip.END;

        for (var i = 0; i < data.length; i++) {
            // We always need enough space for two value bytes plus a trailing END.
            if (j > encoded.length - 3) {
                encoded = slip.expandByteArray(encoded);
            }

            var val = data[i];
            if (val === slip.END) {
                encoded[j++] = slip.ESC;
                val = slip.ESC_END;
            } else if (val === slip.ESC) {
                encoded[j++] = slip.ESC;
                val = slip.ESC_ESC;
            }

            encoded[j++] = val;
        }

        encoded[j] = slip.END;
        return slip.sliceByteArray(encoded, 0, j + 1);
    };

    /**
     * Creates a new SLIP Decoder.
     * @constructor
     *
     * @param {Function} onMessage a callback function that will be invoked when a message has been fully decoded
     * @param {Number} maxBufferSize the maximum size of a incoming message; larger messages will throw an error
     */
    slip.Decoder = function (o) {
        o = typeof o !== "function" ? o || {} : {
            onMessage: o
        };

        this.maxMessageSize = o.maxMessageSize || 10485760; // Defaults to 10 MB.
        this.bufferSize = o.bufferSize || 1024; // Message buffer defaults to 1 KB.
        this.msgBuffer = new Uint8Array(this.bufferSize);
        this.msgBufferIdx = 0;
        this.onMessage = o.onMessage;
        this.onError = o.onError;
        this.escape = false;
    };

    var p = slip.Decoder.prototype;

    /**
     * Decodes a SLIP data packet.
     * The onMessage callback will be invoked when a complete message has been decoded.
     *
     * @param {Array-like} data an incoming stream of bytes
     */
    p.decode = function (data) {
        data = slip.byteArray(data);

        var msg;
        for (var i = 0; i < data.length; i++) {
            var val = data[i];

            if (this.escape) {
                if (val === slip.ESC_ESC) {
                    val = slip.ESC;
                } else if (val === slip.ESC_END) {
                    val = slip.END;
                }
            } else {
                if (val === slip.ESC) {
                    this.escape = true;
                    continue;
                }

                if (val === slip.END) {
                    msg = this.handleEnd();
                    continue;
                }
            }

            var more = this.addByte(val);
            if (!more) {
                this.handleMessageMaxError();
            }
        }

        return msg;
    };

    p.handleMessageMaxError = function () {
        if (this.onError) {
            this.onError(this.msgBuffer.subarray(0),
                "The message is too large; the maximum message size is " +
                this.maxMessageSize / 1024 + "KB. Use a larger maxMessageSize if necessary.");
        }

        // Reset everything and carry on.
        this.msgBufferIdx = 0;
        this.escape = false;
    };

    // Unsupported, non-API method.
    p.addByte = function (val) {
        if (this.msgBufferIdx > this.msgBuffer.length - 1) {
            this.msgBuffer = slip.expandByteArray(this.msgBuffer);
        }

        this.msgBuffer[this.msgBufferIdx++] = val;
        this.escape = false;

        return this.msgBuffer.length < this.maxMessageSize;
    };

    // Unsupported, non-API method.
    p.handleEnd = function () {
        if (this.msgBufferIdx === 0) {
            return; // Toss opening END byte and carry on.
        }

        var msg = slip.sliceByteArray(this.msgBuffer, 0, this.msgBufferIdx);
        if (this.onMessage) {
            this.onMessage(msg);
        }

        // Clear our pointer into the message buffer.
        this.msgBufferIdx = 0;

        return msg;
    };

}());
;
/*!
 * EventEmitter v4.2.7 - git.io/ee
 * Oliver Caldwell
 * MIT license
 * @preserve
 */

(function () {
	'use strict';

	/**
	 * Class for managing events.
	 * Can be extended to provide event functionality in other classes.
	 *
	 * @class EventEmitter Manages event registering and emitting.
	 */
	function EventEmitter() {}

	// Shortcuts to improve speed and size
	var proto = EventEmitter.prototype;
	var exports = this;
	var originalGlobalValue = exports.EventEmitter;

	/**
	 * Finds the index of the listener for the event in it's storage array.
	 *
	 * @param {Function[]} listeners Array of listeners to search through.
	 * @param {Function} listener Method to look for.
	 * @return {Number} Index of the specified listener, -1 if not found
	 * @api private
	 */
	function indexOfListener(listeners, listener) {
		var i = listeners.length;
		while (i--) {
			if (listeners[i].listener === listener) {
				return i;
			}
		}

		return -1;
	}

	/**
	 * Alias a method while keeping the context correct, to allow for overwriting of target method.
	 *
	 * @param {String} name The name of the target method.
	 * @return {Function} The aliased method
	 * @api private
	 */
	function alias(name) {
		return function aliasClosure() {
			return this[name].apply(this, arguments);
		};
	}

	/**
	 * Returns the listener array for the specified event.
	 * Will initialise the event object and listener arrays if required.
	 * Will return an object if you use a regex search. The object contains keys for each matched event. So /ba[rz]/ might return an object containing bar and baz. But only if you have either defined them with defineEvent or added some listeners to them.
	 * Each property in the object response is an array of listener functions.
	 *
	 * @param {String|RegExp} evt Name of the event to return the listeners from.
	 * @return {Function[]|Object} All listener functions for the event.
	 */
	proto.getListeners = function getListeners(evt) {
		var events = this._getEvents();
		var response;
		var key;

		// Return a concatenated array of all matching events if
		// the selector is a regular expression.
		if (evt instanceof RegExp) {
			response = {};
			for (key in events) {
				if (events.hasOwnProperty(key) && evt.test(key)) {
					response[key] = events[key];
				}
			}
		}
		else {
			response = events[evt] || (events[evt] = []);
		}

		return response;
	};

	/**
	 * Takes a list of listener objects and flattens it into a list of listener functions.
	 *
	 * @param {Object[]} listeners Raw listener objects.
	 * @return {Function[]} Just the listener functions.
	 */
	proto.flattenListeners = function flattenListeners(listeners) {
		var flatListeners = [];
		var i;

		for (i = 0; i < listeners.length; i += 1) {
			flatListeners.push(listeners[i].listener);
		}

		return flatListeners;
	};

	/**
	 * Fetches the requested listeners via getListeners but will always return the results inside an object. This is mainly for internal use but others may find it useful.
	 *
	 * @param {String|RegExp} evt Name of the event to return the listeners from.
	 * @return {Object} All listener functions for an event in an object.
	 */
	proto.getListenersAsObject = function getListenersAsObject(evt) {
		var listeners = this.getListeners(evt);
		var response;

		if (listeners instanceof Array) {
			response = {};
			response[evt] = listeners;
		}

		return response || listeners;
	};

	/**
	 * Adds a listener function to the specified event.
	 * The listener will not be added if it is a duplicate.
	 * If the listener returns true then it will be removed after it is called.
	 * If you pass a regular expression as the event name then the listener will be added to all events that match it.
	 *
	 * @param {String|RegExp} evt Name of the event to attach the listener to.
	 * @param {Function} listener Method to be called when the event is emitted. If the function returns true then it will be removed after calling.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.addListener = function addListener(evt, listener) {
		var listeners = this.getListenersAsObject(evt);
		var listenerIsWrapped = typeof listener === 'object';
		var key;

		for (key in listeners) {
			if (listeners.hasOwnProperty(key) && indexOfListener(listeners[key], listener) === -1) {
				listeners[key].push(listenerIsWrapped ? listener : {
					listener: listener,
					once: false
				});
			}
		}

		return this;
	};

	/**
	 * Alias of addListener
	 */
	proto.on = alias('addListener');

	/**
	 * Semi-alias of addListener. It will add a listener that will be
	 * automatically removed after it's first execution.
	 *
	 * @param {String|RegExp} evt Name of the event to attach the listener to.
	 * @param {Function} listener Method to be called when the event is emitted. If the function returns true then it will be removed after calling.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.addOnceListener = function addOnceListener(evt, listener) {
		return this.addListener(evt, {
			listener: listener,
			once: true
		});
	};

	/**
	 * Alias of addOnceListener.
	 */
	proto.once = alias('addOnceListener');

	/**
	 * Defines an event name. This is required if you want to use a regex to add a listener to multiple events at once. If you don't do this then how do you expect it to know what event to add to? Should it just add to every possible match for a regex? No. That is scary and bad.
	 * You need to tell it what event names should be matched by a regex.
	 *
	 * @param {String} evt Name of the event to create.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.defineEvent = function defineEvent(evt) {
		this.getListeners(evt);
		return this;
	};

	/**
	 * Uses defineEvent to define multiple events.
	 *
	 * @param {String[]} evts An array of event names to define.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.defineEvents = function defineEvents(evts) {
		for (var i = 0; i < evts.length; i += 1) {
			this.defineEvent(evts[i]);
		}
		return this;
	};

	/**
	 * Removes a listener function from the specified event.
	 * When passed a regular expression as the event name, it will remove the listener from all events that match it.
	 *
	 * @param {String|RegExp} evt Name of the event to remove the listener from.
	 * @param {Function} listener Method to remove from the event.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.removeListener = function removeListener(evt, listener) {
		var listeners = this.getListenersAsObject(evt);
		var index;
		var key;

		for (key in listeners) {
			if (listeners.hasOwnProperty(key)) {
				index = indexOfListener(listeners[key], listener);

				if (index !== -1) {
					listeners[key].splice(index, 1);
				}
			}
		}

		return this;
	};

	/**
	 * Alias of removeListener
	 */
	proto.off = alias('removeListener');

	/**
	 * Adds listeners in bulk using the manipulateListeners method.
	 * If you pass an object as the second argument you can add to multiple events at once. The object should contain key value pairs of events and listeners or listener arrays. You can also pass it an event name and an array of listeners to be added.
	 * You can also pass it a regular expression to add the array of listeners to all events that match it.
	 * Yeah, this function does quite a bit. That's probably a bad thing.
	 *
	 * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to add to multiple events at once.
	 * @param {Function[]} [listeners] An optional array of listener functions to add.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.addListeners = function addListeners(evt, listeners) {
		// Pass through to manipulateListeners
		return this.manipulateListeners(false, evt, listeners);
	};

	/**
	 * Removes listeners in bulk using the manipulateListeners method.
	 * If you pass an object as the second argument you can remove from multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
	 * You can also pass it an event name and an array of listeners to be removed.
	 * You can also pass it a regular expression to remove the listeners from all events that match it.
	 *
	 * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to remove from multiple events at once.
	 * @param {Function[]} [listeners] An optional array of listener functions to remove.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.removeListeners = function removeListeners(evt, listeners) {
		// Pass through to manipulateListeners
		return this.manipulateListeners(true, evt, listeners);
	};

	/**
	 * Edits listeners in bulk. The addListeners and removeListeners methods both use this to do their job. You should really use those instead, this is a little lower level.
	 * The first argument will determine if the listeners are removed (true) or added (false).
	 * If you pass an object as the second argument you can add/remove from multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
	 * You can also pass it an event name and an array of listeners to be added/removed.
	 * You can also pass it a regular expression to manipulate the listeners of all events that match it.
	 *
	 * @param {Boolean} remove True if you want to remove listeners, false if you want to add.
	 * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to add/remove from multiple events at once.
	 * @param {Function[]} [listeners] An optional array of listener functions to add/remove.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.manipulateListeners = function manipulateListeners(remove, evt, listeners) {
		var i;
		var value;
		var single = remove ? this.removeListener : this.addListener;
		var multiple = remove ? this.removeListeners : this.addListeners;

		// If evt is an object then pass each of it's properties to this method
		if (typeof evt === 'object' && !(evt instanceof RegExp)) {
			for (i in evt) {
				if (evt.hasOwnProperty(i) && (value = evt[i])) {
					// Pass the single listener straight through to the singular method
					if (typeof value === 'function') {
						single.call(this, i, value);
					}
					else {
						// Otherwise pass back to the multiple function
						multiple.call(this, i, value);
					}
				}
			}
		}
		else {
			// So evt must be a string
			// And listeners must be an array of listeners
			// Loop over it and pass each one to the multiple method
			i = listeners.length;
			while (i--) {
				single.call(this, evt, listeners[i]);
			}
		}

		return this;
	};

	/**
	 * Removes all listeners from a specified event.
	 * If you do not specify an event then all listeners will be removed.
	 * That means every event will be emptied.
	 * You can also pass a regex to remove all events that match it.
	 *
	 * @param {String|RegExp} [evt] Optional name of the event to remove all listeners for. Will remove from every event if not passed.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.removeEvent = function removeEvent(evt) {
		var type = typeof evt;
		var events = this._getEvents();
		var key;

		// Remove different things depending on the state of evt
		if (type === 'string') {
			// Remove all listeners for the specified event
			delete events[evt];
		}
		else if (evt instanceof RegExp) {
			// Remove all events matching the regex.
			for (key in events) {
				if (events.hasOwnProperty(key) && evt.test(key)) {
					delete events[key];
				}
			}
		}
		else {
			// Remove all listeners in all events
			delete this._events;
		}

		return this;
	};

	/**
	 * Alias of removeEvent.
	 *
	 * Added to mirror the node API.
	 */
	proto.removeAllListeners = alias('removeEvent');

	/**
	 * Emits an event of your choice.
	 * When emitted, every listener attached to that event will be executed.
	 * If you pass the optional argument array then those arguments will be passed to every listener upon execution.
	 * Because it uses `apply`, your array of arguments will be passed as if you wrote them out separately.
	 * So they will not arrive within the array on the other side, they will be separate.
	 * You can also pass a regular expression to emit to all events that match it.
	 *
	 * @param {String|RegExp} evt Name of the event to emit and execute listeners for.
	 * @param {Array} [args] Optional array of arguments to be passed to each listener.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.emitEvent = function emitEvent(evt, args) {
		var listeners = this.getListenersAsObject(evt);
		var listener;
		var i;
		var key;
		var response;

		for (key in listeners) {
			if (listeners.hasOwnProperty(key)) {
				i = listeners[key].length;

				while (i--) {
					// If the listener returns true then it shall be removed from the event
					// The function is executed either with a basic call or an apply if there is an args array
					listener = listeners[key][i];

					if (listener.once === true) {
						this.removeListener(evt, listener.listener);
					}

					response = listener.listener.apply(this, args || []);

					if (response === this._getOnceReturnValue()) {
						this.removeListener(evt, listener.listener);
					}
				}
			}
		}

		return this;
	};

	/**
	 * Alias of emitEvent
	 */
	proto.trigger = alias('emitEvent');

	/**
	 * Subtly different from emitEvent in that it will pass its arguments on to the listeners, as opposed to taking a single array of arguments to pass on.
	 * As with emitEvent, you can pass a regex in place of the event name to emit to all events that match it.
	 *
	 * @param {String|RegExp} evt Name of the event to emit and execute listeners for.
	 * @param {...*} Optional additional arguments to be passed to each listener.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.emit = function emit(evt) {
		var args = Array.prototype.slice.call(arguments, 1);
		return this.emitEvent(evt, args);
	};

	/**
	 * Sets the current value to check against when executing listeners. If a
	 * listeners return value matches the one set here then it will be removed
	 * after execution. This value defaults to true.
	 *
	 * @param {*} value The new value to check for when executing listeners.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.setOnceReturnValue = function setOnceReturnValue(value) {
		this._onceReturnValue = value;
		return this;
	};

	/**
	 * Fetches the current value to check against when executing listeners. If
	 * the listeners return value matches this one then it should be removed
	 * automatically. It will return true by default.
	 *
	 * @return {*|Boolean} The current value to check for or the default, true.
	 * @api private
	 */
	proto._getOnceReturnValue = function _getOnceReturnValue() {
		if (this.hasOwnProperty('_onceReturnValue')) {
			return this._onceReturnValue;
		}
		else {
			return true;
		}
	};

	/**
	 * Fetches the events object and creates one if required.
	 *
	 * @return {Object} The events storage object.
	 * @api private
	 */
	proto._getEvents = function _getEvents() {
		return this._events || (this._events = {});
	};

	/**
	 * Reverts the global {@link EventEmitter} to its previous value and returns a reference to this version.
	 *
	 * @return {Function} Non conflicting EventEmitter class.
	 */
	EventEmitter.noConflict = function noConflict() {
		exports.EventEmitter = originalGlobalValue;
		return EventEmitter;
	};

	// Expose the class either via AMD, CommonJS or the global object
	if (typeof define === 'function' && define.amd) {
		define(function () {
			return EventEmitter;
		});
	}
	else if (typeof module === 'object' && module.exports){
		module.exports = EventEmitter;
	}
	else {
		this.EventEmitter = EventEmitter;
	}
}.call(this));
;
/*
 * osc.js: An Open Sound Control library for JavaScript that works in both the browser and Node.js
 *
 * Copyright 2014, Colin Clark
 * Licensed under the MIT and GPL 3 licenses.
 */

/* global require, module, Buffer */

var osc = osc || {};

(function () {

    "use strict";

    // Private instance of the buffer-dataview object.
    // Only used if we're in Node.js.
    var BufferDataView;

    osc.SECS_70YRS = 2208988800;
    osc.TWO_32 = 4294967296;

    osc.defaults = {
        metadata: false,
        unpackSingleArgs: true
    };

    // A flag to tell us if we're in a Node.js-compatible environment with Buffers,
    // which we will assume are faster.
    // Unsupported, non-API property.
    osc.isBufferEnv = typeof Buffer !== "undefined";

    // Unsupported, non-API function.
    osc.isArray = function (obj) {
        return obj && Object.prototype.toString.call(obj) === "[object Array]";
    };

    // Unsupported, non-API function
    osc.isTypedArrayView = function (obj) {
        return obj.buffer && obj.buffer instanceof ArrayBuffer;
    };

    // Unsupported, non-API function
    osc.isBuffer = function (obj) {
        return osc.isBufferEnv && obj instanceof Buffer;
    };


    /**
     * Wraps the specified object in a DataView.
     *
     * @param {Array-like} obj the object to wrap in a DataView instance
     * @return {DataView} the DataView object
     */
    // Unsupported, non-API function.
    osc.dataView = function (obj) {
        if (obj instanceof DataView) {
            return obj;
        }

        // Node.js-specific.
        if (typeof BufferDataView !== "undefined" && obj instanceof BufferDataView) {
            return obj;
        }

        // Node.js-specific.
        if (osc.isBufferEnv && obj instanceof Buffer) {
            return new BufferDataView(obj);
        }

        if (obj.buffer) {
            return new DataView(obj.buffer);
        }

        if (obj instanceof ArrayBuffer) {
            return new DataView(obj);
        }

        return new DataView(new Uint8Array(obj));
    };

    /**
     * Takes an ArrayBuffer, TypedArray, DataView, Node.js Buffer, or array-like object
     * and returns a Uint8Array view of it.
     *
     * Throws an error if the object isn't suitably array-like.
     *
     * @param {Array-like or Array-wrapping} obj an array-like or array-wrapping object
     * @returns {Uint8Array} a typed array of octets
     */
    // Unsupported, non-API function.
    osc.byteArray = function (obj) {
        if (obj instanceof Uint8Array) {
            return obj;
        }

        var buf = obj.buffer ? obj.buffer : obj;

        if (typeof obj.length === "undefined" || typeof obj === "string") {
            throw new Error("Can't wrap a non-array-like object as Uint8Array. Object was: " + obj);
        }

        return new Uint8Array(buf);
    };

    // Unsupported, non-API function.
    osc.makeByteArray = function (len) {
        return osc.isBufferEnv ? new Buffer(len) : new Uint8Array(len);
    };

    // Unsupported, non-API function
    osc.copyByteArray = function (source, target, offset) {
        if (osc.isTypedArrayView(source) && osc.isTypedArrayView(target)) {
            target.set(source, offset);
        } else if (osc.isBuffer(source) && osc.isBuffer(target)) {
            source.copy(target, offset);
        } else {
            var start = offset === undefined ? 0 : offset,
                len = Math.min(target.length - offset, source.length);

            for (var i = 0, j = start; i < len; i++, j++) {
                target[j] = source[i];
            }
        }

        return target;
    };

    /**
     * Reads an OSC-formatted string.
     *
     * @param {DataView} dv a DataView containing the raw bytes of the OSC string
     * @param {Object} offsetState an offsetState object used to store the current offset index
     * @return {String} the JavaScript String that was read
     */
    osc.readString = function (dv, offsetState) {
        var charCodes = [],
            idx = offsetState.idx;

        for (; idx < dv.byteLength; idx++) {
            var charCode = dv.getUint8(idx);
            if (charCode !== 0) {
                charCodes.push(charCode);
            } else {
                idx++;
                break;
            }
        }

        // Round to the nearest 4-byte block.
        idx = (idx + 3) & ~0x03;
        offsetState.idx = idx;

        return String.fromCharCode.apply(null, charCodes);
    };

    /**
     * Writes a JavaScript string as an OSC-formatted string.
     *
     * @param {String} str the string to write
     * @return {Uint8Array} a buffer containing the OSC-formatted string
     */
    osc.writeString = function (str) {
        var terminated = str + "\u0000",
            len = terminated.length,
            paddedLen = (len + 3) & ~0x03,
            arr = new Uint8Array(paddedLen);

        for (var i = 0; i < terminated.length; i++) {
            var charCode = terminated.charCodeAt(i);
            arr[i] = charCode;
        }

        return arr;
    };

    // Unsupported, non-API function.
    osc.readPrimitive = function (dv, readerName, numBytes, offsetState) {
        var val = dv[readerName](offsetState.idx, false);
        offsetState.idx += numBytes;

        return val;
    };

    // Unsupported, non-API function.
    osc.writePrimitive = function (val, dv, writerName, numBytes, offset) {
        offset = offset === undefined ? 0 : offset;

        var arr;
        if (!dv) {
            arr = new Uint8Array(numBytes);
            dv = new DataView(arr.buffer);
        } else {
            arr = new Uint8Array(dv.buffer);
        }

        dv[writerName](offset, val, false);

        return arr;
    };

    /**
     * Reads an OSC int32 ("i") value.
     *
     * @param {DataView} dv a DataView containing the raw bytes
     * @param {Object} offsetState an offsetState object used to store the current offset index into dv
     * @return {Number} the number that was read
     */
    osc.readInt32 = function (dv, offsetState) {
        return osc.readPrimitive(dv, "getInt32", 4, offsetState);
    };

    /**
     * Writes an OSC int32 ("i") value.
     *
     * @param {Number} val the number to write
     * @param {DataView} [dv] a DataView instance to write the number into
     * @param {Number} [offset] an offset into dv
     */
    osc.writeInt32 = function (val, dv, offset) {
        return osc.writePrimitive(val, dv, "setInt32", 4, offset);
    };

    /**
     * Reads an OSC float32 ("f") value.
     *
     * @param {DataView} dv a DataView containing the raw bytes
     * @param {Object} offsetState an offsetState object used to store the current offset index into dv
     * @return {Number} the number that was read
     */
    osc.readFloat32 = function (dv, offsetState) {
        return osc.readPrimitive(dv, "getFloat32", 4, offsetState);
    };

    /**
     * Writes an OSC float32 ("f") value.
     *
     * @param {Number} val the number to write
     * @param {DataView} [dv] a DataView instance to write the number into
     * @param {Number} [offset] an offset into dv
     */
    osc.writeFloat32 = function (val, dv, offset) {
        return osc.writePrimitive(val, dv, "setFloat32", 4, offset);
    };

    /**
     * Reads an OSC float64 ("d") value.
     *
     * @param {DataView} dv a DataView containing the raw bytes
     * @param {Object} offsetState an offsetState object used to store the current offset index into dv
     * @return {Number} the number that was read
     */
    osc.readFloat64 = function (dv, offsetState) {
        return osc.readPrimitive(dv, "getFloat64", 8, offsetState);
    };

    /**
     * Writes an OSC float64 ("d") value.
     *
     * @param {Number} val the number to write
     * @param {DataView} [dv] a DataView instance to write the number into
     * @param {Number} [offset] an offset into dv
     */
    osc.writeFloat64 = function (val, dv, offset) {
        return osc.writePrimitive(val, dv, "setFloat64", 8, offset);
    };

    /**
     * Reads an OSC 32-bit ASCII character ("c") value.
     *
     * @param {DataView} dv a DataView containing the raw bytes
     * @param {Object} offsetState an offsetState object used to store the current offset index into dv
     * @return {String} a string containing the read character
     */
    osc.readChar32 = function (dv, offsetState) {
        var charCode = osc.readPrimitive(dv, "getUint32", 4, offsetState);
        return String.fromCharCode(charCode);
    };

    /**
     * Writes an OSC 32-bit ASCII character ("c") value.
     *
     * @param {String} str the string from which the first character will be written
     * @param {DataView} [dv] a DataView instance to write the character into
     * @param {Number} [offset] an offset into dv
     * @return {String} a string containing the read character
     */
    osc.writeChar32 = function (str, dv, offset) {
        var charCode = str.charCodeAt(0);
        if (charCode === undefined || charCode < -1) {
            return undefined;
        }

        return osc.writePrimitive(charCode, dv, "setUint32", 4, offset);
    };

    /**
     * Reads an OSC blob ("b") (i.e. a Uint8Array).
     *
     * @param {DataView} dv a DataView instance to read from
     * @param {Object} offsetState an offsetState object used to store the current offset index into dv
     * @return {Uint8Array} the data that was read
     */
    osc.readBlob = function (dv, offsetState) {
        var len = osc.readInt32(dv, offsetState),
            paddedLen = (len + 3) & ~0x03,
            blob = new Uint8Array(dv.buffer, offsetState.idx, len);

        offsetState.idx += paddedLen;

        return blob;
    };

    /**
     * Writes a raw collection of bytes to a new ArrayBuffer.
     *
     * @param {Array-like} data a collection of octets
     * @return {ArrayBuffer} a buffer containing the OSC-formatted blob
     */
    osc.writeBlob = function (data) {
        data = osc.byteArray(data);

        var len = data.byteLength,
            paddedLen = (len + 3) & ~0x03,
            offset = 4, // Extra 4 bytes is for the size.
            blobLen = paddedLen + offset,
            arr = new Uint8Array(blobLen),
            dv = new DataView(arr.buffer);

        // Write the size.
        osc.writeInt32(len, dv);

        // Since we're writing to a real ArrayBuffer,
        // we don't need to pad the remaining bytes.
        arr.set(data, offset);

        return arr;
    };

    /**
     * Reads an OSC 4-byte MIDI message.
     *
     * @param {DataView} dv the DataView instance to read from
     * @param {Object} offsetState an offsetState object used to store the current offset index into dv
     * @return {Uint8Array} an array containing (in order) the port ID, status, data1 and data1 bytes
     */
    osc.readMIDIBytes = function (dv, offsetState) {
        var midi = new Uint8Array(dv.buffer, offsetState.idx, 4);
        offsetState.idx += 4;

        return midi;
    };

    /**
     * Writes an OSC 4-byte MIDI message.
     *
     * @param {Array-like} bytes a 4-element array consisting of the port ID, status, data1 and data1 bytes
     * @return {Uint8Array} the written message
     */
    osc.writeMIDIBytes = function (bytes) {
        bytes = osc.byteArray(bytes);

        var arr = new Uint8Array(4);
        arr.set(bytes);

        return arr;
    };

    /**
     * Reads an OSC RGBA colour value.
     *
     * @param {DataView} dv the DataView instance to read from
     * @param {Object} offsetState an offsetState object used to store the current offset index into dv
     * @return {Object} a colour object containing r, g, b, and a properties
     */
    osc.readColor = function (dv, offsetState) {
        var bytes = new Uint8Array(dv.buffer, offsetState.idx, 4),
            alpha = bytes[3] / 255;

        offsetState.idx += 4;

        return {
            r: bytes[0],
            g: bytes[1],
            b: bytes[2],
            a: alpha
        };
    };

    /**
     * Writes an OSC RGBA colour value.
     *
     * @param {Object} color a colour object containing r, g, b, and a properties
     * @return {Uint8Array} a byte array containing the written color
     */
    osc.writeColor = function (color) {
        var alpha = Math.round(color.a * 255),
            arr = new Uint8Array([color.r, color.g, color.b, alpha]);

        return arr;
    };

    /**
     * Reads an OSC true ("T") value by directly returning the JavaScript Boolean "true".
     */
    osc.readTrue = function () {
        return true;
    };

    /**
     * Reads an OSC false ("F") value by directly returning the JavaScript Boolean "false".
     */
    osc.readFalse = function () {
        return false;
    };

    /**
     * Reads an OSC nil ("N") value by directly returning the JavaScript "null" value.
     */
    osc.readNull = function () {
        return null;
    };

    /**
     * Reads an OSC impulse/bang/infinitum ("I") value by directly returning 1.0.
     */
    osc.readImpulse = function () {
        return 1.0;
    };

    /**
     * Reads an OSC time tag ("t").
     *
     * @param {DataView} dv the DataView instance to read from
     * @param {Object} offsetState an offset state object containing the current index into dv
     * @param {Object} a time tag object containing both the raw NTP as well as the converted native (i.e. JS/UNIX) time
     */
    osc.readTimeTag = function (dv, offsetState) {
        var secs1900 = osc.readPrimitive(dv, "getUint32", 4, offsetState),
            frac = osc.readPrimitive(dv, "getUint32", 4, offsetState),
            native = (secs1900 === 0 && frac === 1) ? Date.now() : osc.ntpToJSTime(secs1900, frac);

        return {
            raw: [secs1900, frac],
            native: native
        };
    };

    /**
     * Writes an OSC time tag ("t").
     *
     * Takes, as its argument, a time tag object containing either a "raw" or "native property."
     * The raw timestamp must conform to the NTP standard representation, consisting of two unsigned int32
     * values. The first represents the number of seconds since January 1, 1900; the second, fractions of a second.
     * "Native" JavaScript timestamps are specified as a Number representing milliseconds since January 1, 1970.
     *
     * @param {Object} timeTag time tag object containing either a native JS timestamp (in ms) or a NTP timestamp pair
     * @return {Uint8Array} raw bytes for the written time tag
     */
    osc.writeTimeTag = function (timeTag) {
        var raw = timeTag.raw ? timeTag.raw : osc.jsToNTPTime(timeTag.native),
            arr = new Uint8Array(8), // Two Unit32s.
            dv = new DataView(arr.buffer);

        osc.writeInt32(raw[0], dv, 0);
        osc.writeInt32(raw[1], dv, 4);

        return arr;
    };

    /**
     * Produces a time tag containing a raw NTP timestamp
     * relative to now by the specified number of seconds.
     *
     * @param {Number} secs the number of seconds relative to now (i.e. + for the future, - for the past)
     * @return {Object} the time tag
     */
    osc.timeTag = function (secs) {
        secs = secs || 0;

        var nowSecs = Date.now() / 1000,
            nowWhole = Math.floor(nowSecs),
            nowFracs = nowSecs - nowWhole,
            secsWhole = Math.floor(secs),
            secsFracs = secs - secsWhole,
            fracs = nowFracs + secsFracs;

        if (fracs > 1) {
            var fracsWhole = Math.floor(fracs),
                fracsFracs = fracs - fracsWhole;

            secsWhole += fracsWhole;
            fracs = fracsFracs;
        }

        var ntpSecs = nowWhole + secsWhole + osc.SECS_70YRS,
            ntpFracs = Math.round(osc.TWO_32 * fracs);

        return {
            raw: [ntpSecs, ntpFracs]
        };
    };

    /**
     * Converts OSC's standard time tag representation (which is the NTP format)
     * into the JavaScript/UNIX format in milliseconds.
     *
     * @param {Number} secs1900 the number of seconds since 1900
     * @param {Number} frac the number of fractions of a second (between 0 and 2^32)
     * @return {Number} a JavaScript-compatible timestamp in milliseconds
     */
    osc.ntpToJSTime = function (secs1900, frac) {
        var secs1970 = secs1900 - osc.SECS_70YRS,
            decimals = frac / osc.TWO_32,
            msTime = (secs1970 + decimals) * 1000;

        return msTime;
    };

    osc.jsToNTPTime = function (jsTime) {
        var secs = jsTime / 1000,
            secsWhole = Math.floor(secs),
            secsFrac = secs - secsWhole,
            ntpSecs = secsWhole + osc.SECS_70YRS,
            ntpFracs = Math.round(osc.TWO_32 * secsFrac);

        return [ntpSecs, ntpFracs];
    };

    /**
     * Reads the argument portion of an OSC message.
     *
     * @param {DataView} dv a DataView instance to read from
     * @param {Object} offsetState the offsetState object that stores the current offset into dv
     * @param {Oobject} [options] read options
     * @return {Array} an array of the OSC arguments that were read
     */
    osc.readArguments = function (dv, options, offsetState) {
        var typeTagString = osc.readString(dv, offsetState);
        if (typeTagString.indexOf(",") !== 0) {
            // Despite what the OSC 1.0 spec says,
            // it just doesn't make sense to handle messages without type tags.
            // scsynth appears to read such messages as if they have a single
            // Uint8 argument. sclang throws an error if the type tag is omitted.
            throw new Error("A malformed type tag string was found while reading " +
                "the arguments of an OSC message. String was: " +
                typeTagString, " at offset: " + offsetState.idx);
        }

        var argTypes = typeTagString.substring(1).split(""),
            args = [];

        osc.readArgumentsIntoArray(args, argTypes, typeTagString, dv, options, offsetState);

        return args;
    };

    // Unsupported, non-API function.
    osc.readArgument = function (argType, typeTagString, dv, options, offsetState) {
        var typeSpec = osc.argumentTypes[argType];
        if (!typeSpec) {
            throw new Error("'" + argType + "' is not a valid OSC type tag. Type tag string was: " + typeTagString);
        }

        var argReader = typeSpec.reader,
            arg = osc[argReader](dv, offsetState);

        if (options.metadata) {
            arg = {
                type: argType,
                value: arg
            };
        }

        return arg;
    };

    // Unsupported, non-API function.
    osc.readArgumentsIntoArray = function (arr, argTypes, typeTagString, dv, options, offsetState) {
        var i = 0;

        while (i < argTypes.length) {
            var argType = argTypes[i],
                arg;

            if (argType === "[") {
                var fromArrayOpen = argTypes.slice(i + 1),
                    endArrayIdx = fromArrayOpen.indexOf("]");

                if (endArrayIdx < 0) {
                    throw new Error("Invalid argument type tag: an open array type tag ('[') was found "+
                        "without a matching close array tag ('[]'). Type tag was: " + typeTagString);
                }

                var typesInArray = fromArrayOpen.slice(0, endArrayIdx);
                arg = osc.readArgumentsIntoArray([], typesInArray, typeTagString, dv, options, offsetState);
                i += endArrayIdx + 2;
            } else {
                arg = osc.readArgument(argType, typeTagString, dv, options, offsetState);
                i++;
            }

            arr.push(arg);
        }

        return arr;
    };

    /**
     * Writes the specified arguments.
     *
     * @param {Array} args an array of arguments
     * @param {Object} options options for writing
     * @return {Uint8Array} a buffer containing the OSC-formatted argument type tag and values
     */
    osc.writeArguments = function (args, options) {
        var argCollection = osc.collectArguments(args, options);
        return osc.joinParts(argCollection);
    };

    // Unsupported, non-API function.
    osc.joinParts = function (dataCollection) {
        var buf = osc.makeByteArray(dataCollection.byteLength),
            parts = dataCollection.parts,
            offset = 0;

        for (var i = 0; i < parts.length; i++) {
            var part = parts[i];
            osc.copyByteArray(part, buf, offset);
            offset += part.length;
        }

        return buf;
    };

    // Unsupported, non-API function.
    osc.addDataPart = function (dataPart, dataCollection) {
        dataCollection.parts.push(dataPart);
        dataCollection.byteLength += dataPart.length;
    };

    // Unsupported, non-API function.
    osc.collectArguments = function (args, options, dataCollection) {
        if (!osc.isArray(args)) {
            args = [args];
        }

        dataCollection = dataCollection || {
            byteLength: 0,
            parts: []
        };

        if (!options.metadata) {
            args = osc.annotateArguments(args);
        }

        var typeTagString = ",",
            currPartIdx = dataCollection.parts.length;

        for (var i = 0; i < args.length; i++) {
            var arg = args[i],
                type = arg.type,
                writer = osc.argumentTypes[type].writer;

            typeTagString += arg.type;
            if (writer) {
                var data = osc[writer](arg.value);
                osc.addDataPart(data, dataCollection);
            }
        }

        var typeData = osc.writeString(typeTagString);
        dataCollection.byteLength += typeData.byteLength;
        dataCollection.parts.splice(currPartIdx, 0, typeData);

        return dataCollection;
    };

    /**
     * Reads an OSC message.
     *
     * @param {Array-like} data an array of bytes to read from
     * @param {Object} [options] read optoins
     * @param {Object} [offsetState] an offsetState object that stores the current offset into dv
     * @return {Object} the OSC message, formatted as a JavaScript object containing "address" and "args" properties
     */
    osc.readMessage = function (data, options, offsetState) {
        options = options || osc.defaults;

        var dv = osc.dataView(data);
        offsetState = offsetState || {
            idx: 0
        };

        var address = osc.readString(dv, offsetState);
        return osc.readMessageContents(address, dv, options, offsetState);
    };

    // Unsupported, non-API function.
    osc.readMessageContents = function (address, dv, options, offsetState) {
        if (address.indexOf("/") !== 0) {
            throw new Error("A malformed OSC address was found while reading " +
                "an OSC message. String was: " + address);
        }

        var args = osc.readArguments(dv, options, offsetState);

        return {
            address: address,
            args: args.length === 1 && options.unpackSingleArgs ? args[0] : args
        };
    };

    // Unsupported, non-API function.
    osc.collectMessageParts = function (msg, options, dataCollection) {
        dataCollection = dataCollection || {
            byteLength: 0,
            parts: []
        };

        osc.addDataPart(osc.writeString(msg.address), dataCollection);
        return osc.collectArguments(msg.args, options, dataCollection);
    };

    /**
     * Writes an OSC message.
     *
     * @param {Object} msg a message object containing "address" and "args" properties
     * @param {Object} [options] write options
     * @return {Uint8Array} an array of bytes containing the OSC message
     */
    osc.writeMessage = function (msg, options) {
        options = options || osc.defaults;
        var msgCollection = osc.collectMessageParts(msg, options);
        return osc.joinParts(msgCollection);
    };

    /**
     * Reads an OSC bundle.
     *
     * @param {DataView} dv the DataView instance to read from
     * @param {Object} [options] read optoins
     * @param {Object} [offsetState] an offsetState object that stores the current offset into dv
     * @return {Object} the bundle or message object that was read
     */
    osc.readBundle = function (dv, options, offsetState) {
        return osc.readPacket(dv, options, offsetState);
    };

    // Unsupported, non-API function.
    osc.collectBundlePackets = function (bundle, options, dataCollection) {
        dataCollection = dataCollection || {
            byteLength: 0,
            parts: []
        };

        osc.addDataPart(osc.writeString("#bundle"), dataCollection);
        osc.addDataPart(osc.writeTimeTag(bundle.timeTag), dataCollection);

        for (var i = 0; i < bundle.packets.length; i++) {
            var packet = bundle.packets[i],
                collector = packet.address ? osc.collectMessageParts : osc.collectBundlePackets,
                packetCollection = collector(packet, options);

            dataCollection.byteLength += packetCollection.byteLength;
            osc.addDataPart(osc.writeInt32(packetCollection.byteLength), dataCollection);
            dataCollection.parts = dataCollection.parts.concat(packetCollection.parts);
        }

        return dataCollection;
    };

    /**
     * Writes an OSC bundle.
     *
     * @param {Object} a bundle object containing "timeTag" and "packets" properties
     * @param {object} [options] write options
     * @return {Uint8Array} an array of bytes containing the message
     */
    osc.writeBundle = function (bundle, options) {
        if (!bundle.timeTag || !bundle.packets) {
            return;
        }

        options = options || osc.defaults;
        var bundleCollection = osc.collectBundlePackets(bundle, options);

        return osc.joinParts(bundleCollection);
    };

    // Unsupported, non-API function.
    osc.readBundleContents = function (dv, options, offsetState, len) {
        var timeTag = osc.readTimeTag(dv, offsetState),
            packets = [];

        while (offsetState.idx < len) {
            var packetSize = osc.readInt32(dv, offsetState),
                packetLen = offsetState.idx + packetSize,
                packet = osc.readPacket(dv, options, offsetState, packetLen);

            packets.push(packet);
        }

        return {
            timeTag: timeTag,
            packets: packets
        };
    };

    /**
     * Reads an OSC packet, which may consist of either a bundle or a message.
     *
     * @param {Array-like} data an array of bytes to read from
     * @param {Object} [options] read options
     * @return {Object} a bundle or message object
     */
    osc.readPacket = function (data, options, offsetState, len) {
        var dv = osc.dataView(data);

        len = len === undefined ? dv.byteLength : len;
        offsetState = offsetState || {
            idx: 0
        };

        var header = osc.readString(dv, offsetState),
            firstChar = header[0];

        if (firstChar === "#") {
            return osc.readBundleContents(dv, options, offsetState, len);
        } else if (firstChar === "/") {
            return osc.readMessageContents(header, dv, options, offsetState);
        }

        throw new Error("The header of an OSC packet didn't contain an OSC address or a #bundle string." +
            " Header was: " + header);
    };

    /**
     * Writes an OSC packet, which may consist of either of a bundle or a message.
     *
     * @param {Object} a bundle or message object
     * @param {Object} [options] write options
     * @return {Uint8Array} an array of bytes containing the message
     */
    osc.writePacket = function (packet, options) {
        var writer = packet.address ? osc.writeMessage : osc.writeBundle;
        return writer(packet, options);
    };

    // Unsupported, non-API.
    osc.argumentTypes = {
        i: {
            reader: "readInt32",
            writer: "writeInt32"
        },
        f: {
            reader: "readFloat32",
            writer: "writeFloat32"
        },
        s: {
            reader: "readString",
            writer: "writeString"
        },
        S: {
            reader: "readString",
            writer: "writeString"
        },
        b: {
            reader: "readBlob",
            writer: "writeBlob"
        },
        t: {
            reader: "readTimeTag",
            writer: "writeTimeTag"
        },
        T: {
            reader: "readTrue"
        },
        F: {
            reader: "readFalse"
        },
        N: {
            reader: "readNull"
        },
        I: {
            reader: "readImpulse"
        },
        d: {
            reader: "readFloat64",
            writer: "writeFloat64"
        },
        c: {
            reader: "readChar32",
            writer: "writeChar32"
        },
        r: {
            reader: "readColor",
            writer: "writeColor"
        },
        m: {
            reader: "readMIDIBytes",
            writer: "writeMIDIBytes"
        },
        // [] are special cased within read/writeArguments()
    };

    // Unsupported, non-API function.
    osc.inferTypeForArgument = function (arg) {
        var type = typeof arg;

        // TODO: This is freaking hideous.
        switch (type) {
            case "boolean":
                return arg ? "T" : "F";
            case "string":
                return "s";
            case "number":
                return "f";
            case "undefined":
                return "N";
            case "object":
                if (arg === null) {
                    return "N";
                } else if (arg instanceof Uint8Array ||
                    arg instanceof ArrayBuffer ||
                    (osc.isBufferEnv && arg instanceof Buffer)) {
                    return "b";
                }
                break;
        }

        throw new Error("Can't infer OSC argument type for value: " + arg);
    };

    // Unsupported, non-API function.
    osc.annotateArguments = function (args) {
        if (!osc.isArray(args)) {
            args = [args];
        }

        var annotated = [];
        for (var i = 0; i < args.length; i++) {
            var arg = args[i],
                oscType = osc.inferTypeForArgument(arg);

            annotated.push({
                type: oscType,
                value: arg
            });
        }

        return annotated;
    };


    // If we're in a require-compatible environment, export ourselves.
    if (typeof module !== "undefined" && module.exports) {

        // Check if we're in Node.js; if so, require the buffer-dataview library.
        if (osc.isBufferEnv) {
            BufferDataView = require("buffer-dataview");
        }

        module.exports = osc;
    }

}());
;
/*
 * osc.js: An Open Sound Control library for JavaScript that works in both the browser and Node.js
 *
 * Copyright 2014, Colin Clark
 * Licensed under the MIT and GPL 3 licenses.
 */

/* global require, module */

var osc = osc || require("./osc.js"),
    slip = slip || require("slip"),
    EventEmitter = EventEmitter || require("events").EventEmitter;

(function () {

    "use strict";

    // Unsupported, non-API function.
    osc.firePacketEvents = function (port, packet, timeTag) {
        if (packet.address) {
            port.emit("message", packet, timeTag);
        } else {
            osc.fireBundleEvents(port, packet, timeTag);
        }
    };

    // Unsupported, non-API function.
    osc.fireBundleEvents = function (port, bundle, timeTag) {
        port.emit("bundle", bundle, timeTag);
        for (var i = 0; i < bundle.packets.length; i++) {
            var packet = bundle.packets[i];
            osc.firePacketEvents(port, packet, bundle.timeTag);
        }
    };

    osc.Port = function (options) {
        this.options = options || {};
        this.on("data", this.decodeOSC.bind(this));
    };

    var p = osc.Port.prototype = Object.create(EventEmitter.prototype);
    p.constructor = osc.Port;

    p.send = function (oscPacket) {
        var args = Array.prototype.slice.call(arguments),
            encoded = this.encodeOSC(oscPacket);
        
        args[0] = encoded;
        this.sendRaw.apply(this, args);
    };

    p.encodeOSC = function (packet) {
        packet = packet.buffer ? packet.buffer : packet;
        var encoded = osc.writePacket(packet, this.options);
        return encoded;
    };

    p.decodeOSC = function (data) {
        this.emit("raw", data);

        var packet = osc.readPacket(data, this.options);
        this.emit("osc", packet);

        osc.firePacketEvents(this, packet);
    };


    osc.SLIPPort = function (options) {
        var that = this;
        var o = this.options = options || {};
        o.useSLIP = o.useSLIP === undefined ? true : o.useSLIP;

        this.decoder = new slip.Decoder({
            onMessage: this.decodeOSC.bind(this),
            onError: function (err) {
                that.emit("error", err);
            }
        });

        var decodeHandler = o.useSLIP ? this.decodeSLIPData : this.decodeOSC;
        this.on("data", decodeHandler.bind(this));
    };

    p = osc.SLIPPort.prototype = Object.create(osc.Port.prototype);
    p.constructor = osc.SLIPPort;

    p.encodeOSC = function (packet) {
        packet = packet.buffer ? packet.buffer : packet;
        var encoded = osc.writePacket(packet, this.options);
        return slip.encode(encoded);
    };

    p.decodeSLIPData = function (data) {
        this.decoder.decode(data);
    };


    // Unsupported, non-API function.
    osc.relay = function (from, to, eventName, sendFnName, transformFn, sendArgs) {
        eventName = eventName || "message";
        sendFnName = sendFnName || "send";
        transformFn = transformFn || function () {};
        sendArgs = sendArgs ? [null].concat(sendArgs) : [];

        var listener = function (data) {
            sendArgs[0] = data;
            data = transformFn(data);
            to[sendFnName].apply(to, sendArgs);
        };

        from.on(eventName, listener);

        return {
            eventName: eventName,
            listener: listener
        };
    };

    // Unsupported, non-API function.
    osc.relayPorts = function (from, to, o) {
        var eventName = o.raw ? "raw" : "osc",
            sendFnName = o.raw ? "sendRaw" : "send";

        return osc.relay(from, to, eventName, sendFnName, o.transform);
    };


    // Unsupported, non-API function.
    osc.stopRelaying = function (from, relaySpec) {
        from.removeListener(relaySpec.eventName, relaySpec.listener);
    };

    /**
     * A Relay connects two sources of OSC data together,
     * relaying all OSC messages received by each port to the other.
     * @constructor
     *
     * @param {osc.Port} port1 the first port to relay
     * @param {osc.Port} port2 the second port to relay
     * @param {Object} options the configuration options for this relay
     */
    osc.Relay = function (port1, port2, options) {
        var o = this.options = options || {};
        o.raw = false;

        this.port1 = port1;
        this.port2 = port2;

        this.listen();
    };

    p = osc.Relay.prototype;

    p.open = function () {
        this.port1.open();
        this.port2.open();
    };

    p.listen = function () {
        if (this.port1Spec && this.port2Spec) {
            this.close();
        }

        this.port1Spec = osc.relayPorts(this.port1, this.port2, this.options);
        this.port2Spec = osc.relayPorts(this.port2, this.port1, this.options);
    };

    p.close = function () {
        osc.stopRelaying(this.port1, this.port1Spec);
        osc.stopRelaying(this.port2, this.port2Spec);
    };


    // If we're in a require-compatible environment, export ourselves.
    if (typeof module !== "undefined" && module.exports) {
        module.exports = osc;
    }
}());
;
/*
 * osc.js: An Open Sound Control library for JavaScript that works in both the browser and Node.js
 *
 * Copyright 2014, Colin Clark
 * Licensed under the MIT and GPL 3 licenses.
 */

/*global chrome*/

var osc = osc || {};

(function () {

    "use strict";

    osc.listenToTransport = function (that, transport, idName) {
        transport.onReceive.addListener(function (e) {
            if (e[idName] === that[idName]) {
                that.emit("data", e.data);
            }
        });

        transport.onReceiveError.addListener(function (err) {
            that.emit("error", err);
        });

        that.emit("ready");
    };

    osc.emitNetworkError = function (that, resultCode) {
        that.emit("error",
            "There was an error while opening the UDP socket connection. Result code: " +
            resultCode);
    };

    osc.SerialPort = function (options) {
        this.on("open", this.listen.bind(this));
        osc.SLIPPort.call(this, options);
    };

    var p = osc.SerialPort.prototype = Object.create(osc.SLIPPort.prototype);
    p.constructor = osc.SerialPort;

    p.open = function () {
        var that = this,
            connectionOpts = {
                bitrate: that.options.bitrate
            };

        chrome.serial.connect(this.options.devicePath, connectionOpts, function (info) {
            that.connectionId = info.connectionId;
            that.emit("open", info);
        });
    };

    p.listen = function () {
        osc.listenToTransport(this, chrome.serial, "connectionId");
    };

    p.sendRaw = function (encoded) {
        if (!this.connectionId) {
            return;
        }

        var that = this;

        chrome.serial.send(this.connectionId, encoded.buffer, function (bytesSent, err) {
            if (err) {
                that.emit("error", err + ". Total bytes sent: " + bytesSent);
            }
        });
    };

    p.close = function () {
        if (this.connectionId) {
            var that = this;
            chrome.serial.disconnect(this.connectionId, function (result) {
                if (result) {
                    that.emit("close");
                }
            });
        }
    };


    osc.UDPPort = function (options) {
        osc.Port.call(this, options);
        var o = this.options;
        o.localAddress = o.localAddress || "127.0.0.1";
        o.localPort = o.localPort !== undefined ? o.localPort : 57121;

        this.on("open", this.listen.bind(this));
    };

    p = osc.UDPPort.prototype = Object.create(osc.Port.prototype);
    p.constructor = osc.UDPPort;

    p.open = function () {
        var o = this.options,
            props = {
                persistent: o.persistent,
                name: o.name,
                bufferSize: o.bufferSize
            },
            that = this;

        chrome.sockets.udp.create(props, function (info) {
            that.socketId = info.socketId;
            that.bindSocket();
        });
    };

    p.bindSocket = function () {
        var that = this,
            o = this.options;

        chrome.sockets.udp.bind(this.socketId, o.localAddress, o.localPort, function (resultCode) {
            if (resultCode > 0) {
                osc.emitNetworkError(that, resultCode);
                return;
            }

            that.emit("open", resultCode);
        });
    };

    p.listen = function () {
        osc.listenToTransport(this, chrome.sockets.udp, "socketId");
    };

    p.sendRaw = function (encoded, address, port) {
        if (!this.socketId) {
            return;
        }

        var o = this.options,
            that = this;

        address = address || o.remoteAddress;
        port = port !== undefined ? port : o.remotePort;

        chrome.sockets.udp.send(this.socketId, encoded.buffer, address, port, function (info) {
            if (!info) {
                that.emit("error",
                    "There was an unknown error while trying to send a UDP message. " +
                    "Have you declared the appropriate udp send permissions " +
                    "in your application's manifest file?");
            }

            if (info.resultCode > 0) {
                osc.emitNetworkError(that, info.resultCode);
            }
        });
    };

    p.close = function () {
        if (this.socketId) {
            var that = this;
            chrome.sockets.udp.close(this.socketId, function () {
                that.emit("close");
            });
        }
    };
}());
;
/*
	Sensorsbox OSC-PROXY Logic
*/

Polymer('sensorsbox-osc-proxy', {
	observe : {
		'$.settingspage.remoteServer' : 'newRemoteServer',
		'$.settingspage.localPort' : 'newLocalPort'
	},
	newRemoteServer : function(oldValue, newValue){
		this.connection = new SensorsBox.Connection({
			host: newValue
		});
		this.connection.on('connect', function(){
			console.log('connection successfully established');
		});

		this.$.boxespage.remoteServer = newValue;
	},
	newLocalPort : function(oldValue, newValue){
		var _self = this;
		if (typeof(chrome.app.runtime) !== 'undefined') {
			this.oscPort = new osc.UDPPort({
				localAddress: '0.0.0.0',
				localPort: 0
			});
			this.oscPort.open();
			this.connection.on('measure', function(measure){
				console.log(measure);
				_self.oscPort.send({
					address: '/' + measure.data.box + '/' + measure.data.sensor,
					args: ['value', measure.data.value]
				}, '127.0.0.1', newValue);
			});
		}

		this.$.boxespage.localPort = newValue;
	},
	ready: function() {
		var _self = this;
		var pages = this.shadowRoot.querySelector('core-pages');
		var coreItems = this.shadowRoot.getElementsByTagName('core-icon-button');

		for (var i = 0; i < coreItems.length; i++) {
			coreItems[i].addEventListener('click', function(e) {
				pages.selected = this.dataset.pageindex;
			});
		}

		var boxes = this.shadowRoot.querySelector('sensorsbox-boxes');
		boxes.addEventListener('watchbox', function(e){
			_self.connection.watchBox(e.detail.boxid, function(){
				console.log('Now watching box ' + e.detail.boxid);
			});
		});
		boxes.addEventListener('unwatchbox', function(e){
			_self.connection.unwatchBox(e.detail.boxid, function(){
				console.log('Not watching box ' + e.detail.boxid + ' anymore');
			});
		})
	}
});
