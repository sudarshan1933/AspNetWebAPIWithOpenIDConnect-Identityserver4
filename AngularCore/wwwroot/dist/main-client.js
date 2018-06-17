/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest() { // eslint-disable-line no-unused-vars
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = 10000;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "08cdc346355601757864"; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/ 	
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest().then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			hotApply(hotApplyOnUpdate).then(function(result) {
/******/ 				deferred.resolve(result);
/******/ 			}, function(err) {
/******/ 				deferred.reject(err);
/******/ 			});
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				var callbacks = [];
/******/ 				for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 					dependency = moduleOutdatedDependencies[i];
/******/ 					cb = module.hot._acceptedDependencies[dependency];
/******/ 					if(callbacks.indexOf(cb) >= 0) continue;
/******/ 					callbacks.push(cb);
/******/ 				}
/******/ 				for(i = 0; i < callbacks.length; i++) {
/******/ 					cb = callbacks[i];
/******/ 					try {
/******/ 						cb(moduleOutdatedDependencies);
/******/ 					} catch(err) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "accept-errored",
/******/ 								moduleId: moduleId,
/******/ 								dependencyId: moduleOutdatedDependencies[i],
/******/ 								error: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err;
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return Promise.resolve(outdatedModules);
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "dist/";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(61)(__webpack_require__.s = 61);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = vendor_4adf5b975b06d7f766a2;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(3);

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AuthService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_oidc_client__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_oidc_client___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_oidc_client__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var settings = {
    authority: 'https://localhost:44381',
    client_id: 'AngularCore',
    redirect_uri: 'https://localhost:44301/authcallback',
    post_logout_redirect_uri: 'https://localhost:44301/',
    response_type: 'id_token token',
    scope: 'openid profile mywebapicore',
    accessTokenExpiringNotificationTime: 4,
    filterProtocolClaims: true,
    loadUserInfo: true
};
__WEBPACK_IMPORTED_MODULE_2_oidc_client__["Log"].logger = console;
__WEBPACK_IMPORTED_MODULE_2_oidc_client__["Log"].level = __WEBPACK_IMPORTED_MODULE_2_oidc_client__["Log"].DEBUG;
var AuthService = (function () {
    function AuthService(http) {
        var _this = this;
        this.http = http;
        this.mgr = new __WEBPACK_IMPORTED_MODULE_2_oidc_client__["UserManager"](settings);
        this.userLoadededEvent = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        this.loggedIn = false;
        this.mgr.getUser()
            .then(function (user) {
            if (user) {
                _this.loggedIn = true;
                _this.currentUser = user;
                _this.userLoadededEvent.emit(user);
            }
            else {
                _this.loggedIn = false;
            }
        })
            .catch(function (err) {
            _this.loggedIn = false;
        });
        // this.mgr.events.addUserLoaded((user) => {
        //   this.currentUser = user;
        //     console.log('authService addUserLoaded', user);
        // });
        // this.mgr.events.addUserUnloaded((e) => {
        //     console.log('user unloaded');
        //   this.loggedIn = false;
        // });
    }
    AuthService.prototype.isLoggedIn = function () {
        return this.currentUser != null && !this.currentUser.expired;
    };
    ;
    AuthService.prototype.getClaims = function () {
        return this.currentUser.profile;
    };
    ;
    AuthService.prototype.getAuthorizationHeaderValue = function () {
        return this.currentUser.token_type + " " + this.currentUser.access_token;
    };
    AuthService.prototype.startAuthentication = function () {
        return this.mgr.signinRedirect();
    };
    AuthService.prototype.completeAuthentication = function () {
        var _this = this;
        return this.mgr.signinRedirectCallback().then(function (user) {
            debugger;
            console.log('completeAuthentication');
            console.log(user);
            _this.currentUser = user;
            debugger;
            return _this.currentUser;
        });
    };
    AuthService = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_http__["Http"]])
    ], AuthService);
    return AuthService;
}());



/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(0);

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(41);

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(39);

/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var AppComponent = (function () {
    function AppComponent() {
        console.log('First Calling AuthService from AppComponent');
        debugger;
    }
    AppComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app',
            template: __webpack_require__(28),
            styles: [__webpack_require__(46)]
        }),
        __metadata("design:paramtypes", [])
    ], AppComponent);
    return AppComponent;
}());



/***/ }),
/* 7 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 8 */
/***/ (function(module, exports) {

var ENTITIES = [['Aacute', [193]], ['aacute', [225]], ['Abreve', [258]], ['abreve', [259]], ['ac', [8766]], ['acd', [8767]], ['acE', [8766, 819]], ['Acirc', [194]], ['acirc', [226]], ['acute', [180]], ['Acy', [1040]], ['acy', [1072]], ['AElig', [198]], ['aelig', [230]], ['af', [8289]], ['Afr', [120068]], ['afr', [120094]], ['Agrave', [192]], ['agrave', [224]], ['alefsym', [8501]], ['aleph', [8501]], ['Alpha', [913]], ['alpha', [945]], ['Amacr', [256]], ['amacr', [257]], ['amalg', [10815]], ['amp', [38]], ['AMP', [38]], ['andand', [10837]], ['And', [10835]], ['and', [8743]], ['andd', [10844]], ['andslope', [10840]], ['andv', [10842]], ['ang', [8736]], ['ange', [10660]], ['angle', [8736]], ['angmsdaa', [10664]], ['angmsdab', [10665]], ['angmsdac', [10666]], ['angmsdad', [10667]], ['angmsdae', [10668]], ['angmsdaf', [10669]], ['angmsdag', [10670]], ['angmsdah', [10671]], ['angmsd', [8737]], ['angrt', [8735]], ['angrtvb', [8894]], ['angrtvbd', [10653]], ['angsph', [8738]], ['angst', [197]], ['angzarr', [9084]], ['Aogon', [260]], ['aogon', [261]], ['Aopf', [120120]], ['aopf', [120146]], ['apacir', [10863]], ['ap', [8776]], ['apE', [10864]], ['ape', [8778]], ['apid', [8779]], ['apos', [39]], ['ApplyFunction', [8289]], ['approx', [8776]], ['approxeq', [8778]], ['Aring', [197]], ['aring', [229]], ['Ascr', [119964]], ['ascr', [119990]], ['Assign', [8788]], ['ast', [42]], ['asymp', [8776]], ['asympeq', [8781]], ['Atilde', [195]], ['atilde', [227]], ['Auml', [196]], ['auml', [228]], ['awconint', [8755]], ['awint', [10769]], ['backcong', [8780]], ['backepsilon', [1014]], ['backprime', [8245]], ['backsim', [8765]], ['backsimeq', [8909]], ['Backslash', [8726]], ['Barv', [10983]], ['barvee', [8893]], ['barwed', [8965]], ['Barwed', [8966]], ['barwedge', [8965]], ['bbrk', [9141]], ['bbrktbrk', [9142]], ['bcong', [8780]], ['Bcy', [1041]], ['bcy', [1073]], ['bdquo', [8222]], ['becaus', [8757]], ['because', [8757]], ['Because', [8757]], ['bemptyv', [10672]], ['bepsi', [1014]], ['bernou', [8492]], ['Bernoullis', [8492]], ['Beta', [914]], ['beta', [946]], ['beth', [8502]], ['between', [8812]], ['Bfr', [120069]], ['bfr', [120095]], ['bigcap', [8898]], ['bigcirc', [9711]], ['bigcup', [8899]], ['bigodot', [10752]], ['bigoplus', [10753]], ['bigotimes', [10754]], ['bigsqcup', [10758]], ['bigstar', [9733]], ['bigtriangledown', [9661]], ['bigtriangleup', [9651]], ['biguplus', [10756]], ['bigvee', [8897]], ['bigwedge', [8896]], ['bkarow', [10509]], ['blacklozenge', [10731]], ['blacksquare', [9642]], ['blacktriangle', [9652]], ['blacktriangledown', [9662]], ['blacktriangleleft', [9666]], ['blacktriangleright', [9656]], ['blank', [9251]], ['blk12', [9618]], ['blk14', [9617]], ['blk34', [9619]], ['block', [9608]], ['bne', [61, 8421]], ['bnequiv', [8801, 8421]], ['bNot', [10989]], ['bnot', [8976]], ['Bopf', [120121]], ['bopf', [120147]], ['bot', [8869]], ['bottom', [8869]], ['bowtie', [8904]], ['boxbox', [10697]], ['boxdl', [9488]], ['boxdL', [9557]], ['boxDl', [9558]], ['boxDL', [9559]], ['boxdr', [9484]], ['boxdR', [9554]], ['boxDr', [9555]], ['boxDR', [9556]], ['boxh', [9472]], ['boxH', [9552]], ['boxhd', [9516]], ['boxHd', [9572]], ['boxhD', [9573]], ['boxHD', [9574]], ['boxhu', [9524]], ['boxHu', [9575]], ['boxhU', [9576]], ['boxHU', [9577]], ['boxminus', [8863]], ['boxplus', [8862]], ['boxtimes', [8864]], ['boxul', [9496]], ['boxuL', [9563]], ['boxUl', [9564]], ['boxUL', [9565]], ['boxur', [9492]], ['boxuR', [9560]], ['boxUr', [9561]], ['boxUR', [9562]], ['boxv', [9474]], ['boxV', [9553]], ['boxvh', [9532]], ['boxvH', [9578]], ['boxVh', [9579]], ['boxVH', [9580]], ['boxvl', [9508]], ['boxvL', [9569]], ['boxVl', [9570]], ['boxVL', [9571]], ['boxvr', [9500]], ['boxvR', [9566]], ['boxVr', [9567]], ['boxVR', [9568]], ['bprime', [8245]], ['breve', [728]], ['Breve', [728]], ['brvbar', [166]], ['bscr', [119991]], ['Bscr', [8492]], ['bsemi', [8271]], ['bsim', [8765]], ['bsime', [8909]], ['bsolb', [10693]], ['bsol', [92]], ['bsolhsub', [10184]], ['bull', [8226]], ['bullet', [8226]], ['bump', [8782]], ['bumpE', [10926]], ['bumpe', [8783]], ['Bumpeq', [8782]], ['bumpeq', [8783]], ['Cacute', [262]], ['cacute', [263]], ['capand', [10820]], ['capbrcup', [10825]], ['capcap', [10827]], ['cap', [8745]], ['Cap', [8914]], ['capcup', [10823]], ['capdot', [10816]], ['CapitalDifferentialD', [8517]], ['caps', [8745, 65024]], ['caret', [8257]], ['caron', [711]], ['Cayleys', [8493]], ['ccaps', [10829]], ['Ccaron', [268]], ['ccaron', [269]], ['Ccedil', [199]], ['ccedil', [231]], ['Ccirc', [264]], ['ccirc', [265]], ['Cconint', [8752]], ['ccups', [10828]], ['ccupssm', [10832]], ['Cdot', [266]], ['cdot', [267]], ['cedil', [184]], ['Cedilla', [184]], ['cemptyv', [10674]], ['cent', [162]], ['centerdot', [183]], ['CenterDot', [183]], ['cfr', [120096]], ['Cfr', [8493]], ['CHcy', [1063]], ['chcy', [1095]], ['check', [10003]], ['checkmark', [10003]], ['Chi', [935]], ['chi', [967]], ['circ', [710]], ['circeq', [8791]], ['circlearrowleft', [8634]], ['circlearrowright', [8635]], ['circledast', [8859]], ['circledcirc', [8858]], ['circleddash', [8861]], ['CircleDot', [8857]], ['circledR', [174]], ['circledS', [9416]], ['CircleMinus', [8854]], ['CirclePlus', [8853]], ['CircleTimes', [8855]], ['cir', [9675]], ['cirE', [10691]], ['cire', [8791]], ['cirfnint', [10768]], ['cirmid', [10991]], ['cirscir', [10690]], ['ClockwiseContourIntegral', [8754]], ['clubs', [9827]], ['clubsuit', [9827]], ['colon', [58]], ['Colon', [8759]], ['Colone', [10868]], ['colone', [8788]], ['coloneq', [8788]], ['comma', [44]], ['commat', [64]], ['comp', [8705]], ['compfn', [8728]], ['complement', [8705]], ['complexes', [8450]], ['cong', [8773]], ['congdot', [10861]], ['Congruent', [8801]], ['conint', [8750]], ['Conint', [8751]], ['ContourIntegral', [8750]], ['copf', [120148]], ['Copf', [8450]], ['coprod', [8720]], ['Coproduct', [8720]], ['copy', [169]], ['COPY', [169]], ['copysr', [8471]], ['CounterClockwiseContourIntegral', [8755]], ['crarr', [8629]], ['cross', [10007]], ['Cross', [10799]], ['Cscr', [119966]], ['cscr', [119992]], ['csub', [10959]], ['csube', [10961]], ['csup', [10960]], ['csupe', [10962]], ['ctdot', [8943]], ['cudarrl', [10552]], ['cudarrr', [10549]], ['cuepr', [8926]], ['cuesc', [8927]], ['cularr', [8630]], ['cularrp', [10557]], ['cupbrcap', [10824]], ['cupcap', [10822]], ['CupCap', [8781]], ['cup', [8746]], ['Cup', [8915]], ['cupcup', [10826]], ['cupdot', [8845]], ['cupor', [10821]], ['cups', [8746, 65024]], ['curarr', [8631]], ['curarrm', [10556]], ['curlyeqprec', [8926]], ['curlyeqsucc', [8927]], ['curlyvee', [8910]], ['curlywedge', [8911]], ['curren', [164]], ['curvearrowleft', [8630]], ['curvearrowright', [8631]], ['cuvee', [8910]], ['cuwed', [8911]], ['cwconint', [8754]], ['cwint', [8753]], ['cylcty', [9005]], ['dagger', [8224]], ['Dagger', [8225]], ['daleth', [8504]], ['darr', [8595]], ['Darr', [8609]], ['dArr', [8659]], ['dash', [8208]], ['Dashv', [10980]], ['dashv', [8867]], ['dbkarow', [10511]], ['dblac', [733]], ['Dcaron', [270]], ['dcaron', [271]], ['Dcy', [1044]], ['dcy', [1076]], ['ddagger', [8225]], ['ddarr', [8650]], ['DD', [8517]], ['dd', [8518]], ['DDotrahd', [10513]], ['ddotseq', [10871]], ['deg', [176]], ['Del', [8711]], ['Delta', [916]], ['delta', [948]], ['demptyv', [10673]], ['dfisht', [10623]], ['Dfr', [120071]], ['dfr', [120097]], ['dHar', [10597]], ['dharl', [8643]], ['dharr', [8642]], ['DiacriticalAcute', [180]], ['DiacriticalDot', [729]], ['DiacriticalDoubleAcute', [733]], ['DiacriticalGrave', [96]], ['DiacriticalTilde', [732]], ['diam', [8900]], ['diamond', [8900]], ['Diamond', [8900]], ['diamondsuit', [9830]], ['diams', [9830]], ['die', [168]], ['DifferentialD', [8518]], ['digamma', [989]], ['disin', [8946]], ['div', [247]], ['divide', [247]], ['divideontimes', [8903]], ['divonx', [8903]], ['DJcy', [1026]], ['djcy', [1106]], ['dlcorn', [8990]], ['dlcrop', [8973]], ['dollar', [36]], ['Dopf', [120123]], ['dopf', [120149]], ['Dot', [168]], ['dot', [729]], ['DotDot', [8412]], ['doteq', [8784]], ['doteqdot', [8785]], ['DotEqual', [8784]], ['dotminus', [8760]], ['dotplus', [8724]], ['dotsquare', [8865]], ['doublebarwedge', [8966]], ['DoubleContourIntegral', [8751]], ['DoubleDot', [168]], ['DoubleDownArrow', [8659]], ['DoubleLeftArrow', [8656]], ['DoubleLeftRightArrow', [8660]], ['DoubleLeftTee', [10980]], ['DoubleLongLeftArrow', [10232]], ['DoubleLongLeftRightArrow', [10234]], ['DoubleLongRightArrow', [10233]], ['DoubleRightArrow', [8658]], ['DoubleRightTee', [8872]], ['DoubleUpArrow', [8657]], ['DoubleUpDownArrow', [8661]], ['DoubleVerticalBar', [8741]], ['DownArrowBar', [10515]], ['downarrow', [8595]], ['DownArrow', [8595]], ['Downarrow', [8659]], ['DownArrowUpArrow', [8693]], ['DownBreve', [785]], ['downdownarrows', [8650]], ['downharpoonleft', [8643]], ['downharpoonright', [8642]], ['DownLeftRightVector', [10576]], ['DownLeftTeeVector', [10590]], ['DownLeftVectorBar', [10582]], ['DownLeftVector', [8637]], ['DownRightTeeVector', [10591]], ['DownRightVectorBar', [10583]], ['DownRightVector', [8641]], ['DownTeeArrow', [8615]], ['DownTee', [8868]], ['drbkarow', [10512]], ['drcorn', [8991]], ['drcrop', [8972]], ['Dscr', [119967]], ['dscr', [119993]], ['DScy', [1029]], ['dscy', [1109]], ['dsol', [10742]], ['Dstrok', [272]], ['dstrok', [273]], ['dtdot', [8945]], ['dtri', [9663]], ['dtrif', [9662]], ['duarr', [8693]], ['duhar', [10607]], ['dwangle', [10662]], ['DZcy', [1039]], ['dzcy', [1119]], ['dzigrarr', [10239]], ['Eacute', [201]], ['eacute', [233]], ['easter', [10862]], ['Ecaron', [282]], ['ecaron', [283]], ['Ecirc', [202]], ['ecirc', [234]], ['ecir', [8790]], ['ecolon', [8789]], ['Ecy', [1069]], ['ecy', [1101]], ['eDDot', [10871]], ['Edot', [278]], ['edot', [279]], ['eDot', [8785]], ['ee', [8519]], ['efDot', [8786]], ['Efr', [120072]], ['efr', [120098]], ['eg', [10906]], ['Egrave', [200]], ['egrave', [232]], ['egs', [10902]], ['egsdot', [10904]], ['el', [10905]], ['Element', [8712]], ['elinters', [9191]], ['ell', [8467]], ['els', [10901]], ['elsdot', [10903]], ['Emacr', [274]], ['emacr', [275]], ['empty', [8709]], ['emptyset', [8709]], ['EmptySmallSquare', [9723]], ['emptyv', [8709]], ['EmptyVerySmallSquare', [9643]], ['emsp13', [8196]], ['emsp14', [8197]], ['emsp', [8195]], ['ENG', [330]], ['eng', [331]], ['ensp', [8194]], ['Eogon', [280]], ['eogon', [281]], ['Eopf', [120124]], ['eopf', [120150]], ['epar', [8917]], ['eparsl', [10723]], ['eplus', [10865]], ['epsi', [949]], ['Epsilon', [917]], ['epsilon', [949]], ['epsiv', [1013]], ['eqcirc', [8790]], ['eqcolon', [8789]], ['eqsim', [8770]], ['eqslantgtr', [10902]], ['eqslantless', [10901]], ['Equal', [10869]], ['equals', [61]], ['EqualTilde', [8770]], ['equest', [8799]], ['Equilibrium', [8652]], ['equiv', [8801]], ['equivDD', [10872]], ['eqvparsl', [10725]], ['erarr', [10609]], ['erDot', [8787]], ['escr', [8495]], ['Escr', [8496]], ['esdot', [8784]], ['Esim', [10867]], ['esim', [8770]], ['Eta', [919]], ['eta', [951]], ['ETH', [208]], ['eth', [240]], ['Euml', [203]], ['euml', [235]], ['euro', [8364]], ['excl', [33]], ['exist', [8707]], ['Exists', [8707]], ['expectation', [8496]], ['exponentiale', [8519]], ['ExponentialE', [8519]], ['fallingdotseq', [8786]], ['Fcy', [1060]], ['fcy', [1092]], ['female', [9792]], ['ffilig', [64259]], ['fflig', [64256]], ['ffllig', [64260]], ['Ffr', [120073]], ['ffr', [120099]], ['filig', [64257]], ['FilledSmallSquare', [9724]], ['FilledVerySmallSquare', [9642]], ['fjlig', [102, 106]], ['flat', [9837]], ['fllig', [64258]], ['fltns', [9649]], ['fnof', [402]], ['Fopf', [120125]], ['fopf', [120151]], ['forall', [8704]], ['ForAll', [8704]], ['fork', [8916]], ['forkv', [10969]], ['Fouriertrf', [8497]], ['fpartint', [10765]], ['frac12', [189]], ['frac13', [8531]], ['frac14', [188]], ['frac15', [8533]], ['frac16', [8537]], ['frac18', [8539]], ['frac23', [8532]], ['frac25', [8534]], ['frac34', [190]], ['frac35', [8535]], ['frac38', [8540]], ['frac45', [8536]], ['frac56', [8538]], ['frac58', [8541]], ['frac78', [8542]], ['frasl', [8260]], ['frown', [8994]], ['fscr', [119995]], ['Fscr', [8497]], ['gacute', [501]], ['Gamma', [915]], ['gamma', [947]], ['Gammad', [988]], ['gammad', [989]], ['gap', [10886]], ['Gbreve', [286]], ['gbreve', [287]], ['Gcedil', [290]], ['Gcirc', [284]], ['gcirc', [285]], ['Gcy', [1043]], ['gcy', [1075]], ['Gdot', [288]], ['gdot', [289]], ['ge', [8805]], ['gE', [8807]], ['gEl', [10892]], ['gel', [8923]], ['geq', [8805]], ['geqq', [8807]], ['geqslant', [10878]], ['gescc', [10921]], ['ges', [10878]], ['gesdot', [10880]], ['gesdoto', [10882]], ['gesdotol', [10884]], ['gesl', [8923, 65024]], ['gesles', [10900]], ['Gfr', [120074]], ['gfr', [120100]], ['gg', [8811]], ['Gg', [8921]], ['ggg', [8921]], ['gimel', [8503]], ['GJcy', [1027]], ['gjcy', [1107]], ['gla', [10917]], ['gl', [8823]], ['glE', [10898]], ['glj', [10916]], ['gnap', [10890]], ['gnapprox', [10890]], ['gne', [10888]], ['gnE', [8809]], ['gneq', [10888]], ['gneqq', [8809]], ['gnsim', [8935]], ['Gopf', [120126]], ['gopf', [120152]], ['grave', [96]], ['GreaterEqual', [8805]], ['GreaterEqualLess', [8923]], ['GreaterFullEqual', [8807]], ['GreaterGreater', [10914]], ['GreaterLess', [8823]], ['GreaterSlantEqual', [10878]], ['GreaterTilde', [8819]], ['Gscr', [119970]], ['gscr', [8458]], ['gsim', [8819]], ['gsime', [10894]], ['gsiml', [10896]], ['gtcc', [10919]], ['gtcir', [10874]], ['gt', [62]], ['GT', [62]], ['Gt', [8811]], ['gtdot', [8919]], ['gtlPar', [10645]], ['gtquest', [10876]], ['gtrapprox', [10886]], ['gtrarr', [10616]], ['gtrdot', [8919]], ['gtreqless', [8923]], ['gtreqqless', [10892]], ['gtrless', [8823]], ['gtrsim', [8819]], ['gvertneqq', [8809, 65024]], ['gvnE', [8809, 65024]], ['Hacek', [711]], ['hairsp', [8202]], ['half', [189]], ['hamilt', [8459]], ['HARDcy', [1066]], ['hardcy', [1098]], ['harrcir', [10568]], ['harr', [8596]], ['hArr', [8660]], ['harrw', [8621]], ['Hat', [94]], ['hbar', [8463]], ['Hcirc', [292]], ['hcirc', [293]], ['hearts', [9829]], ['heartsuit', [9829]], ['hellip', [8230]], ['hercon', [8889]], ['hfr', [120101]], ['Hfr', [8460]], ['HilbertSpace', [8459]], ['hksearow', [10533]], ['hkswarow', [10534]], ['hoarr', [8703]], ['homtht', [8763]], ['hookleftarrow', [8617]], ['hookrightarrow', [8618]], ['hopf', [120153]], ['Hopf', [8461]], ['horbar', [8213]], ['HorizontalLine', [9472]], ['hscr', [119997]], ['Hscr', [8459]], ['hslash', [8463]], ['Hstrok', [294]], ['hstrok', [295]], ['HumpDownHump', [8782]], ['HumpEqual', [8783]], ['hybull', [8259]], ['hyphen', [8208]], ['Iacute', [205]], ['iacute', [237]], ['ic', [8291]], ['Icirc', [206]], ['icirc', [238]], ['Icy', [1048]], ['icy', [1080]], ['Idot', [304]], ['IEcy', [1045]], ['iecy', [1077]], ['iexcl', [161]], ['iff', [8660]], ['ifr', [120102]], ['Ifr', [8465]], ['Igrave', [204]], ['igrave', [236]], ['ii', [8520]], ['iiiint', [10764]], ['iiint', [8749]], ['iinfin', [10716]], ['iiota', [8489]], ['IJlig', [306]], ['ijlig', [307]], ['Imacr', [298]], ['imacr', [299]], ['image', [8465]], ['ImaginaryI', [8520]], ['imagline', [8464]], ['imagpart', [8465]], ['imath', [305]], ['Im', [8465]], ['imof', [8887]], ['imped', [437]], ['Implies', [8658]], ['incare', [8453]], ['in', [8712]], ['infin', [8734]], ['infintie', [10717]], ['inodot', [305]], ['intcal', [8890]], ['int', [8747]], ['Int', [8748]], ['integers', [8484]], ['Integral', [8747]], ['intercal', [8890]], ['Intersection', [8898]], ['intlarhk', [10775]], ['intprod', [10812]], ['InvisibleComma', [8291]], ['InvisibleTimes', [8290]], ['IOcy', [1025]], ['iocy', [1105]], ['Iogon', [302]], ['iogon', [303]], ['Iopf', [120128]], ['iopf', [120154]], ['Iota', [921]], ['iota', [953]], ['iprod', [10812]], ['iquest', [191]], ['iscr', [119998]], ['Iscr', [8464]], ['isin', [8712]], ['isindot', [8949]], ['isinE', [8953]], ['isins', [8948]], ['isinsv', [8947]], ['isinv', [8712]], ['it', [8290]], ['Itilde', [296]], ['itilde', [297]], ['Iukcy', [1030]], ['iukcy', [1110]], ['Iuml', [207]], ['iuml', [239]], ['Jcirc', [308]], ['jcirc', [309]], ['Jcy', [1049]], ['jcy', [1081]], ['Jfr', [120077]], ['jfr', [120103]], ['jmath', [567]], ['Jopf', [120129]], ['jopf', [120155]], ['Jscr', [119973]], ['jscr', [119999]], ['Jsercy', [1032]], ['jsercy', [1112]], ['Jukcy', [1028]], ['jukcy', [1108]], ['Kappa', [922]], ['kappa', [954]], ['kappav', [1008]], ['Kcedil', [310]], ['kcedil', [311]], ['Kcy', [1050]], ['kcy', [1082]], ['Kfr', [120078]], ['kfr', [120104]], ['kgreen', [312]], ['KHcy', [1061]], ['khcy', [1093]], ['KJcy', [1036]], ['kjcy', [1116]], ['Kopf', [120130]], ['kopf', [120156]], ['Kscr', [119974]], ['kscr', [120000]], ['lAarr', [8666]], ['Lacute', [313]], ['lacute', [314]], ['laemptyv', [10676]], ['lagran', [8466]], ['Lambda', [923]], ['lambda', [955]], ['lang', [10216]], ['Lang', [10218]], ['langd', [10641]], ['langle', [10216]], ['lap', [10885]], ['Laplacetrf', [8466]], ['laquo', [171]], ['larrb', [8676]], ['larrbfs', [10527]], ['larr', [8592]], ['Larr', [8606]], ['lArr', [8656]], ['larrfs', [10525]], ['larrhk', [8617]], ['larrlp', [8619]], ['larrpl', [10553]], ['larrsim', [10611]], ['larrtl', [8610]], ['latail', [10521]], ['lAtail', [10523]], ['lat', [10923]], ['late', [10925]], ['lates', [10925, 65024]], ['lbarr', [10508]], ['lBarr', [10510]], ['lbbrk', [10098]], ['lbrace', [123]], ['lbrack', [91]], ['lbrke', [10635]], ['lbrksld', [10639]], ['lbrkslu', [10637]], ['Lcaron', [317]], ['lcaron', [318]], ['Lcedil', [315]], ['lcedil', [316]], ['lceil', [8968]], ['lcub', [123]], ['Lcy', [1051]], ['lcy', [1083]], ['ldca', [10550]], ['ldquo', [8220]], ['ldquor', [8222]], ['ldrdhar', [10599]], ['ldrushar', [10571]], ['ldsh', [8626]], ['le', [8804]], ['lE', [8806]], ['LeftAngleBracket', [10216]], ['LeftArrowBar', [8676]], ['leftarrow', [8592]], ['LeftArrow', [8592]], ['Leftarrow', [8656]], ['LeftArrowRightArrow', [8646]], ['leftarrowtail', [8610]], ['LeftCeiling', [8968]], ['LeftDoubleBracket', [10214]], ['LeftDownTeeVector', [10593]], ['LeftDownVectorBar', [10585]], ['LeftDownVector', [8643]], ['LeftFloor', [8970]], ['leftharpoondown', [8637]], ['leftharpoonup', [8636]], ['leftleftarrows', [8647]], ['leftrightarrow', [8596]], ['LeftRightArrow', [8596]], ['Leftrightarrow', [8660]], ['leftrightarrows', [8646]], ['leftrightharpoons', [8651]], ['leftrightsquigarrow', [8621]], ['LeftRightVector', [10574]], ['LeftTeeArrow', [8612]], ['LeftTee', [8867]], ['LeftTeeVector', [10586]], ['leftthreetimes', [8907]], ['LeftTriangleBar', [10703]], ['LeftTriangle', [8882]], ['LeftTriangleEqual', [8884]], ['LeftUpDownVector', [10577]], ['LeftUpTeeVector', [10592]], ['LeftUpVectorBar', [10584]], ['LeftUpVector', [8639]], ['LeftVectorBar', [10578]], ['LeftVector', [8636]], ['lEg', [10891]], ['leg', [8922]], ['leq', [8804]], ['leqq', [8806]], ['leqslant', [10877]], ['lescc', [10920]], ['les', [10877]], ['lesdot', [10879]], ['lesdoto', [10881]], ['lesdotor', [10883]], ['lesg', [8922, 65024]], ['lesges', [10899]], ['lessapprox', [10885]], ['lessdot', [8918]], ['lesseqgtr', [8922]], ['lesseqqgtr', [10891]], ['LessEqualGreater', [8922]], ['LessFullEqual', [8806]], ['LessGreater', [8822]], ['lessgtr', [8822]], ['LessLess', [10913]], ['lesssim', [8818]], ['LessSlantEqual', [10877]], ['LessTilde', [8818]], ['lfisht', [10620]], ['lfloor', [8970]], ['Lfr', [120079]], ['lfr', [120105]], ['lg', [8822]], ['lgE', [10897]], ['lHar', [10594]], ['lhard', [8637]], ['lharu', [8636]], ['lharul', [10602]], ['lhblk', [9604]], ['LJcy', [1033]], ['ljcy', [1113]], ['llarr', [8647]], ['ll', [8810]], ['Ll', [8920]], ['llcorner', [8990]], ['Lleftarrow', [8666]], ['llhard', [10603]], ['lltri', [9722]], ['Lmidot', [319]], ['lmidot', [320]], ['lmoustache', [9136]], ['lmoust', [9136]], ['lnap', [10889]], ['lnapprox', [10889]], ['lne', [10887]], ['lnE', [8808]], ['lneq', [10887]], ['lneqq', [8808]], ['lnsim', [8934]], ['loang', [10220]], ['loarr', [8701]], ['lobrk', [10214]], ['longleftarrow', [10229]], ['LongLeftArrow', [10229]], ['Longleftarrow', [10232]], ['longleftrightarrow', [10231]], ['LongLeftRightArrow', [10231]], ['Longleftrightarrow', [10234]], ['longmapsto', [10236]], ['longrightarrow', [10230]], ['LongRightArrow', [10230]], ['Longrightarrow', [10233]], ['looparrowleft', [8619]], ['looparrowright', [8620]], ['lopar', [10629]], ['Lopf', [120131]], ['lopf', [120157]], ['loplus', [10797]], ['lotimes', [10804]], ['lowast', [8727]], ['lowbar', [95]], ['LowerLeftArrow', [8601]], ['LowerRightArrow', [8600]], ['loz', [9674]], ['lozenge', [9674]], ['lozf', [10731]], ['lpar', [40]], ['lparlt', [10643]], ['lrarr', [8646]], ['lrcorner', [8991]], ['lrhar', [8651]], ['lrhard', [10605]], ['lrm', [8206]], ['lrtri', [8895]], ['lsaquo', [8249]], ['lscr', [120001]], ['Lscr', [8466]], ['lsh', [8624]], ['Lsh', [8624]], ['lsim', [8818]], ['lsime', [10893]], ['lsimg', [10895]], ['lsqb', [91]], ['lsquo', [8216]], ['lsquor', [8218]], ['Lstrok', [321]], ['lstrok', [322]], ['ltcc', [10918]], ['ltcir', [10873]], ['lt', [60]], ['LT', [60]], ['Lt', [8810]], ['ltdot', [8918]], ['lthree', [8907]], ['ltimes', [8905]], ['ltlarr', [10614]], ['ltquest', [10875]], ['ltri', [9667]], ['ltrie', [8884]], ['ltrif', [9666]], ['ltrPar', [10646]], ['lurdshar', [10570]], ['luruhar', [10598]], ['lvertneqq', [8808, 65024]], ['lvnE', [8808, 65024]], ['macr', [175]], ['male', [9794]], ['malt', [10016]], ['maltese', [10016]], ['Map', [10501]], ['map', [8614]], ['mapsto', [8614]], ['mapstodown', [8615]], ['mapstoleft', [8612]], ['mapstoup', [8613]], ['marker', [9646]], ['mcomma', [10793]], ['Mcy', [1052]], ['mcy', [1084]], ['mdash', [8212]], ['mDDot', [8762]], ['measuredangle', [8737]], ['MediumSpace', [8287]], ['Mellintrf', [8499]], ['Mfr', [120080]], ['mfr', [120106]], ['mho', [8487]], ['micro', [181]], ['midast', [42]], ['midcir', [10992]], ['mid', [8739]], ['middot', [183]], ['minusb', [8863]], ['minus', [8722]], ['minusd', [8760]], ['minusdu', [10794]], ['MinusPlus', [8723]], ['mlcp', [10971]], ['mldr', [8230]], ['mnplus', [8723]], ['models', [8871]], ['Mopf', [120132]], ['mopf', [120158]], ['mp', [8723]], ['mscr', [120002]], ['Mscr', [8499]], ['mstpos', [8766]], ['Mu', [924]], ['mu', [956]], ['multimap', [8888]], ['mumap', [8888]], ['nabla', [8711]], ['Nacute', [323]], ['nacute', [324]], ['nang', [8736, 8402]], ['nap', [8777]], ['napE', [10864, 824]], ['napid', [8779, 824]], ['napos', [329]], ['napprox', [8777]], ['natural', [9838]], ['naturals', [8469]], ['natur', [9838]], ['nbsp', [160]], ['nbump', [8782, 824]], ['nbumpe', [8783, 824]], ['ncap', [10819]], ['Ncaron', [327]], ['ncaron', [328]], ['Ncedil', [325]], ['ncedil', [326]], ['ncong', [8775]], ['ncongdot', [10861, 824]], ['ncup', [10818]], ['Ncy', [1053]], ['ncy', [1085]], ['ndash', [8211]], ['nearhk', [10532]], ['nearr', [8599]], ['neArr', [8663]], ['nearrow', [8599]], ['ne', [8800]], ['nedot', [8784, 824]], ['NegativeMediumSpace', [8203]], ['NegativeThickSpace', [8203]], ['NegativeThinSpace', [8203]], ['NegativeVeryThinSpace', [8203]], ['nequiv', [8802]], ['nesear', [10536]], ['nesim', [8770, 824]], ['NestedGreaterGreater', [8811]], ['NestedLessLess', [8810]], ['nexist', [8708]], ['nexists', [8708]], ['Nfr', [120081]], ['nfr', [120107]], ['ngE', [8807, 824]], ['nge', [8817]], ['ngeq', [8817]], ['ngeqq', [8807, 824]], ['ngeqslant', [10878, 824]], ['nges', [10878, 824]], ['nGg', [8921, 824]], ['ngsim', [8821]], ['nGt', [8811, 8402]], ['ngt', [8815]], ['ngtr', [8815]], ['nGtv', [8811, 824]], ['nharr', [8622]], ['nhArr', [8654]], ['nhpar', [10994]], ['ni', [8715]], ['nis', [8956]], ['nisd', [8954]], ['niv', [8715]], ['NJcy', [1034]], ['njcy', [1114]], ['nlarr', [8602]], ['nlArr', [8653]], ['nldr', [8229]], ['nlE', [8806, 824]], ['nle', [8816]], ['nleftarrow', [8602]], ['nLeftarrow', [8653]], ['nleftrightarrow', [8622]], ['nLeftrightarrow', [8654]], ['nleq', [8816]], ['nleqq', [8806, 824]], ['nleqslant', [10877, 824]], ['nles', [10877, 824]], ['nless', [8814]], ['nLl', [8920, 824]], ['nlsim', [8820]], ['nLt', [8810, 8402]], ['nlt', [8814]], ['nltri', [8938]], ['nltrie', [8940]], ['nLtv', [8810, 824]], ['nmid', [8740]], ['NoBreak', [8288]], ['NonBreakingSpace', [160]], ['nopf', [120159]], ['Nopf', [8469]], ['Not', [10988]], ['not', [172]], ['NotCongruent', [8802]], ['NotCupCap', [8813]], ['NotDoubleVerticalBar', [8742]], ['NotElement', [8713]], ['NotEqual', [8800]], ['NotEqualTilde', [8770, 824]], ['NotExists', [8708]], ['NotGreater', [8815]], ['NotGreaterEqual', [8817]], ['NotGreaterFullEqual', [8807, 824]], ['NotGreaterGreater', [8811, 824]], ['NotGreaterLess', [8825]], ['NotGreaterSlantEqual', [10878, 824]], ['NotGreaterTilde', [8821]], ['NotHumpDownHump', [8782, 824]], ['NotHumpEqual', [8783, 824]], ['notin', [8713]], ['notindot', [8949, 824]], ['notinE', [8953, 824]], ['notinva', [8713]], ['notinvb', [8951]], ['notinvc', [8950]], ['NotLeftTriangleBar', [10703, 824]], ['NotLeftTriangle', [8938]], ['NotLeftTriangleEqual', [8940]], ['NotLess', [8814]], ['NotLessEqual', [8816]], ['NotLessGreater', [8824]], ['NotLessLess', [8810, 824]], ['NotLessSlantEqual', [10877, 824]], ['NotLessTilde', [8820]], ['NotNestedGreaterGreater', [10914, 824]], ['NotNestedLessLess', [10913, 824]], ['notni', [8716]], ['notniva', [8716]], ['notnivb', [8958]], ['notnivc', [8957]], ['NotPrecedes', [8832]], ['NotPrecedesEqual', [10927, 824]], ['NotPrecedesSlantEqual', [8928]], ['NotReverseElement', [8716]], ['NotRightTriangleBar', [10704, 824]], ['NotRightTriangle', [8939]], ['NotRightTriangleEqual', [8941]], ['NotSquareSubset', [8847, 824]], ['NotSquareSubsetEqual', [8930]], ['NotSquareSuperset', [8848, 824]], ['NotSquareSupersetEqual', [8931]], ['NotSubset', [8834, 8402]], ['NotSubsetEqual', [8840]], ['NotSucceeds', [8833]], ['NotSucceedsEqual', [10928, 824]], ['NotSucceedsSlantEqual', [8929]], ['NotSucceedsTilde', [8831, 824]], ['NotSuperset', [8835, 8402]], ['NotSupersetEqual', [8841]], ['NotTilde', [8769]], ['NotTildeEqual', [8772]], ['NotTildeFullEqual', [8775]], ['NotTildeTilde', [8777]], ['NotVerticalBar', [8740]], ['nparallel', [8742]], ['npar', [8742]], ['nparsl', [11005, 8421]], ['npart', [8706, 824]], ['npolint', [10772]], ['npr', [8832]], ['nprcue', [8928]], ['nprec', [8832]], ['npreceq', [10927, 824]], ['npre', [10927, 824]], ['nrarrc', [10547, 824]], ['nrarr', [8603]], ['nrArr', [8655]], ['nrarrw', [8605, 824]], ['nrightarrow', [8603]], ['nRightarrow', [8655]], ['nrtri', [8939]], ['nrtrie', [8941]], ['nsc', [8833]], ['nsccue', [8929]], ['nsce', [10928, 824]], ['Nscr', [119977]], ['nscr', [120003]], ['nshortmid', [8740]], ['nshortparallel', [8742]], ['nsim', [8769]], ['nsime', [8772]], ['nsimeq', [8772]], ['nsmid', [8740]], ['nspar', [8742]], ['nsqsube', [8930]], ['nsqsupe', [8931]], ['nsub', [8836]], ['nsubE', [10949, 824]], ['nsube', [8840]], ['nsubset', [8834, 8402]], ['nsubseteq', [8840]], ['nsubseteqq', [10949, 824]], ['nsucc', [8833]], ['nsucceq', [10928, 824]], ['nsup', [8837]], ['nsupE', [10950, 824]], ['nsupe', [8841]], ['nsupset', [8835, 8402]], ['nsupseteq', [8841]], ['nsupseteqq', [10950, 824]], ['ntgl', [8825]], ['Ntilde', [209]], ['ntilde', [241]], ['ntlg', [8824]], ['ntriangleleft', [8938]], ['ntrianglelefteq', [8940]], ['ntriangleright', [8939]], ['ntrianglerighteq', [8941]], ['Nu', [925]], ['nu', [957]], ['num', [35]], ['numero', [8470]], ['numsp', [8199]], ['nvap', [8781, 8402]], ['nvdash', [8876]], ['nvDash', [8877]], ['nVdash', [8878]], ['nVDash', [8879]], ['nvge', [8805, 8402]], ['nvgt', [62, 8402]], ['nvHarr', [10500]], ['nvinfin', [10718]], ['nvlArr', [10498]], ['nvle', [8804, 8402]], ['nvlt', [60, 8402]], ['nvltrie', [8884, 8402]], ['nvrArr', [10499]], ['nvrtrie', [8885, 8402]], ['nvsim', [8764, 8402]], ['nwarhk', [10531]], ['nwarr', [8598]], ['nwArr', [8662]], ['nwarrow', [8598]], ['nwnear', [10535]], ['Oacute', [211]], ['oacute', [243]], ['oast', [8859]], ['Ocirc', [212]], ['ocirc', [244]], ['ocir', [8858]], ['Ocy', [1054]], ['ocy', [1086]], ['odash', [8861]], ['Odblac', [336]], ['odblac', [337]], ['odiv', [10808]], ['odot', [8857]], ['odsold', [10684]], ['OElig', [338]], ['oelig', [339]], ['ofcir', [10687]], ['Ofr', [120082]], ['ofr', [120108]], ['ogon', [731]], ['Ograve', [210]], ['ograve', [242]], ['ogt', [10689]], ['ohbar', [10677]], ['ohm', [937]], ['oint', [8750]], ['olarr', [8634]], ['olcir', [10686]], ['olcross', [10683]], ['oline', [8254]], ['olt', [10688]], ['Omacr', [332]], ['omacr', [333]], ['Omega', [937]], ['omega', [969]], ['Omicron', [927]], ['omicron', [959]], ['omid', [10678]], ['ominus', [8854]], ['Oopf', [120134]], ['oopf', [120160]], ['opar', [10679]], ['OpenCurlyDoubleQuote', [8220]], ['OpenCurlyQuote', [8216]], ['operp', [10681]], ['oplus', [8853]], ['orarr', [8635]], ['Or', [10836]], ['or', [8744]], ['ord', [10845]], ['order', [8500]], ['orderof', [8500]], ['ordf', [170]], ['ordm', [186]], ['origof', [8886]], ['oror', [10838]], ['orslope', [10839]], ['orv', [10843]], ['oS', [9416]], ['Oscr', [119978]], ['oscr', [8500]], ['Oslash', [216]], ['oslash', [248]], ['osol', [8856]], ['Otilde', [213]], ['otilde', [245]], ['otimesas', [10806]], ['Otimes', [10807]], ['otimes', [8855]], ['Ouml', [214]], ['ouml', [246]], ['ovbar', [9021]], ['OverBar', [8254]], ['OverBrace', [9182]], ['OverBracket', [9140]], ['OverParenthesis', [9180]], ['para', [182]], ['parallel', [8741]], ['par', [8741]], ['parsim', [10995]], ['parsl', [11005]], ['part', [8706]], ['PartialD', [8706]], ['Pcy', [1055]], ['pcy', [1087]], ['percnt', [37]], ['period', [46]], ['permil', [8240]], ['perp', [8869]], ['pertenk', [8241]], ['Pfr', [120083]], ['pfr', [120109]], ['Phi', [934]], ['phi', [966]], ['phiv', [981]], ['phmmat', [8499]], ['phone', [9742]], ['Pi', [928]], ['pi', [960]], ['pitchfork', [8916]], ['piv', [982]], ['planck', [8463]], ['planckh', [8462]], ['plankv', [8463]], ['plusacir', [10787]], ['plusb', [8862]], ['pluscir', [10786]], ['plus', [43]], ['plusdo', [8724]], ['plusdu', [10789]], ['pluse', [10866]], ['PlusMinus', [177]], ['plusmn', [177]], ['plussim', [10790]], ['plustwo', [10791]], ['pm', [177]], ['Poincareplane', [8460]], ['pointint', [10773]], ['popf', [120161]], ['Popf', [8473]], ['pound', [163]], ['prap', [10935]], ['Pr', [10939]], ['pr', [8826]], ['prcue', [8828]], ['precapprox', [10935]], ['prec', [8826]], ['preccurlyeq', [8828]], ['Precedes', [8826]], ['PrecedesEqual', [10927]], ['PrecedesSlantEqual', [8828]], ['PrecedesTilde', [8830]], ['preceq', [10927]], ['precnapprox', [10937]], ['precneqq', [10933]], ['precnsim', [8936]], ['pre', [10927]], ['prE', [10931]], ['precsim', [8830]], ['prime', [8242]], ['Prime', [8243]], ['primes', [8473]], ['prnap', [10937]], ['prnE', [10933]], ['prnsim', [8936]], ['prod', [8719]], ['Product', [8719]], ['profalar', [9006]], ['profline', [8978]], ['profsurf', [8979]], ['prop', [8733]], ['Proportional', [8733]], ['Proportion', [8759]], ['propto', [8733]], ['prsim', [8830]], ['prurel', [8880]], ['Pscr', [119979]], ['pscr', [120005]], ['Psi', [936]], ['psi', [968]], ['puncsp', [8200]], ['Qfr', [120084]], ['qfr', [120110]], ['qint', [10764]], ['qopf', [120162]], ['Qopf', [8474]], ['qprime', [8279]], ['Qscr', [119980]], ['qscr', [120006]], ['quaternions', [8461]], ['quatint', [10774]], ['quest', [63]], ['questeq', [8799]], ['quot', [34]], ['QUOT', [34]], ['rAarr', [8667]], ['race', [8765, 817]], ['Racute', [340]], ['racute', [341]], ['radic', [8730]], ['raemptyv', [10675]], ['rang', [10217]], ['Rang', [10219]], ['rangd', [10642]], ['range', [10661]], ['rangle', [10217]], ['raquo', [187]], ['rarrap', [10613]], ['rarrb', [8677]], ['rarrbfs', [10528]], ['rarrc', [10547]], ['rarr', [8594]], ['Rarr', [8608]], ['rArr', [8658]], ['rarrfs', [10526]], ['rarrhk', [8618]], ['rarrlp', [8620]], ['rarrpl', [10565]], ['rarrsim', [10612]], ['Rarrtl', [10518]], ['rarrtl', [8611]], ['rarrw', [8605]], ['ratail', [10522]], ['rAtail', [10524]], ['ratio', [8758]], ['rationals', [8474]], ['rbarr', [10509]], ['rBarr', [10511]], ['RBarr', [10512]], ['rbbrk', [10099]], ['rbrace', [125]], ['rbrack', [93]], ['rbrke', [10636]], ['rbrksld', [10638]], ['rbrkslu', [10640]], ['Rcaron', [344]], ['rcaron', [345]], ['Rcedil', [342]], ['rcedil', [343]], ['rceil', [8969]], ['rcub', [125]], ['Rcy', [1056]], ['rcy', [1088]], ['rdca', [10551]], ['rdldhar', [10601]], ['rdquo', [8221]], ['rdquor', [8221]], ['CloseCurlyDoubleQuote', [8221]], ['rdsh', [8627]], ['real', [8476]], ['realine', [8475]], ['realpart', [8476]], ['reals', [8477]], ['Re', [8476]], ['rect', [9645]], ['reg', [174]], ['REG', [174]], ['ReverseElement', [8715]], ['ReverseEquilibrium', [8651]], ['ReverseUpEquilibrium', [10607]], ['rfisht', [10621]], ['rfloor', [8971]], ['rfr', [120111]], ['Rfr', [8476]], ['rHar', [10596]], ['rhard', [8641]], ['rharu', [8640]], ['rharul', [10604]], ['Rho', [929]], ['rho', [961]], ['rhov', [1009]], ['RightAngleBracket', [10217]], ['RightArrowBar', [8677]], ['rightarrow', [8594]], ['RightArrow', [8594]], ['Rightarrow', [8658]], ['RightArrowLeftArrow', [8644]], ['rightarrowtail', [8611]], ['RightCeiling', [8969]], ['RightDoubleBracket', [10215]], ['RightDownTeeVector', [10589]], ['RightDownVectorBar', [10581]], ['RightDownVector', [8642]], ['RightFloor', [8971]], ['rightharpoondown', [8641]], ['rightharpoonup', [8640]], ['rightleftarrows', [8644]], ['rightleftharpoons', [8652]], ['rightrightarrows', [8649]], ['rightsquigarrow', [8605]], ['RightTeeArrow', [8614]], ['RightTee', [8866]], ['RightTeeVector', [10587]], ['rightthreetimes', [8908]], ['RightTriangleBar', [10704]], ['RightTriangle', [8883]], ['RightTriangleEqual', [8885]], ['RightUpDownVector', [10575]], ['RightUpTeeVector', [10588]], ['RightUpVectorBar', [10580]], ['RightUpVector', [8638]], ['RightVectorBar', [10579]], ['RightVector', [8640]], ['ring', [730]], ['risingdotseq', [8787]], ['rlarr', [8644]], ['rlhar', [8652]], ['rlm', [8207]], ['rmoustache', [9137]], ['rmoust', [9137]], ['rnmid', [10990]], ['roang', [10221]], ['roarr', [8702]], ['robrk', [10215]], ['ropar', [10630]], ['ropf', [120163]], ['Ropf', [8477]], ['roplus', [10798]], ['rotimes', [10805]], ['RoundImplies', [10608]], ['rpar', [41]], ['rpargt', [10644]], ['rppolint', [10770]], ['rrarr', [8649]], ['Rrightarrow', [8667]], ['rsaquo', [8250]], ['rscr', [120007]], ['Rscr', [8475]], ['rsh', [8625]], ['Rsh', [8625]], ['rsqb', [93]], ['rsquo', [8217]], ['rsquor', [8217]], ['CloseCurlyQuote', [8217]], ['rthree', [8908]], ['rtimes', [8906]], ['rtri', [9657]], ['rtrie', [8885]], ['rtrif', [9656]], ['rtriltri', [10702]], ['RuleDelayed', [10740]], ['ruluhar', [10600]], ['rx', [8478]], ['Sacute', [346]], ['sacute', [347]], ['sbquo', [8218]], ['scap', [10936]], ['Scaron', [352]], ['scaron', [353]], ['Sc', [10940]], ['sc', [8827]], ['sccue', [8829]], ['sce', [10928]], ['scE', [10932]], ['Scedil', [350]], ['scedil', [351]], ['Scirc', [348]], ['scirc', [349]], ['scnap', [10938]], ['scnE', [10934]], ['scnsim', [8937]], ['scpolint', [10771]], ['scsim', [8831]], ['Scy', [1057]], ['scy', [1089]], ['sdotb', [8865]], ['sdot', [8901]], ['sdote', [10854]], ['searhk', [10533]], ['searr', [8600]], ['seArr', [8664]], ['searrow', [8600]], ['sect', [167]], ['semi', [59]], ['seswar', [10537]], ['setminus', [8726]], ['setmn', [8726]], ['sext', [10038]], ['Sfr', [120086]], ['sfr', [120112]], ['sfrown', [8994]], ['sharp', [9839]], ['SHCHcy', [1065]], ['shchcy', [1097]], ['SHcy', [1064]], ['shcy', [1096]], ['ShortDownArrow', [8595]], ['ShortLeftArrow', [8592]], ['shortmid', [8739]], ['shortparallel', [8741]], ['ShortRightArrow', [8594]], ['ShortUpArrow', [8593]], ['shy', [173]], ['Sigma', [931]], ['sigma', [963]], ['sigmaf', [962]], ['sigmav', [962]], ['sim', [8764]], ['simdot', [10858]], ['sime', [8771]], ['simeq', [8771]], ['simg', [10910]], ['simgE', [10912]], ['siml', [10909]], ['simlE', [10911]], ['simne', [8774]], ['simplus', [10788]], ['simrarr', [10610]], ['slarr', [8592]], ['SmallCircle', [8728]], ['smallsetminus', [8726]], ['smashp', [10803]], ['smeparsl', [10724]], ['smid', [8739]], ['smile', [8995]], ['smt', [10922]], ['smte', [10924]], ['smtes', [10924, 65024]], ['SOFTcy', [1068]], ['softcy', [1100]], ['solbar', [9023]], ['solb', [10692]], ['sol', [47]], ['Sopf', [120138]], ['sopf', [120164]], ['spades', [9824]], ['spadesuit', [9824]], ['spar', [8741]], ['sqcap', [8851]], ['sqcaps', [8851, 65024]], ['sqcup', [8852]], ['sqcups', [8852, 65024]], ['Sqrt', [8730]], ['sqsub', [8847]], ['sqsube', [8849]], ['sqsubset', [8847]], ['sqsubseteq', [8849]], ['sqsup', [8848]], ['sqsupe', [8850]], ['sqsupset', [8848]], ['sqsupseteq', [8850]], ['square', [9633]], ['Square', [9633]], ['SquareIntersection', [8851]], ['SquareSubset', [8847]], ['SquareSubsetEqual', [8849]], ['SquareSuperset', [8848]], ['SquareSupersetEqual', [8850]], ['SquareUnion', [8852]], ['squarf', [9642]], ['squ', [9633]], ['squf', [9642]], ['srarr', [8594]], ['Sscr', [119982]], ['sscr', [120008]], ['ssetmn', [8726]], ['ssmile', [8995]], ['sstarf', [8902]], ['Star', [8902]], ['star', [9734]], ['starf', [9733]], ['straightepsilon', [1013]], ['straightphi', [981]], ['strns', [175]], ['sub', [8834]], ['Sub', [8912]], ['subdot', [10941]], ['subE', [10949]], ['sube', [8838]], ['subedot', [10947]], ['submult', [10945]], ['subnE', [10955]], ['subne', [8842]], ['subplus', [10943]], ['subrarr', [10617]], ['subset', [8834]], ['Subset', [8912]], ['subseteq', [8838]], ['subseteqq', [10949]], ['SubsetEqual', [8838]], ['subsetneq', [8842]], ['subsetneqq', [10955]], ['subsim', [10951]], ['subsub', [10965]], ['subsup', [10963]], ['succapprox', [10936]], ['succ', [8827]], ['succcurlyeq', [8829]], ['Succeeds', [8827]], ['SucceedsEqual', [10928]], ['SucceedsSlantEqual', [8829]], ['SucceedsTilde', [8831]], ['succeq', [10928]], ['succnapprox', [10938]], ['succneqq', [10934]], ['succnsim', [8937]], ['succsim', [8831]], ['SuchThat', [8715]], ['sum', [8721]], ['Sum', [8721]], ['sung', [9834]], ['sup1', [185]], ['sup2', [178]], ['sup3', [179]], ['sup', [8835]], ['Sup', [8913]], ['supdot', [10942]], ['supdsub', [10968]], ['supE', [10950]], ['supe', [8839]], ['supedot', [10948]], ['Superset', [8835]], ['SupersetEqual', [8839]], ['suphsol', [10185]], ['suphsub', [10967]], ['suplarr', [10619]], ['supmult', [10946]], ['supnE', [10956]], ['supne', [8843]], ['supplus', [10944]], ['supset', [8835]], ['Supset', [8913]], ['supseteq', [8839]], ['supseteqq', [10950]], ['supsetneq', [8843]], ['supsetneqq', [10956]], ['supsim', [10952]], ['supsub', [10964]], ['supsup', [10966]], ['swarhk', [10534]], ['swarr', [8601]], ['swArr', [8665]], ['swarrow', [8601]], ['swnwar', [10538]], ['szlig', [223]], ['Tab', [9]], ['target', [8982]], ['Tau', [932]], ['tau', [964]], ['tbrk', [9140]], ['Tcaron', [356]], ['tcaron', [357]], ['Tcedil', [354]], ['tcedil', [355]], ['Tcy', [1058]], ['tcy', [1090]], ['tdot', [8411]], ['telrec', [8981]], ['Tfr', [120087]], ['tfr', [120113]], ['there4', [8756]], ['therefore', [8756]], ['Therefore', [8756]], ['Theta', [920]], ['theta', [952]], ['thetasym', [977]], ['thetav', [977]], ['thickapprox', [8776]], ['thicksim', [8764]], ['ThickSpace', [8287, 8202]], ['ThinSpace', [8201]], ['thinsp', [8201]], ['thkap', [8776]], ['thksim', [8764]], ['THORN', [222]], ['thorn', [254]], ['tilde', [732]], ['Tilde', [8764]], ['TildeEqual', [8771]], ['TildeFullEqual', [8773]], ['TildeTilde', [8776]], ['timesbar', [10801]], ['timesb', [8864]], ['times', [215]], ['timesd', [10800]], ['tint', [8749]], ['toea', [10536]], ['topbot', [9014]], ['topcir', [10993]], ['top', [8868]], ['Topf', [120139]], ['topf', [120165]], ['topfork', [10970]], ['tosa', [10537]], ['tprime', [8244]], ['trade', [8482]], ['TRADE', [8482]], ['triangle', [9653]], ['triangledown', [9663]], ['triangleleft', [9667]], ['trianglelefteq', [8884]], ['triangleq', [8796]], ['triangleright', [9657]], ['trianglerighteq', [8885]], ['tridot', [9708]], ['trie', [8796]], ['triminus', [10810]], ['TripleDot', [8411]], ['triplus', [10809]], ['trisb', [10701]], ['tritime', [10811]], ['trpezium', [9186]], ['Tscr', [119983]], ['tscr', [120009]], ['TScy', [1062]], ['tscy', [1094]], ['TSHcy', [1035]], ['tshcy', [1115]], ['Tstrok', [358]], ['tstrok', [359]], ['twixt', [8812]], ['twoheadleftarrow', [8606]], ['twoheadrightarrow', [8608]], ['Uacute', [218]], ['uacute', [250]], ['uarr', [8593]], ['Uarr', [8607]], ['uArr', [8657]], ['Uarrocir', [10569]], ['Ubrcy', [1038]], ['ubrcy', [1118]], ['Ubreve', [364]], ['ubreve', [365]], ['Ucirc', [219]], ['ucirc', [251]], ['Ucy', [1059]], ['ucy', [1091]], ['udarr', [8645]], ['Udblac', [368]], ['udblac', [369]], ['udhar', [10606]], ['ufisht', [10622]], ['Ufr', [120088]], ['ufr', [120114]], ['Ugrave', [217]], ['ugrave', [249]], ['uHar', [10595]], ['uharl', [8639]], ['uharr', [8638]], ['uhblk', [9600]], ['ulcorn', [8988]], ['ulcorner', [8988]], ['ulcrop', [8975]], ['ultri', [9720]], ['Umacr', [362]], ['umacr', [363]], ['uml', [168]], ['UnderBar', [95]], ['UnderBrace', [9183]], ['UnderBracket', [9141]], ['UnderParenthesis', [9181]], ['Union', [8899]], ['UnionPlus', [8846]], ['Uogon', [370]], ['uogon', [371]], ['Uopf', [120140]], ['uopf', [120166]], ['UpArrowBar', [10514]], ['uparrow', [8593]], ['UpArrow', [8593]], ['Uparrow', [8657]], ['UpArrowDownArrow', [8645]], ['updownarrow', [8597]], ['UpDownArrow', [8597]], ['Updownarrow', [8661]], ['UpEquilibrium', [10606]], ['upharpoonleft', [8639]], ['upharpoonright', [8638]], ['uplus', [8846]], ['UpperLeftArrow', [8598]], ['UpperRightArrow', [8599]], ['upsi', [965]], ['Upsi', [978]], ['upsih', [978]], ['Upsilon', [933]], ['upsilon', [965]], ['UpTeeArrow', [8613]], ['UpTee', [8869]], ['upuparrows', [8648]], ['urcorn', [8989]], ['urcorner', [8989]], ['urcrop', [8974]], ['Uring', [366]], ['uring', [367]], ['urtri', [9721]], ['Uscr', [119984]], ['uscr', [120010]], ['utdot', [8944]], ['Utilde', [360]], ['utilde', [361]], ['utri', [9653]], ['utrif', [9652]], ['uuarr', [8648]], ['Uuml', [220]], ['uuml', [252]], ['uwangle', [10663]], ['vangrt', [10652]], ['varepsilon', [1013]], ['varkappa', [1008]], ['varnothing', [8709]], ['varphi', [981]], ['varpi', [982]], ['varpropto', [8733]], ['varr', [8597]], ['vArr', [8661]], ['varrho', [1009]], ['varsigma', [962]], ['varsubsetneq', [8842, 65024]], ['varsubsetneqq', [10955, 65024]], ['varsupsetneq', [8843, 65024]], ['varsupsetneqq', [10956, 65024]], ['vartheta', [977]], ['vartriangleleft', [8882]], ['vartriangleright', [8883]], ['vBar', [10984]], ['Vbar', [10987]], ['vBarv', [10985]], ['Vcy', [1042]], ['vcy', [1074]], ['vdash', [8866]], ['vDash', [8872]], ['Vdash', [8873]], ['VDash', [8875]], ['Vdashl', [10982]], ['veebar', [8891]], ['vee', [8744]], ['Vee', [8897]], ['veeeq', [8794]], ['vellip', [8942]], ['verbar', [124]], ['Verbar', [8214]], ['vert', [124]], ['Vert', [8214]], ['VerticalBar', [8739]], ['VerticalLine', [124]], ['VerticalSeparator', [10072]], ['VerticalTilde', [8768]], ['VeryThinSpace', [8202]], ['Vfr', [120089]], ['vfr', [120115]], ['vltri', [8882]], ['vnsub', [8834, 8402]], ['vnsup', [8835, 8402]], ['Vopf', [120141]], ['vopf', [120167]], ['vprop', [8733]], ['vrtri', [8883]], ['Vscr', [119985]], ['vscr', [120011]], ['vsubnE', [10955, 65024]], ['vsubne', [8842, 65024]], ['vsupnE', [10956, 65024]], ['vsupne', [8843, 65024]], ['Vvdash', [8874]], ['vzigzag', [10650]], ['Wcirc', [372]], ['wcirc', [373]], ['wedbar', [10847]], ['wedge', [8743]], ['Wedge', [8896]], ['wedgeq', [8793]], ['weierp', [8472]], ['Wfr', [120090]], ['wfr', [120116]], ['Wopf', [120142]], ['wopf', [120168]], ['wp', [8472]], ['wr', [8768]], ['wreath', [8768]], ['Wscr', [119986]], ['wscr', [120012]], ['xcap', [8898]], ['xcirc', [9711]], ['xcup', [8899]], ['xdtri', [9661]], ['Xfr', [120091]], ['xfr', [120117]], ['xharr', [10231]], ['xhArr', [10234]], ['Xi', [926]], ['xi', [958]], ['xlarr', [10229]], ['xlArr', [10232]], ['xmap', [10236]], ['xnis', [8955]], ['xodot', [10752]], ['Xopf', [120143]], ['xopf', [120169]], ['xoplus', [10753]], ['xotime', [10754]], ['xrarr', [10230]], ['xrArr', [10233]], ['Xscr', [119987]], ['xscr', [120013]], ['xsqcup', [10758]], ['xuplus', [10756]], ['xutri', [9651]], ['xvee', [8897]], ['xwedge', [8896]], ['Yacute', [221]], ['yacute', [253]], ['YAcy', [1071]], ['yacy', [1103]], ['Ycirc', [374]], ['ycirc', [375]], ['Ycy', [1067]], ['ycy', [1099]], ['yen', [165]], ['Yfr', [120092]], ['yfr', [120118]], ['YIcy', [1031]], ['yicy', [1111]], ['Yopf', [120144]], ['yopf', [120170]], ['Yscr', [119988]], ['yscr', [120014]], ['YUcy', [1070]], ['yucy', [1102]], ['yuml', [255]], ['Yuml', [376]], ['Zacute', [377]], ['zacute', [378]], ['Zcaron', [381]], ['zcaron', [382]], ['Zcy', [1047]], ['zcy', [1079]], ['Zdot', [379]], ['zdot', [380]], ['zeetrf', [8488]], ['ZeroWidthSpace', [8203]], ['Zeta', [918]], ['zeta', [950]], ['zfr', [120119]], ['Zfr', [8488]], ['ZHcy', [1046]], ['zhcy', [1078]], ['zigrarr', [8669]], ['zopf', [120171]], ['Zopf', [8484]], ['Zscr', [119989]], ['zscr', [120015]], ['zwj', [8205]], ['zwnj', [8204]]];

var alphaIndex = {};
var charIndex = {};

createIndexes(alphaIndex, charIndex);

/**
 * @constructor
 */
function Html5Entities() {}

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.decode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    return str.replace(/&(#?[\w\d]+);?/g, function(s, entity) {
        var chr;
        if (entity.charAt(0) === "#") {
            var code = entity.charAt(1) === 'x' ?
                parseInt(entity.substr(2).toLowerCase(), 16) :
                parseInt(entity.substr(1));

            if (!(isNaN(code) || code < -32768 || code > 65535)) {
                chr = String.fromCharCode(code);
            }
        } else {
            chr = alphaIndex[entity];
        }
        return chr || s;
    });
};

/**
 * @param {String} str
 * @returns {String}
 */
 Html5Entities.decode = function(str) {
    return new Html5Entities().decode(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.encode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var charInfo = charIndex[str.charCodeAt(i)];
        if (charInfo) {
            var alpha = charInfo[str.charCodeAt(i + 1)];
            if (alpha) {
                i++;
            } else {
                alpha = charInfo[''];
            }
            if (alpha) {
                result += "&" + alpha + ";";
                i++;
                continue;
            }
        }
        result += str.charAt(i);
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 Html5Entities.encode = function(str) {
    return new Html5Entities().encode(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.encodeNonUTF = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var c = str.charCodeAt(i);
        var charInfo = charIndex[c];
        if (charInfo) {
            var alpha = charInfo[str.charCodeAt(i + 1)];
            if (alpha) {
                i++;
            } else {
                alpha = charInfo[''];
            }
            if (alpha) {
                result += "&" + alpha + ";";
                i++;
                continue;
            }
        }
        if (c < 32 || c > 126) {
            result += '&#' + c + ';';
        } else {
            result += str.charAt(i);
        }
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 Html5Entities.encodeNonUTF = function(str) {
    return new Html5Entities().encodeNonUTF(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.encodeNonASCII = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var c = str.charCodeAt(i);
        if (c <= 255) {
            result += str[i++];
            continue;
        }
        result += '&#' + c + ';';
        i++
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 Html5Entities.encodeNonASCII = function(str) {
    return new Html5Entities().encodeNonASCII(str);
 };

/**
 * @param {Object} alphaIndex Passed by reference.
 * @param {Object} charIndex Passed by reference.
 */
function createIndexes(alphaIndex, charIndex) {
    var i = ENTITIES.length;
    var _results = [];
    while (i--) {
        var e = ENTITIES[i];
        var alpha = e[0];
        var chars = e[1];
        var chr = chars[0];
        var addChar = (chr < 32 || chr > 126) || chr === 62 || chr === 60 || chr === 38 || chr === 34 || chr === 39;
        var charInfo;
        if (addChar) {
            charInfo = charIndex[chr] = charIndex[chr] || {};
        }
        if (chars[1]) {
            var chr2 = chars[1];
            alphaIndex[alpha] = String.fromCharCode(chr) + String.fromCharCode(chr2);
            _results.push(addChar && (charInfo[chr2] = alpha));
        } else {
            alphaIndex[alpha] = String.fromCharCode(chr);
            _results.push(addChar && (charInfo[''] = alpha));
        }
    }
}

module.exports = Html5Entities;


/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_reflect_metadata__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_reflect_metadata___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_reflect_metadata__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_zone_js__ = __webpack_require__(56);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_zone_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_zone_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_bootstrap__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_bootstrap___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_bootstrap__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_platform_browser_dynamic__ = __webpack_require__(54);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__app_app_browser_module__ = __webpack_require__(14);






if (true) {
    module.hot.accept();
    module.hot.dispose(function () {
        // Before restarting the app, we create a new root element and dispose the old one
        var oldRootElem = document.querySelector('app');
        var newRootElem = document.createElement('app');
        oldRootElem.parentNode.insertBefore(newRootElem, oldRootElem);
        modulePromise.then(function (appModule) { return appModule.destroy(); });
    });
}
else {
    enableProdMode();
}
// Note: @ng-tools/webpack looks for the following expression when performing production
// builds. Don't change how this line looks, otherwise you may break tree-shaking.
var modulePromise = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__angular_platform_browser_dynamic__["platformBrowserDynamic"])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_5__app_app_browser_module__["a" /* AppModule */]);


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(__resourceQuery, module) {/*eslint-env browser*/
/*global __resourceQuery __webpack_public_path__*/

var options = {
  path: "/__webpack_hmr",
  timeout: 20 * 1000,
  overlay: true,
  reload: false,
  log: true,
  warn: true,
  name: ''
};
if (true) {
  var querystring = __webpack_require__(38);
  var overrides = querystring.parse(__resourceQuery.slice(1));
  if (overrides.path) options.path = overrides.path;
  if (overrides.timeout) options.timeout = overrides.timeout;
  if (overrides.overlay) options.overlay = overrides.overlay !== 'false';
  if (overrides.reload) options.reload = overrides.reload !== 'false';
  if (overrides.noInfo && overrides.noInfo !== 'false') {
    options.log = false;
  }
  if (overrides.name) {
    options.name = overrides.name;
  }
  if (overrides.quiet && overrides.quiet !== 'false') {
    options.log = false;
    options.warn = false;
  }
  if (overrides.dynamicPublicPath) {
    options.path = __webpack_require__.p + options.path;
  }
}

if (typeof window === 'undefined') {
  // do nothing
} else if (typeof window.EventSource === 'undefined') {
  console.warn(
    "webpack-hot-middleware's client requires EventSource to work. " +
    "You should include a polyfill if you want to support this browser: " +
    "https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events#Tools"
  );
} else {
  connect();
}

function EventSourceWrapper() {
  var source;
  var lastActivity = new Date();
  var listeners = [];

  init();
  var timer = setInterval(function() {
    if ((new Date() - lastActivity) > options.timeout) {
      handleDisconnect();
    }
  }, options.timeout / 2);

  function init() {
    source = new window.EventSource(options.path);
    source.onopen = handleOnline;
    source.onerror = handleDisconnect;
    source.onmessage = handleMessage;
  }

  function handleOnline() {
    if (options.log) console.log("[HMR] connected");
    lastActivity = new Date();
  }

  function handleMessage(event) {
    lastActivity = new Date();
    for (var i = 0; i < listeners.length; i++) {
      listeners[i](event);
    }
  }

  function handleDisconnect() {
    clearInterval(timer);
    source.close();
    setTimeout(init, options.timeout);
  }

  return {
    addMessageListener: function(fn) {
      listeners.push(fn);
    }
  };
}

function getEventSourceWrapper() {
  if (!window.__whmEventSourceWrapper) {
    window.__whmEventSourceWrapper = {};
  }
  if (!window.__whmEventSourceWrapper[options.path]) {
    // cache the wrapper for other entries loaded on
    // the same page with the same options.path
    window.__whmEventSourceWrapper[options.path] = EventSourceWrapper();
  }
  return window.__whmEventSourceWrapper[options.path];
}

function connect() {
  getEventSourceWrapper().addMessageListener(handleMessage);

  function handleMessage(event) {
    if (event.data == "\uD83D\uDC93") {
      return;
    }
    try {
      processMessage(JSON.parse(event.data));
    } catch (ex) {
      if (options.warn) {
        console.warn("Invalid HMR message: " + event.data + "\n" + ex);
      }
    }
  }
}

// the reporter needs to be a singleton on the page
// in case the client is being used by multiple bundles
// we only want to report once.
// all the errors will go to all clients
var singletonKey = '__webpack_hot_middleware_reporter__';
var reporter;
if (typeof window !== 'undefined') {
  if (!window[singletonKey]) {
    window[singletonKey] = createReporter();
  }
  reporter = window[singletonKey];
}

function createReporter() {
  var strip = __webpack_require__(45);

  var overlay;
  if (typeof document !== 'undefined' && options.overlay) {
    overlay = __webpack_require__(48);
  }

  var styles = {
    errors: "color: #ff0000;",
    warnings: "color: #999933;"
  };
  var previousProblems = null;
  function log(type, obj) {
    var newProblems = obj[type].map(function(msg) { return strip(msg); }).join('\n');
    if (previousProblems == newProblems) {
      return;
    } else {
      previousProblems = newProblems;
    }

    var style = styles[type];
    var name = obj.name ? "'" + obj.name + "' " : "";
    var title = "[HMR] bundle " + name + "has " + obj[type].length + " " + type;
    // NOTE: console.warn or console.error will print the stack trace
    // which isn't helpful here, so using console.log to escape it.
    if (console.group && console.groupEnd) {
      console.group("%c" + title, style);
      console.log("%c" + newProblems, style);
      console.groupEnd();
    } else {
      console.log(
        "%c" + title + "\n\t%c" + newProblems.replace(/\n/g, "\n\t"),
        style + "font-weight: bold;",
        style + "font-weight: normal;"
      );
    }
  }

  return {
    cleanProblemsCache: function () {
      previousProblems = null;
    },
    problems: function(type, obj) {
      if (options.warn) {
        log(type, obj);
      }
      if (overlay && type !== 'warnings') overlay.showProblems(type, obj[type]);
    },
    success: function() {
      if (overlay) overlay.clear();
    },
    useCustomOverlay: function(customOverlay) {
      overlay = customOverlay;
    }
  };
}

var processUpdate = __webpack_require__(49);

var customHandler;
var subscribeAllHandler;
function processMessage(obj) {
  switch(obj.action) {
    case "building":
      if (options.log) {
        console.log(
          "[HMR] bundle " + (obj.name ? "'" + obj.name + "' " : "") +
          "rebuilding"
        );
      }
      break;
    case "built":
      if (options.log) {
        console.log(
          "[HMR] bundle " + (obj.name ? "'" + obj.name + "' " : "") +
          "rebuilt in " + obj.time + "ms"
        );
      }
      // fall through
    case "sync":
      if (obj.name && options.name && obj.name !== options.name) {
        return;
      }
      if (obj.errors.length > 0) {
        if (reporter) reporter.problems('errors', obj);
      } else {
        if (reporter) {
          if (obj.warnings.length > 0) {
            reporter.problems('warnings', obj);
          } else {
            reporter.cleanProblemsCache();
          }
          reporter.success();
        }
        processUpdate(obj.hash, obj.modules, options);
      }
      break;
    default:
      if (customHandler) {
        customHandler(obj);
      }
  }

  if (subscribeAllHandler) {
    subscribeAllHandler(obj);
  }
}

if (module) {
  module.exports = {
    subscribeAll: function subscribeAll(handler) {
      subscribeAllHandler = handler;
    },
    subscribe: function subscribe(handler) {
      customHandler = handler;
    },
    useCustomOverlay: function useCustomOverlay(customOverlay) {
      if (reporter) reporter.useCustomOverlay(customOverlay);
    }
  };
}

/* WEBPACK VAR INJECTION */}.call(exports, "?path=__webpack_hmr&dynamicPublicPath=true", __webpack_require__(50)(module)))

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(45);

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = ansiHTML

// Reference to https://github.com/sindresorhus/ansi-regex
var _regANSI = /(?:(?:\u001b\[)|\u009b)(?:(?:[0-9]{1,3})?(?:(?:;[0-9]{0,3})*)?[A-M|f-m])|\u001b[A-M]/

var _defColors = {
  reset: ['fff', '000'], // [FOREGROUD_COLOR, BACKGROUND_COLOR]
  black: '000',
  red: 'ff0000',
  green: '209805',
  yellow: 'e8bf03',
  blue: '0000ff',
  magenta: 'ff00ff',
  cyan: '00ffee',
  lightgrey: 'f0f0f0',
  darkgrey: '888'
}
var _styles = {
  30: 'black',
  31: 'red',
  32: 'green',
  33: 'yellow',
  34: 'blue',
  35: 'magenta',
  36: 'cyan',
  37: 'lightgrey'
}
var _openTags = {
  '1': 'font-weight:bold', // bold
  '2': 'opacity:0.5', // dim
  '3': '<i>', // italic
  '4': '<u>', // underscore
  '8': 'display:none', // hidden
  '9': '<del>' // delete
}
var _closeTags = {
  '23': '</i>', // reset italic
  '24': '</u>', // reset underscore
  '29': '</del>' // reset delete
}

;[0, 21, 22, 27, 28, 39, 49].forEach(function (n) {
  _closeTags[n] = '</span>'
})

/**
 * Converts text with ANSI color codes to HTML markup.
 * @param {String} text
 * @returns {*}
 */
function ansiHTML (text) {
  // Returns the text if the string has no ANSI escape code.
  if (!_regANSI.test(text)) {
    return text
  }

  // Cache opened sequence.
  var ansiCodes = []
  // Replace with markup.
  var ret = text.replace(/\033\[(\d+)*m/g, function (match, seq) {
    var ot = _openTags[seq]
    if (ot) {
      // If current sequence has been opened, close it.
      if (!!~ansiCodes.indexOf(seq)) { // eslint-disable-line no-extra-boolean-cast
        ansiCodes.pop()
        return '</span>'
      }
      // Open tag.
      ansiCodes.push(seq)
      return ot[0] === '<' ? ot : '<span style="' + ot + ';">'
    }

    var ct = _closeTags[seq]
    if (ct) {
      // Pop sequence
      ansiCodes.pop()
      return ct
    }
    return ''
  })

  // Make sure tags are closed.
  var l = ansiCodes.length
  ;(l > 0) && (ret += Array(l + 1).join('</span>'))

  return ret
}

/**
 * Customize colors.
 * @param {Object} colors reference to _defColors
 */
ansiHTML.setColors = function (colors) {
  if (typeof colors !== 'object') {
    throw new Error('`colors` parameter must be an Object.')
  }

  var _finalColors = {}
  for (var key in _defColors) {
    var hex = colors.hasOwnProperty(key) ? colors[key] : null
    if (!hex) {
      _finalColors[key] = _defColors[key]
      continue
    }
    if ('reset' === key) {
      if (typeof hex === 'string') {
        hex = [hex]
      }
      if (!Array.isArray(hex) || hex.length === 0 || hex.some(function (h) {
        return typeof h !== 'string'
      })) {
        throw new Error('The value of `' + key + '` property must be an Array and each item could only be a hex string, e.g.: FF0000')
      }
      var defHexColor = _defColors[key]
      if (!hex[0]) {
        hex[0] = defHexColor[0]
      }
      if (hex.length === 1 || !hex[1]) {
        hex = [hex[0]]
        hex.push(defHexColor[1])
      }

      hex = hex.slice(0, 2)
    } else if (typeof hex !== 'string') {
      throw new Error('The value of `' + key + '` property must be a hex string, e.g.: FF0000')
    }
    _finalColors[key] = hex
  }
  _setTags(_finalColors)
}

/**
 * Reset colors.
 */
ansiHTML.reset = function () {
  _setTags(_defColors)
}

/**
 * Expose tags, including open and close.
 * @type {Object}
 */
ansiHTML.tags = {}

if (Object.defineProperty) {
  Object.defineProperty(ansiHTML.tags, 'open', {
    get: function () { return _openTags }
  })
  Object.defineProperty(ansiHTML.tags, 'close', {
    get: function () { return _closeTags }
  })
} else {
  ansiHTML.tags.open = _openTags
  ansiHTML.tags.close = _closeTags
}

function _setTags (colors) {
  // reset all
  _openTags['0'] = 'font-weight:normal;opacity:1;color:#' + colors.reset[0] + ';background:#' + colors.reset[1]
  // inverse
  _openTags['7'] = 'color:#' + colors.reset[1] + ';background:#' + colors.reset[0]
  // dark grey
  _openTags['90'] = 'color:#' + colors.darkgrey

  for (var code in _styles) {
    var color = _styles[code]
    var oriColor = colors[color] || '000'
    _openTags[code] = 'color:#' + oriColor
    code = parseInt(code)
    _openTags[(code + 10).toString()] = 'background:#' + oriColor
  }
}

ansiHTML.reset()


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function () {
	return /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-PRZcf-nqry=><]/g;
};


/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* unused harmony export getBaseUrl */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__ = __webpack_require__(57);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_shared_module__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_app_app_component__ = __webpack_require__(6);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};




var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
            bootstrap: [__WEBPACK_IMPORTED_MODULE_3__components_app_app_component__["a" /* AppComponent */]],
            imports: [
                __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__["BrowserModule"],
                __WEBPACK_IMPORTED_MODULE_2__app_shared_module__["a" /* AppModuleShared */]
            ],
            providers: [
                { provide: 'BASE_URL', useFactory: getBaseUrl }
            ]
        })
    ], AppModule);
    return AppModule;
}());

function getBaseUrl() {
    return document.getElementsByTagName('base')[0].href;
}


/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModuleShared; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common__ = __webpack_require__(60);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(53);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_http__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_router__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__components_app_app_component__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__components_navmenu_navmenu_component__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__components_home_home_component__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__components_fetchdata_fetchdata_component__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__components_counter_counter_component__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__components_common_guards_auth_guard__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__components_common_services_auth_service__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__components_authcallback_authcallback_component__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__components_testnew_testnew_component__ = __webpack_require__(22);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};














var AppModuleShared = (function () {
    function AppModuleShared() {
    }
    AppModuleShared = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_5__components_app_app_component__["a" /* AppComponent */],
                __WEBPACK_IMPORTED_MODULE_6__components_navmenu_navmenu_component__["a" /* NavMenuComponent */],
                __WEBPACK_IMPORTED_MODULE_9__components_counter_counter_component__["a" /* CounterComponent */],
                __WEBPACK_IMPORTED_MODULE_8__components_fetchdata_fetchdata_component__["a" /* FetchDataComponent */],
                __WEBPACK_IMPORTED_MODULE_7__components_home_home_component__["a" /* HomeComponent */],
                __WEBPACK_IMPORTED_MODULE_12__components_authcallback_authcallback_component__["a" /* AuthCallbackComponent */],
                __WEBPACK_IMPORTED_MODULE_13__components_testnew_testnew_component__["a" /* TestNewComponent */]
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_1__angular_common__["CommonModule"],
                __WEBPACK_IMPORTED_MODULE_3__angular_http__["HttpModule"],
                __WEBPACK_IMPORTED_MODULE_2__angular_forms__["FormsModule"],
                __WEBPACK_IMPORTED_MODULE_4__angular_router__["RouterModule"].forRoot([
                    { path: '', redirectTo: 'fetch-data', pathMatch: 'full' },
                    { path: 'home', component: __WEBPACK_IMPORTED_MODULE_7__components_home_home_component__["a" /* HomeComponent */] },
                    { path: 'counter', component: __WEBPACK_IMPORTED_MODULE_9__components_counter_counter_component__["a" /* CounterComponent */], canActivate: [__WEBPACK_IMPORTED_MODULE_10__components_common_guards_auth_guard__["a" /* AuthGuardService */]] },
                    { path: 'fetch-data', component: __WEBPACK_IMPORTED_MODULE_8__components_fetchdata_fetchdata_component__["a" /* FetchDataComponent */] },
                    { path: 'authcallback', component: __WEBPACK_IMPORTED_MODULE_12__components_authcallback_authcallback_component__["a" /* AuthCallbackComponent */] },
                    { path: 'testnew', component: __WEBPACK_IMPORTED_MODULE_13__components_testnew_testnew_component__["a" /* TestNewComponent */] },
                    { path: '**', redirectTo: 'home' }
                ])
            ],
            providers: [__WEBPACK_IMPORTED_MODULE_10__components_common_guards_auth_guard__["a" /* AuthGuardService */], __WEBPACK_IMPORTED_MODULE_11__components_common_services_auth_service__["a" /* AuthService */]]
        })
    ], AppModuleShared);
    return AppModuleShared;
}());



/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AuthCallbackComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_services_auth_service__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_router__ = __webpack_require__(4);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var AuthCallbackComponent = (function () {
    function AuthCallbackComponent(_router, _authService, _zone, private_activatedRoute) {
        this._router = _router;
        this._authService = _authService;
        this._zone = _zone;
        debugger;
        console.log('authcallback constructour called');
        debugger;
        //alert('aaaaaaaaaaaa');
    }
    AuthCallbackComponent.prototype.ngOnInit = function () {
        var _this = this;
        debugger;
        this._authService.completeAuthentication().then(function (u) {
            console.log('completeAuthentication ngOnInit');
            console.log(_this.user);
            _this.user = u;
            debugger;
            if (_this.user) {
                debugger;
                _this._router.navigate(["/"]);
            }
        });
    };
    AuthCallbackComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            template: __webpack_require__(29)
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__angular_router__["Router"], __WEBPACK_IMPORTED_MODULE_1__common_services_auth_service__["a" /* AuthService */], __WEBPACK_IMPORTED_MODULE_0__angular_core__["NgZone"], __WEBPACK_IMPORTED_MODULE_2__angular_router__["ActivatedRoute"]])
    ], AuthCallbackComponent);
    return AuthCallbackComponent;
}());



/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AuthGuardService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__services_auth_service__ = __webpack_require__(2);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var AuthGuardService = (function () {
    function AuthGuardService(authService, router) {
        this.authService = authService;
        this.router = router;
    }
    AuthGuardService.prototype.canActivate = function () {
        if (this.authService.isLoggedIn()) {
            return true;
        }
        else {
            this.authService.startAuthentication();
            return false;
        }
    };
    AuthGuardService = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__services_auth_service__["a" /* AuthService */], __WEBPACK_IMPORTED_MODULE_1__angular_router__["Router"]])
    ], AuthGuardService);
    return AuthGuardService;
}());



/***/ }),
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CounterComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__common_services_auth_service__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_http__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_map__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rxjs_add_operator_catch__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rxjs_add_operator_catch___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_rxjs_add_operator_catch__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_rxjs_add_observable_throw__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_rxjs_add_observable_throw___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_rxjs_add_observable_throw__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var CounterComponent = (function () {
    function CounterComponent(_router, _authService, http) {
        this._router = _router;
        this._authService = _authService;
        this.http = http;
        this.currentCount = 0;
        debugger;
        this.user = this._authService.currentUser;
        console.log('HomeComponent constructor as It is landing Page');
        debugger;
    }
    CounterComponent.prototype.incrementCounter = function () {
        this.currentCount++;
    };
    CounterComponent.prototype.callapi = function () {
        var _this = this;
        debugger;
        var headers = new __WEBPACK_IMPORTED_MODULE_4__angular_http__["Headers"]();
        headers.append('Content-Type', 'application/json');
        var accessToken = this.user.access_token;
        headers.append('Authorization', "Bearer " + accessToken);
        return this.http.get('https://localhost:44366/api/values')
            .map(function (response) { return response.json(); })
            .catch(this.handleError)
            .subscribe(function (m) {
            console.log(m);
            _this.temp = m;
        }, function (error) {
            debugger;
            _this.displayErrorMessage = error;
        });
    };
    CounterComponent.prototype.handleError = function (error) {
        debugger;
        return __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__["Observable"].throw(error);
    };
    CounterComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'counter',
            template: __webpack_require__(30)
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_router__["Router"], __WEBPACK_IMPORTED_MODULE_2__common_services_auth_service__["a" /* AuthService */], __WEBPACK_IMPORTED_MODULE_4__angular_http__["Http"]])
    ], CounterComponent);
    return CounterComponent;
}());



/***/ }),
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FetchDataComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(5);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};


var FetchDataComponent = (function () {
    function FetchDataComponent(http, baseUrl) {
        var _this = this;
        http.get(baseUrl + 'api/SampleData/WeatherForecasts').subscribe(function (result) {
            _this.forecasts = result.json();
        }, function (error) { return console.error(error); });
    }
    FetchDataComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'fetchdata',
            template: __webpack_require__(31)
        }),
        __param(1, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Inject"])('BASE_URL')),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_http__["Http"], String])
    ], FetchDataComponent);
    return FetchDataComponent;
}());



/***/ }),
/* 20 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HomeComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_services_auth_service__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_router__ = __webpack_require__(4);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var HomeComponent = (function () {
    function HomeComponent(_router, _authService) {
        this._router = _router;
        this._authService = _authService;
        console.log('HomeComponent constructor as It is landing Page');
        debugger;
    }
    HomeComponent.prototype.ngOnInit = function () {
        var _this = this;
        debugger;
        this._authService.completeAuthentication().then(function (u) {
            console.log('completeAuthentication ngOnInit');
            console.log(_this.user);
            _this.user = u;
            debugger;
            if (_this.user) {
                debugger;
                _this._router.navigate(["/counter"]);
            }
        });
    };
    HomeComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'home',
            template: __webpack_require__(32)
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__angular_router__["Router"], __WEBPACK_IMPORTED_MODULE_1__common_services_auth_service__["a" /* AuthService */]])
    ], HomeComponent);
    return HomeComponent;
}());



/***/ }),
/* 21 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return NavMenuComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var NavMenuComponent = (function () {
    function NavMenuComponent() {
    }
    NavMenuComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'nav-menu',
            template: __webpack_require__(33),
            styles: [__webpack_require__(47)]
        })
    ], NavMenuComponent);
    return NavMenuComponent;
}());



/***/ }),
/* 22 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TestNewComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var TestNewComponent = (function () {
    //user: User;
    function TestNewComponent() {
        console.log('TestNewComponent constructor');
        debugger;
    }
    TestNewComponent.prototype.ngOnInit = function () {
        debugger;
        //this._authService.completeAuthentication().then(
        //    (u)=>
        //    {
        //        console.log('completeAuthentication ngOnInit');
        //        //console.log(this.user);
        //        //this.user = u;
        //        debugger;
        //        //if(this.user)
        //        //{
        //        //    debugger;
        //        //    this._router.navigate(["/"]);
        //        //}
        //    }
        //);
    };
    TestNewComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'testnew',
            template: __webpack_require__(34)
        }),
        __metadata("design:paramtypes", [])
    ], TestNewComponent);
    return TestNewComponent;
}());



/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(7)(undefined);
// imports


// module
exports.push([module.i, "@media (max-width: 767px) {\r\n    /* On small screens, the nav menu spans the full width of the screen. Leave a space for it. */\r\n    .body-content {\r\n        padding-top: 50px;\r\n    }\r\n}\r\n", ""]);

// exports


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(7)(undefined);
// imports


// module
exports.push([module.i, "li .glyphicon {\r\n    margin-right: 10px;\r\n}\r\n\r\n/* Highlighting rules for nav menu items */\r\nli.link-active a,\r\nli.link-active a:hover,\r\nli.link-active a:focus {\r\n    background-color: #4189C7;\r\n    color: white;\r\n}\r\n\r\n/* Keep the nav menu independent of scrolling and on top of other items */\r\n.main-nav {\r\n    position: fixed;\r\n    top: 0;\r\n    left: 0;\r\n    right: 0;\r\n    z-index: 1;\r\n}\r\n\r\n@media (min-width: 768px) {\r\n    /* On small screens, convert the nav menu to a vertical sidebar */\r\n    .main-nav {\r\n        height: 100%;\r\n        width: calc(25% - 20px);\r\n    }\r\n    .navbar {\r\n        border-radius: 0px;\r\n        border-width: 0px;\r\n        height: 100%;\r\n    }\r\n    .navbar-header {\r\n        float: none;\r\n    }\r\n    .navbar-collapse {\r\n        border-top: 1px solid #444;\r\n        padding: 0px;\r\n    }\r\n    .navbar ul {\r\n        float: none;\r\n    }\r\n    .navbar li {\r\n        float: none;\r\n        font-size: 15px;\r\n        margin: 6px;\r\n    }\r\n    .navbar li a {\r\n        padding: 10px 16px;\r\n        border-radius: 4px;\r\n    }\r\n    .navbar a {\r\n        /* If a menu item's text is too long, truncate it */\r\n        width: 100%;\r\n        white-space: nowrap;\r\n        overflow: hidden;\r\n        text-overflow: ellipsis;\r\n    }\r\n}\r\n", ""]);

// exports


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  XmlEntities: __webpack_require__(27),
  Html4Entities: __webpack_require__(26),
  Html5Entities: __webpack_require__(8),
  AllHtmlEntities: __webpack_require__(8)
};


/***/ }),
/* 26 */
/***/ (function(module, exports) {

var HTML_ALPHA = ['apos', 'nbsp', 'iexcl', 'cent', 'pound', 'curren', 'yen', 'brvbar', 'sect', 'uml', 'copy', 'ordf', 'laquo', 'not', 'shy', 'reg', 'macr', 'deg', 'plusmn', 'sup2', 'sup3', 'acute', 'micro', 'para', 'middot', 'cedil', 'sup1', 'ordm', 'raquo', 'frac14', 'frac12', 'frac34', 'iquest', 'Agrave', 'Aacute', 'Acirc', 'Atilde', 'Auml', 'Aring', 'Aelig', 'Ccedil', 'Egrave', 'Eacute', 'Ecirc', 'Euml', 'Igrave', 'Iacute', 'Icirc', 'Iuml', 'ETH', 'Ntilde', 'Ograve', 'Oacute', 'Ocirc', 'Otilde', 'Ouml', 'times', 'Oslash', 'Ugrave', 'Uacute', 'Ucirc', 'Uuml', 'Yacute', 'THORN', 'szlig', 'agrave', 'aacute', 'acirc', 'atilde', 'auml', 'aring', 'aelig', 'ccedil', 'egrave', 'eacute', 'ecirc', 'euml', 'igrave', 'iacute', 'icirc', 'iuml', 'eth', 'ntilde', 'ograve', 'oacute', 'ocirc', 'otilde', 'ouml', 'divide', 'oslash', 'ugrave', 'uacute', 'ucirc', 'uuml', 'yacute', 'thorn', 'yuml', 'quot', 'amp', 'lt', 'gt', 'OElig', 'oelig', 'Scaron', 'scaron', 'Yuml', 'circ', 'tilde', 'ensp', 'emsp', 'thinsp', 'zwnj', 'zwj', 'lrm', 'rlm', 'ndash', 'mdash', 'lsquo', 'rsquo', 'sbquo', 'ldquo', 'rdquo', 'bdquo', 'dagger', 'Dagger', 'permil', 'lsaquo', 'rsaquo', 'euro', 'fnof', 'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa', 'Lambda', 'Mu', 'Nu', 'Xi', 'Omicron', 'Pi', 'Rho', 'Sigma', 'Tau', 'Upsilon', 'Phi', 'Chi', 'Psi', 'Omega', 'alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta', 'theta', 'iota', 'kappa', 'lambda', 'mu', 'nu', 'xi', 'omicron', 'pi', 'rho', 'sigmaf', 'sigma', 'tau', 'upsilon', 'phi', 'chi', 'psi', 'omega', 'thetasym', 'upsih', 'piv', 'bull', 'hellip', 'prime', 'Prime', 'oline', 'frasl', 'weierp', 'image', 'real', 'trade', 'alefsym', 'larr', 'uarr', 'rarr', 'darr', 'harr', 'crarr', 'lArr', 'uArr', 'rArr', 'dArr', 'hArr', 'forall', 'part', 'exist', 'empty', 'nabla', 'isin', 'notin', 'ni', 'prod', 'sum', 'minus', 'lowast', 'radic', 'prop', 'infin', 'ang', 'and', 'or', 'cap', 'cup', 'int', 'there4', 'sim', 'cong', 'asymp', 'ne', 'equiv', 'le', 'ge', 'sub', 'sup', 'nsub', 'sube', 'supe', 'oplus', 'otimes', 'perp', 'sdot', 'lceil', 'rceil', 'lfloor', 'rfloor', 'lang', 'rang', 'loz', 'spades', 'clubs', 'hearts', 'diams'];
var HTML_CODES = [39, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255, 34, 38, 60, 62, 338, 339, 352, 353, 376, 710, 732, 8194, 8195, 8201, 8204, 8205, 8206, 8207, 8211, 8212, 8216, 8217, 8218, 8220, 8221, 8222, 8224, 8225, 8240, 8249, 8250, 8364, 402, 913, 914, 915, 916, 917, 918, 919, 920, 921, 922, 923, 924, 925, 926, 927, 928, 929, 931, 932, 933, 934, 935, 936, 937, 945, 946, 947, 948, 949, 950, 951, 952, 953, 954, 955, 956, 957, 958, 959, 960, 961, 962, 963, 964, 965, 966, 967, 968, 969, 977, 978, 982, 8226, 8230, 8242, 8243, 8254, 8260, 8472, 8465, 8476, 8482, 8501, 8592, 8593, 8594, 8595, 8596, 8629, 8656, 8657, 8658, 8659, 8660, 8704, 8706, 8707, 8709, 8711, 8712, 8713, 8715, 8719, 8721, 8722, 8727, 8730, 8733, 8734, 8736, 8743, 8744, 8745, 8746, 8747, 8756, 8764, 8773, 8776, 8800, 8801, 8804, 8805, 8834, 8835, 8836, 8838, 8839, 8853, 8855, 8869, 8901, 8968, 8969, 8970, 8971, 9001, 9002, 9674, 9824, 9827, 9829, 9830];

var alphaIndex = {};
var numIndex = {};

var i = 0;
var length = HTML_ALPHA.length;
while (i < length) {
    var a = HTML_ALPHA[i];
    var c = HTML_CODES[i];
    alphaIndex[a] = String.fromCharCode(c);
    numIndex[c] = a;
    i++;
}

/**
 * @constructor
 */
function Html4Entities() {}

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.prototype.decode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    return str.replace(/&(#?[\w\d]+);?/g, function(s, entity) {
        var chr;
        if (entity.charAt(0) === "#") {
            var code = entity.charAt(1).toLowerCase() === 'x' ?
                parseInt(entity.substr(2), 16) :
                parseInt(entity.substr(1));

            if (!(isNaN(code) || code < -32768 || code > 65535)) {
                chr = String.fromCharCode(code);
            }
        } else {
            chr = alphaIndex[entity];
        }
        return chr || s;
    });
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.decode = function(str) {
    return new Html4Entities().decode(str);
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.prototype.encode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var alpha = numIndex[str.charCodeAt(i)];
        result += alpha ? "&" + alpha + ";" : str.charAt(i);
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.encode = function(str) {
    return new Html4Entities().encode(str);
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.prototype.encodeNonUTF = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var cc = str.charCodeAt(i);
        var alpha = numIndex[cc];
        if (alpha) {
            result += "&" + alpha + ";";
        } else if (cc < 32 || cc > 126) {
            result += "&#" + cc + ";";
        } else {
            result += str.charAt(i);
        }
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.encodeNonUTF = function(str) {
    return new Html4Entities().encodeNonUTF(str);
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.prototype.encodeNonASCII = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var c = str.charCodeAt(i);
        if (c <= 255) {
            result += str[i++];
            continue;
        }
        result += '&#' + c + ';';
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.encodeNonASCII = function(str) {
    return new Html4Entities().encodeNonASCII(str);
};

module.exports = Html4Entities;


/***/ }),
/* 27 */
/***/ (function(module, exports) {

var ALPHA_INDEX = {
    '&lt': '<',
    '&gt': '>',
    '&quot': '"',
    '&apos': '\'',
    '&amp': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&apos;': '\'',
    '&amp;': '&'
};

var CHAR_INDEX = {
    60: 'lt',
    62: 'gt',
    34: 'quot',
    39: 'apos',
    38: 'amp'
};

var CHAR_S_INDEX = {
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '\'': '&apos;',
    '&': '&amp;'
};

/**
 * @constructor
 */
function XmlEntities() {}

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.prototype.encode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    return str.replace(/<|>|"|'|&/g, function(s) {
        return CHAR_S_INDEX[s];
    });
};

/**
 * @param {String} str
 * @returns {String}
 */
 XmlEntities.encode = function(str) {
    return new XmlEntities().encode(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.prototype.decode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    return str.replace(/&#?[0-9a-zA-Z]+;?/g, function(s) {
        if (s.charAt(1) === '#') {
            var code = s.charAt(2).toLowerCase() === 'x' ?
                parseInt(s.substr(3), 16) :
                parseInt(s.substr(2));

            if (isNaN(code) || code < -32768 || code > 65535) {
                return '';
            }
            return String.fromCharCode(code);
        }
        return ALPHA_INDEX[s] || s;
    });
};

/**
 * @param {String} str
 * @returns {String}
 */
 XmlEntities.decode = function(str) {
    return new XmlEntities().decode(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.prototype.encodeNonUTF = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var c = str.charCodeAt(i);
        var alpha = CHAR_INDEX[c];
        if (alpha) {
            result += "&" + alpha + ";";
            i++;
            continue;
        }
        if (c < 32 || c > 126) {
            result += '&#' + c + ';';
        } else {
            result += str.charAt(i);
        }
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 XmlEntities.encodeNonUTF = function(str) {
    return new XmlEntities().encodeNonUTF(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.prototype.encodeNonASCII = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLenght = str.length;
    var result = '';
    var i = 0;
    while (i < strLenght) {
        var c = str.charCodeAt(i);
        if (c <= 255) {
            result += str[i++];
            continue;
        }
        result += '&#' + c + ';';
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 XmlEntities.encodeNonASCII = function(str) {
    return new XmlEntities().encodeNonASCII(str);
 };

module.exports = XmlEntities;


/***/ }),
/* 28 */
/***/ (function(module, exports) {

module.exports = "<div class='container-fluid'>\r\n    <div class='row'>\r\n        <div class='col-sm-3'>\r\n            <nav-menu></nav-menu>\r\n        </div>\r\n        <div class='col-sm-9 body-content'>\r\n            <router-outlet></router-outlet>\r\n        </div>\r\n    </div>\r\n</div>\r\n";

/***/ }),
/* 29 */
/***/ (function(module, exports) {

module.exports = "<!DOCTYPE html>\n<html>\n<head>\n    <meta charset=\"utf-8\" />\n    <title></title>\n</head>\n<body>\n    <h1 id=\"waiting\">Waiting...</h1>\n    <div id=\"error\"></div>\n    <pre>{{ user | json }}</pre>\n</body>\n</html>";

/***/ }),
/* 30 */
/***/ (function(module, exports) {

module.exports = "<h1>Counter</h1>\r\n\r\n<pre>{{ user | json }}</pre>\r\n\r\n<p>This is a simple example of an Angular component.</p>\r\n\r\n<p>Current count: <strong>{{ currentCount }}</strong></p>\r\n\r\n<button (click)=\"incrementCounter()\">Increment</button>\r\n\r\nCAll API NOW by passing Access Token\r\n<button (click)=\"callapi()\">Call API</button>\r\n\r\n<h3 style=\"color:red\">{{displayErrorMessage}}</h3>";

/***/ }),
/* 31 */
/***/ (function(module, exports) {

module.exports = "<h1>Weather forecast</h1>\r\n\r\n<p>This component demonstrates fetching data from the server.</p>\r\n\r\n<p *ngIf=\"!forecasts\"><em>Loading...</em></p>\r\n\r\n<table class='table' *ngIf=\"forecasts\">\r\n    <thead>\r\n        <tr>\r\n            <th>Date</th>\r\n            <th>Temp. (C)</th>\r\n            <th>Temp. (F)</th>\r\n            <th>Summary</th>\r\n        </tr>\r\n    </thead>\r\n    <tbody>\r\n        <tr *ngFor=\"let forecast of forecasts\">\r\n            <td>{{ forecast.dateFormatted }}</td>\r\n            <td>{{ forecast.temperatureC }}</td>\r\n            <td>{{ forecast.temperatureF }}</td>\r\n            <td>{{ forecast.summary }}</td>\r\n        </tr>\r\n    </tbody>\r\n</table>\r\n\r\n\r\n";

/***/ }),
/* 32 */
/***/ (function(module, exports) {

module.exports = "<h1>Hello, world!</h1>\r\n<p>Welcome to your new single-page application, built with:</p>\r\n\r\n<h3>Home page</h3>\r\n\r\n";

/***/ }),
/* 33 */
/***/ (function(module, exports) {

module.exports = "<div class='main-nav'>\r\n    <div class='navbar navbar-inverse'>\r\n        <div class='navbar-header'>\r\n            <button type='button' class='navbar-toggle' data-toggle='collapse' data-target='.navbar-collapse'>\r\n                <span class='sr-only'>Toggle navigation</span>\r\n                <span class='icon-bar'></span>\r\n                <span class='icon-bar'></span>\r\n                <span class='icon-bar'></span>\r\n            </button>\r\n            <a class='navbar-brand' [routerLink]=\"['/home']\">AngularCore</a>\r\n        </div>\r\n        <div class='clearfix'></div>\r\n        <div class='navbar-collapse collapse'>\r\n            <ul class='nav navbar-nav'>\r\n                <li [routerLinkActive]=\"['link-active']\">\r\n                    <a [routerLink]=\"['/home']\">\r\n                        <span class='glyphicon glyphicon-home'></span> Home\r\n                    </a>\r\n                </li>\r\n                <li [routerLinkActive]=\"['link-active']\">\r\n                    <a [routerLink]=\"['/counter']\">\r\n                        <span class='glyphicon glyphicon-education'></span> Counter\r\n                    </a>\r\n                </li>\r\n                <li [routerLinkActive]=\"['link-active']\">\r\n                    <a [routerLink]=\"['/fetch-data']\">\r\n                        <span class='glyphicon glyphicon-th-list'></span> Fetch data\r\n                    </a>\r\n                </li>\r\n            </ul>\r\n        </div>\r\n    </div>\r\n</div>\r\n";

/***/ }),
/* 34 */
/***/ (function(module, exports) {

module.exports = "\r\n<h4>Test New </h4>";

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

!function(t,e){if(true)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var r=e();for(var n in r)("object"==typeof exports?exports:t)[n]=r[n]}}("undefined"!=typeof self?self:this,function(){return function(t){var e={};function r(n){if(e[n])return e[n].exports;var i=e[n]={i:n,l:!1,exports:{}};return t[n].call(i.exports,i,i.exports,r),i.l=!0,i.exports}return r.m=t,r.c=e,r.d=function(t,e,n){r.o(t,e)||Object.defineProperty(t,e,{configurable:!1,enumerable:!0,get:n})},r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="",r(r.s=19)}([function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=function(){function t(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}}();var i={debug:function(){},info:function(){},warn:function(){},error:function(){}},o=void 0,s=void 0;(e.Log=function(){function t(){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t)}return t.reset=function(){s=3,o=i},t.debug=function(){if(s>=4){for(var t=arguments.length,e=Array(t),r=0;r<t;r++)e[r]=arguments[r];o.debug.apply(o,Array.from(e))}},t.info=function(){if(s>=3){for(var t=arguments.length,e=Array(t),r=0;r<t;r++)e[r]=arguments[r];o.info.apply(o,Array.from(e))}},t.warn=function(){if(s>=2){for(var t=arguments.length,e=Array(t),r=0;r<t;r++)e[r]=arguments[r];o.warn.apply(o,Array.from(e))}},t.error=function(){if(s>=1){for(var t=arguments.length,e=Array(t),r=0;r<t;r++)e[r]=arguments[r];o.error.apply(o,Array.from(e))}},n(t,null,[{key:"NONE",get:function(){return 0}},{key:"ERROR",get:function(){return 1}},{key:"WARN",get:function(){return 2}},{key:"INFO",get:function(){return 3}},{key:"DEBUG",get:function(){return 4}},{key:"level",get:function(){return s},set:function(t){if(!(0<=t&&t<=4))throw new Error("Invalid log level");s=t}},{key:"logger",get:function(){return o},set:function(t){if(!t.debug&&t.info&&(t.debug=t.info),!(t.debug&&t.info&&t.warn&&t.error))throw new Error("Invalid logger");o=t}}]),t}()).reset()},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=function(){function t(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}}();var i={setInterval:function(t){function e(e,r){return t.apply(this,arguments)}return e.toString=function(){return t.toString()},e}(function(t,e){return setInterval(t,e)}),clearInterval:function(t){function e(e){return t.apply(this,arguments)}return e.toString=function(){return t.toString()},e}(function(t){return clearInterval(t)})},o=!1,s=null;e.Global=function(){function t(){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t)}return t._testing=function(){o=!0},t.setXMLHttpRequest=function(t){s=t},n(t,null,[{key:"location",get:function(){if(!o)return location}},{key:"localStorage",get:function(){if(!o&&"undefined"!=typeof window)return localStorage}},{key:"sessionStorage",get:function(){if(!o&&"undefined"!=typeof window)return sessionStorage}},{key:"XMLHttpRequest",get:function(){if(!o&&"undefined"!=typeof window)return s||XMLHttpRequest}},{key:"timer",get:function(){if(!o)return i}}]),t}()},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.MetadataService=void 0;var n=function(){function t(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}}(),i=r(0),o=r(8);e.MetadataService=function(){function t(e){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:o.JsonService;if(function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),!e)throw i.Log.error("MetadataService: No settings passed to MetadataService"),new Error("settings");this._settings=e,this._jsonService=new r}return t.prototype.getMetadata=function(){var t=this;return this._settings.metadata?(i.Log.debug("MetadataService.getMetadata: Returning metadata from settings"),Promise.resolve(this._settings.metadata)):this.metadataUrl?(i.Log.debug("MetadataService.getMetadata: getting metadata from",this.metadataUrl),this._jsonService.getJson(this.metadataUrl).then(function(e){return i.Log.debug("MetadataService.getMetadata: json received"),t._settings.metadata=e,e})):(i.Log.error("MetadataService.getMetadata: No authority or metadataUrl configured on settings"),Promise.reject(new Error("No authority or metadataUrl configured on settings")))},t.prototype.getIssuer=function(){return this._getMetadataProperty("issuer")},t.prototype.getAuthorizationEndpoint=function(){return this._getMetadataProperty("authorization_endpoint")},t.prototype.getUserInfoEndpoint=function(){return this._getMetadataProperty("userinfo_endpoint")},t.prototype.getTokenEndpoint=function(){return this._getMetadataProperty("token_endpoint",!0)},t.prototype.getCheckSessionIframe=function(){return this._getMetadataProperty("check_session_iframe",!0)},t.prototype.getEndSessionEndpoint=function(){return this._getMetadataProperty("end_session_endpoint",!0)},t.prototype.getRevocationEndpoint=function(){return this._getMetadataProperty("revocation_endpoint",!0)},t.prototype._getMetadataProperty=function(t){var e=arguments.length>1&&void 0!==arguments[1]&&arguments[1];return i.Log.debug("MetadataService.getMetadataProperty for: "+t),this.getMetadata().then(function(r){if(i.Log.debug("MetadataService.getMetadataProperty: metadata recieved"),void 0===r[t]){if(!0===e)return void i.Log.warn("MetadataService.getMetadataProperty: Metadata does not contain optional property "+t);throw i.Log.error("MetadataService.getMetadataProperty: Metadata does not contain property "+t),new Error("Metadata does not contain property "+t)}return r[t]})},t.prototype.getSigningKeys=function(){var t=this;return this._settings.signingKeys?(i.Log.debug("MetadataService.getSigningKeys: Returning signingKeys from settings"),Promise.resolve(this._settings.signingKeys)):this._getMetadataProperty("jwks_uri").then(function(e){return i.Log.debug("MetadataService.getSigningKeys: jwks_uri received",e),t._jsonService.getJson(e).then(function(e){if(i.Log.debug("MetadataService.getSigningKeys: key set received",e),!e.keys)throw i.Log.error("MetadataService.getSigningKeys: Missing keys on keyset"),new Error("Missing keys on keyset");return t._settings.signingKeys=e.keys,t._settings.signingKeys})})},n(t,[{key:"metadataUrl",get:function(){return this._metadataUrl||(this._settings.metadataUrl?this._metadataUrl=this._settings.metadataUrl:(this._metadataUrl=this._settings.authority,this._metadataUrl&&this._metadataUrl.indexOf(".well-known/openid-configuration")<0&&("/"!==this._metadataUrl[this._metadataUrl.length-1]&&(this._metadataUrl+="/"),this._metadataUrl+=".well-known/openid-configuration"))),this._metadataUrl}}]),t}()},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.UrlUtility=void 0;var n=r(0),i=r(1);e.UrlUtility=function(){function t(){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t)}return t.addQueryParam=function(t,e,r){return t.indexOf("?")<0&&(t+="?"),"?"!==t[t.length-1]&&(t+="&"),t+=encodeURIComponent(e),t+="=",t+=encodeURIComponent(r)},t.parseUrlFragment=function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"#",r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:i.Global;"string"!=typeof t&&(t=r.location.href);var o=t.lastIndexOf(e);o>=0&&(t=t.substr(o+1));for(var s,a={},u=/([^&=]+)=([^&]*)/g,c=0;s=u.exec(t);)if(a[decodeURIComponent(s[1])]=decodeURIComponent(s[2]),c++>50)return n.Log.error("UrlUtility.parseUrlFragment: response exceeded expected number of parameters",t),{error:"Response exceeded expected number of parameters"};for(var h in a)return a;return{}},t}()},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.OidcClientSettings=void 0;var n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},i=function(){function t(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}}(),o=r(0),s=r(5),a=r(20),u=r(2);var c="id_token",h="openid",l=900,f=300;e.OidcClientSettings=function(){function t(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},r=e.authority,i=e.metadataUrl,o=e.metadata,d=e.signingKeys,p=e.client_id,g=e.client_secret,v=e.response_type,y=void 0===v?c:v,m=e.scope,S=void 0===m?h:m,b=e.redirect_uri,w=e.post_logout_redirect_uri,F=e.prompt,_=e.display,E=e.max_age,x=e.ui_locales,A=e.acr_values,P=e.resource,C=e.filterProtocolClaims,R=void 0===C||C,T=e.loadUserInfo,k=void 0===T||T,D=e.staleStateAge,I=void 0===D?l:D,N=e.clockSkew,B=void 0===N?f:N,j=e.stateStore,L=void 0===j?new s.WebStorageStateStore:j,O=e.ResponseValidatorCtor,H=void 0===O?a.ResponseValidator:O,U=e.MetadataServiceCtor,M=void 0===U?u.MetadataService:U,V=e.extraQueryParams,K=void 0===V?{}:V;!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this._authority=r,this._metadataUrl=i,this._metadata=o,this._signingKeys=d,this._client_id=p,this._client_secret=g,this._response_type=y,this._scope=S,this._redirect_uri=b,this._post_logout_redirect_uri=w,this._prompt=F,this._display=_,this._max_age=E,this._ui_locales=x,this._acr_values=A,this._resource=P,this._filterProtocolClaims=!!R,this._loadUserInfo=!!k,this._staleStateAge=I,this._clockSkew=B,this._stateStore=L,this._validator=new H(this),this._metadataService=new M(this),this._extraQueryParams="object"===(void 0===K?"undefined":n(K))?K:{}}return i(t,[{key:"client_id",get:function(){return this._client_id},set:function(t){if(this._client_id)throw o.Log.error("OidcClientSettings.set_client_id: client_id has already been assigned."),new Error("client_id has already been assigned.");this._client_id=t}},{key:"client_secret",get:function(){return this._client_secret}},{key:"response_type",get:function(){return this._response_type}},{key:"scope",get:function(){return this._scope}},{key:"redirect_uri",get:function(){return this._redirect_uri}},{key:"post_logout_redirect_uri",get:function(){return this._post_logout_redirect_uri}},{key:"prompt",get:function(){return this._prompt}},{key:"display",get:function(){return this._display}},{key:"max_age",get:function(){return this._max_age}},{key:"ui_locales",get:function(){return this._ui_locales}},{key:"acr_values",get:function(){return this._acr_values}},{key:"resource",get:function(){return this._resource}},{key:"authority",get:function(){return this._authority},set:function(t){if(this._authority)throw o.Log.error("OidcClientSettings.set_authority: authority has already been assigned."),new Error("authority has already been assigned.");this._authority=t}},{key:"metadataUrl",get:function(){return this._metadataUrl||(this._metadataUrl=this.authority,this._metadataUrl&&this._metadataUrl.indexOf(".well-known/openid-configuration")<0&&("/"!==this._metadataUrl[this._metadataUrl.length-1]&&(this._metadataUrl+="/"),this._metadataUrl+=".well-known/openid-configuration")),this._metadataUrl}},{key:"metadata",get:function(){return this._metadata},set:function(t){this._metadata=t}},{key:"signingKeys",get:function(){return this._signingKeys},set:function(t){this._signingKeys=t}},{key:"filterProtocolClaims",get:function(){return this._filterProtocolClaims}},{key:"loadUserInfo",get:function(){return this._loadUserInfo}},{key:"staleStateAge",get:function(){return this._staleStateAge}},{key:"clockSkew",get:function(){return this._clockSkew}},{key:"stateStore",get:function(){return this._stateStore}},{key:"validator",get:function(){return this._validator}},{key:"metadataService",get:function(){return this._metadataService}},{key:"extraQueryParams",get:function(){return this._extraQueryParams},set:function(t){"object"===(void 0===t?"undefined":n(t))?this._extraQueryParams=t:this._extraQueryParams={}}}]),t}()},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.WebStorageStateStore=void 0;var n=r(0),i=r(1);e.WebStorageStateStore=function(){function t(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},r=e.prefix,n=void 0===r?"oidc.":r,o=e.store,s=void 0===o?i.Global.localStorage:o;!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this._store=s,this._prefix=n}return t.prototype.set=function(t,e){return n.Log.debug("WebStorageStateStore.set",t),t=this._prefix+t,this._store.setItem(t,e),Promise.resolve()},t.prototype.get=function(t){n.Log.debug("WebStorageStateStore.get",t),t=this._prefix+t;var e=this._store.getItem(t);return Promise.resolve(e)},t.prototype.remove=function(t){n.Log.debug("WebStorageStateStore.remove",t),t=this._prefix+t;var e=this._store.getItem(t);return this._store.removeItem(t),Promise.resolve(e)},t.prototype.getAllKeys=function(){n.Log.debug("WebStorageStateStore.getAllKeys");for(var t=[],e=0;e<this._store.length;e++){var r=this._store.key(e);0===r.indexOf(this._prefix)&&t.push(r.substr(this._prefix.length))}return Promise.resolve(t)},t}()},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.State=void 0;var n,i=function(){function t(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}}(),o=r(0),s=r(11),a=(n=s)&&n.__esModule?n:{default:n};e.State=function(){function t(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},r=e.id,n=e.data,i=e.created;!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this._id=r||(0,a.default)(),this._data=n,this._created="number"==typeof i&&i>0?i:parseInt(Date.now()/1e3)}return t.prototype.toStorageString=function(){return o.Log.debug("State.toStorageString"),JSON.stringify({id:this.id,data:this.data,created:this.created})},t.fromStorageString=function(e){return o.Log.debug("State.fromStorageString"),new t(JSON.parse(e))},t.clearStaleState=function(e,r){var n=Date.now()/1e3-r;return e.getAllKeys().then(function(r){o.Log.debug("State.clearStaleState: got keys",r);for(var i=[],s=function(s){var a=r[s];u=e.get(a).then(function(r){var i=!1;if(r)try{var s=t.fromStorageString(r);o.Log.debug("State.clearStaleState: got item from key: ",a,s.created),s.created<=n&&(i=!0)}catch(t){o.Log.error("State.clearStaleState: Error parsing state for key",a,t.message),i=!0}else o.Log.debug("State.clearStaleState: no item in storage for key: ",a),i=!0;if(i)return o.Log.debug("State.clearStaleState: removed item for key: ",a),e.remove(a)}),i.push(u)},a=0;a<r.length;a++){var u;s(a)}return o.Log.debug("State.clearStaleState: waiting on promise count:",i.length),Promise.all(i)})},i(t,[{key:"id",get:function(){return this._id}},{key:"data",get:function(){return this._data}},{key:"created",get:function(){return this._created}}]),t}()},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.OidcClient=void 0;var n=function(){function t(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}}(),i=r(0),o=r(4),s=r(9),a=r(29),u=r(30),c=r(31),h=r(32),l=r(10),f=r(6);e.OidcClient=function(){function t(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),e instanceof o.OidcClientSettings?this._settings=e:this._settings=new o.OidcClientSettings(e)}return t.prototype.createSigninRequest=function(){var t=this,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},r=e.response_type,n=e.scope,o=e.redirect_uri,s=e.data,u=e.state,c=e.prompt,h=e.display,l=e.max_age,f=e.ui_locales,d=e.id_token_hint,p=e.login_hint,g=e.acr_values,v=e.resource,y=e.request,m=e.request_uri,S=e.extraQueryParams,b=arguments[1];i.Log.debug("OidcClient.createSigninRequest");var w=this._settings.client_id;r=r||this._settings.response_type,n=n||this._settings.scope,o=o||this._settings.redirect_uri,c=c||this._settings.prompt,h=h||this._settings.display,l=l||this._settings.max_age,f=f||this._settings.ui_locales,g=g||this._settings.acr_values,v=v||this._settings.resource,S=S||this._settings.extraQueryParams;var F=this._settings.authority;return this._metadataService.getAuthorizationEndpoint().then(function(e){i.Log.debug("OidcClient.createSigninRequest: Received authorization endpoint",e);var _=new a.SigninRequest({url:e,client_id:w,redirect_uri:o,response_type:r,scope:n,data:s||u,authority:F,prompt:c,display:h,max_age:l,ui_locales:f,id_token_hint:d,login_hint:p,acr_values:g,resource:v,request:y,request_uri:m,extraQueryParams:S}),E=_.state;return(b=b||t._stateStore).set(E.id,E.toStorageString()).then(function(){return _})})},t.prototype.processSigninResponse=function(t,e){var r=this;i.Log.debug("OidcClient.processSigninResponse");var n=new u.SigninResponse(t);return n.state?(e=e||this._stateStore).remove(n.state).then(function(t){if(!t)throw i.Log.error("OidcClient.processSigninResponse: No matching state found in storage"),new Error("No matching state found in storage");var e=l.SigninState.fromStorageString(t);return i.Log.debug("OidcClient.processSigninResponse: Received state from storage; validating response"),r._validator.validateSigninResponse(e,n)}):(i.Log.error("OidcClient.processSigninResponse: No state in response"),Promise.reject(new Error("No state in response")))},t.prototype.createSignoutRequest=function(){var t=this,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},r=e.id_token_hint,n=e.data,o=e.state,s=e.post_logout_redirect_uri,a=arguments[1];return i.Log.debug("OidcClient.createSignoutRequest"),s=s||this._settings.post_logout_redirect_uri,this._metadataService.getEndSessionEndpoint().then(function(e){if(!e)throw i.Log.error("OidcClient.createSignoutRequest: No end session endpoint url returned"),new Error("no end session endpoint");i.Log.debug("OidcClient.createSignoutRequest: Received end session endpoint",e);var u=new c.SignoutRequest({url:e,id_token_hint:r,post_logout_redirect_uri:s,data:n||o}),h=u.state;return h&&(i.Log.debug("OidcClient.createSignoutRequest: Signout request has state to persist"),(a=a||t._stateStore).set(h.id,h.toStorageString())),u})},t.prototype.processSignoutResponse=function(t,e){var r=this;i.Log.debug("OidcClient.processSignoutResponse");var n=new h.SignoutResponse(t);if(!n.state)return i.Log.debug("OidcClient.processSignoutResponse: No state in response"),n.error?(i.Log.warn("OidcClient.processSignoutResponse: Response was error: ",n.error),Promise.reject(new s.ErrorResponse(n))):Promise.resolve(n);var o=n.state;return(e=e||this._stateStore).remove(o).then(function(t){if(!t)throw i.Log.error("OidcClient.processSignoutResponse: No matching state found in storage"),new Error("No matching state found in storage");var e=f.State.fromStorageString(t);return i.Log.debug("OidcClient.processSignoutResponse: Received state from storage; validating response"),r._validator.validateSignoutResponse(e,n)})},t.prototype.clearStaleState=function(t){return i.Log.debug("OidcClient.clearStaleState"),t=t||this._stateStore,f.State.clearStaleState(t,this.settings.staleStateAge)},n(t,[{key:"_stateStore",get:function(){return this.settings.stateStore}},{key:"_validator",get:function(){return this.settings.validator}},{key:"_metadataService",get:function(){return this.settings.metadataService}},{key:"settings",get:function(){return this._settings}},{key:"metadataService",get:function(){return this._metadataService}}]),t}()},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.JsonService=void 0;var n=r(0),i=r(1);e.JsonService=function(){function t(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:i.Global.XMLHttpRequest;!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this._XMLHttpRequest=e}return t.prototype.getJson=function(t,e){var r=this;if(!t)throw n.Log.error("JsonService.getJson: No url passed"),new Error("url");return n.Log.debug("JsonService.getJson, url: ",t),new Promise(function(i,o){var s=new r._XMLHttpRequest;s.open("GET",t),s.onload=function(){if(n.Log.debug("JsonService.getJson: HTTP response received, status",s.status),200===s.status){var e=s.getResponseHeader("Content-Type");if(e&&e.startsWith("application/json"))try{i(JSON.parse(s.responseText))}catch(t){n.Log.error("JsonService.getJson: Error parsing JSON response",t.message),o(t)}else o(Error("Invalid response Content-Type: "+e+", from URL: "+t))}else o(Error(s.statusText+" ("+s.status+")"))},s.onerror=function(){n.Log.error("JsonService.getJson: network error"),o(Error("Network Error"))},e&&(n.Log.debug("JsonService.getJson: token passed, setting Authorization header"),s.setRequestHeader("Authorization","Bearer "+e)),s.send()})},t}()},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.ErrorResponse=void 0;var n=r(0);e.ErrorResponse=function(t){function e(){var r=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},i=r.error,o=r.error_description,s=r.error_uri,a=r.state;if(function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,e),!i)throw n.Log.error("No error passed to ErrorResponse"),new Error("error");var u=function(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}(this,t.call(this,o||i));return u.name="ErrorResponse",u.error=i,u.error_description=o,u.error_uri=s,u.state=a,u}return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}(e,t),e}(Error)},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.SigninState=void 0;var n,i=function(){function t(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}}(),o=r(0),s=r(6),a=r(11),u=(n=a)&&n.__esModule?n:{default:n};e.SigninState=function(t){function e(){var r=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},n=r.nonce,i=r.authority,o=r.client_id;!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,e);var s=function(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}(this,t.call(this,arguments[0]));return!0===n?s._nonce=(0,u.default)():n&&(s._nonce=n),s._authority=i,s._client_id=o,s}return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}(e,t),e.prototype.toStorageString=function(){return o.Log.debug("SigninState.toStorageString"),JSON.stringify({id:this.id,data:this.data,created:this.created,nonce:this.nonce,authority:this.authority,client_id:this.client_id})},e.fromStorageString=function(t){return o.Log.debug("SigninState.fromStorageString"),new e(JSON.parse(t))},i(e,[{key:"nonce",get:function(){return this._nonce}},{key:"authority",get:function(){return this._authority}},{key:"client_id",get:function(){return this._client_id}}]),e}(s.State)},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default=
// @preserve Copyright (c) Microsoft Open Technologies, Inc.
function(){for(var t="xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx",e="0123456789abcdef",r=0,n="",i=0;i<t.length;i++)"-"!==t[i]&&"4"!==t[i]&&(r=16*Math.random()|0),"x"===t[i]?n+=e[r]:"y"===t[i]?(r&=3,n+=e[r|=8]):n+=t[i];return n},t.exports=e.default},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.User=void 0;var n=function(){function t(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}}(),i=r(0);e.User=function(){function t(e){var r=e.id_token,n=e.session_state,i=e.access_token,o=e.token_type,s=e.scope,a=e.profile,u=e.expires_at,c=e.state;!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.id_token=r,this.session_state=n,this.access_token=i,this.token_type=o,this.scope=s,this.profile=a,this.expires_at=u,this.state=c}return t.prototype.toStorageString=function(){return i.Log.debug("User.toStorageString"),JSON.stringify({id_token:this.id_token,session_state:this.session_state,access_token:this.access_token,token_type:this.token_type,scope:this.scope,profile:this.profile,expires_at:this.expires_at})},t.fromStorageString=function(e){return i.Log.debug("User.fromStorageString"),new t(JSON.parse(e))},n(t,[{key:"expires_in",get:function(){if(this.expires_at){var t=parseInt(Date.now()/1e3);return this.expires_at-t}}},{key:"expired",get:function(){var t=this.expires_in;if(void 0!==t)return t<=0}},{key:"scopes",get:function(){return(this.scope||"").split(" ")}}]),t}()},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.AccessTokenEvents=void 0;var n=r(0),i=r(42);var o=60;e.AccessTokenEvents=function(){function t(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},r=e.accessTokenExpiringNotificationTime,n=void 0===r?o:r,s=e.accessTokenExpiringTimer,a=void 0===s?new i.Timer("Access token expiring"):s,u=e.accessTokenExpiredTimer,c=void 0===u?new i.Timer("Access token expired"):u;!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this._accessTokenExpiringNotificationTime=n,this._accessTokenExpiring=a,this._accessTokenExpired=c}return t.prototype.load=function(t){if(t.access_token&&void 0!==t.expires_in){var e=t.expires_in;if(n.Log.debug("AccessTokenEvents.load: access token present, remaining duration:",e),e>0){var r=e-this._accessTokenExpiringNotificationTime;r<=0&&(r=1),n.Log.debug("AccessTokenEvents.load: registering expiring timer in:",r),this._accessTokenExpiring.init(r)}else n.Log.debug("AccessTokenEvents.load: canceling existing expiring timer becase we're past expiration."),this._accessTokenExpiring.cancel();var i=e+1;n.Log.debug("AccessTokenEvents.load: registering expired timer in:",i),this._accessTokenExpired.init(i)}else this._accessTokenExpiring.cancel(),this._accessTokenExpired.cancel()},t.prototype.unload=function(){n.Log.debug("AccessTokenEvents.unload: canceling existing access token timers"),this._accessTokenExpiring.cancel(),this._accessTokenExpired.cancel()},t.prototype.addAccessTokenExpiring=function(t){this._accessTokenExpiring.addHandler(t)},t.prototype.removeAccessTokenExpiring=function(t){this._accessTokenExpiring.removeHandler(t)},t.prototype.addAccessTokenExpired=function(t){this._accessTokenExpired.addHandler(t)},t.prototype.removeAccessTokenExpired=function(t){this._accessTokenExpired.removeHandler(t)},t}()},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.Event=void 0;var n=r(0);e.Event=function(){function t(e){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this._name=e,this._callbacks=[]}return t.prototype.addHandler=function(t){this._callbacks.push(t)},t.prototype.removeHandler=function(t){var e=this._callbacks.findIndex(function(e){return e===t});e>=0&&this._callbacks.splice(e,1)},t.prototype.raise=function(){n.Log.debug("Event: Raising event: "+this._name);for(var t=0;t<this._callbacks.length;t++){var e;(e=this._callbacks)[t].apply(e,arguments)}},t}()},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.SessionMonitor=void 0;var n=function(){function t(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}}(),i=r(0),o=r(16);e.SessionMonitor=function(){function t(e){var r=this,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:o.CheckSessionIFrame;if(function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),!e)throw i.Log.error("SessionMonitor.ctor: No user manager passed to SessionMonitor"),new Error("userManager");this._userManager=e,this._CheckSessionIFrameCtor=n,this._userManager.events.addUserLoaded(this._start.bind(this)),this._userManager.events.addUserUnloaded(this._stop.bind(this)),this._userManager.getUser().then(function(t){t&&r._start(t)}).catch(function(t){i.Log.error("SessionMonitor ctor: error from getUser:",t.message)})}return t.prototype._start=function(t){var e=this,r=t.session_state;r&&(this._sub=t.profile.sub,this._sid=t.profile.sid,i.Log.debug("SessionMonitor._start: session_state:",r,", sub:",this._sub),this._checkSessionIFrame?this._checkSessionIFrame.start(r):this._metadataService.getCheckSessionIframe().then(function(t){if(t){i.Log.debug("SessionMonitor._start: Initializing check session iframe");var n=e._client_id,o=e._checkSessionInterval,s=e._stopCheckSessionOnError;e._checkSessionIFrame=new e._CheckSessionIFrameCtor(e._callback.bind(e),n,t,o,s),e._checkSessionIFrame.load().then(function(){e._checkSessionIFrame.start(r)})}else i.Log.warn("SessionMonitor._start: No check session iframe found in the metadata")}).catch(function(t){i.Log.error("SessionMonitor._start: Error from getCheckSessionIframe:",t.message)}))},t.prototype._stop=function(){this._sub=null,this._sid=null,this._checkSessionIFrame&&(i.Log.debug("SessionMonitor._stop"),this._checkSessionIFrame.stop())},t.prototype._callback=function(){var t=this;this._userManager.querySessionStatus().then(function(e){var r=!0;e?e.sub===t._sub?(r=!1,t._checkSessionIFrame.start(e.session_state),e.sid===t._sid?i.Log.debug("SessionMonitor._callback: Same sub still logged in at OP, restarting check session iframe; session_state:",e.session_state):(i.Log.debug("SessionMonitor._callback: Same sub still logged in at OP, session state has changed, restarting check session iframe; session_state:",e.session_state),t._userManager.events._raiseUserSessionChanged())):i.Log.debug("SessionMonitor._callback: Different subject signed into OP:",e.sub):i.Log.debug("SessionMonitor._callback: Subject no longer signed into OP"),r&&(i.Log.debug("SessionMonitor._callback: SessionMonitor._callback; raising signed out event"),t._userManager.events._raiseUserSignedOut())}).catch(function(e){i.Log.debug("SessionMonitor._callback: Error calling queryCurrentSigninSession; raising signed out event",e.message),t._userManager.events._raiseUserSignedOut()})},n(t,[{key:"_settings",get:function(){return this._userManager.settings}},{key:"_metadataService",get:function(){return this._userManager.metadataService}},{key:"_client_id",get:function(){return this._settings.client_id}},{key:"_checkSessionInterval",get:function(){return this._settings.checkSessionInterval}},{key:"_stopCheckSessionOnError",get:function(){return this._settings.stopCheckSessionOnError}}]),t}()},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.CheckSessionIFrame=void 0;var n=r(0);var i=2e3;e.CheckSessionIFrame=function(){function t(e,r,n,o){var s=!(arguments.length>4&&void 0!==arguments[4])||arguments[4];!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this._callback=e,this._client_id=r,this._url=n,this._interval=o||i,this._stopOnError=s;var a=n.indexOf("/",n.indexOf("//")+2);this._frame_origin=n.substr(0,a),this._frame=window.document.createElement("iframe"),this._frame.style.visibility="hidden",this._frame.style.position="absolute",this._frame.style.display="none",this._frame.style.width=0,this._frame.style.height=0,this._frame.src=n}return t.prototype.load=function(){var t=this;return new Promise(function(e){t._frame.onload=function(){e()},window.document.body.appendChild(t._frame),t._boundMessageEvent=t._message.bind(t),window.addEventListener("message",t._boundMessageEvent,!1)})},t.prototype._message=function(t){t.origin===this._frame_origin&&t.source===this._frame.contentWindow&&("error"===t.data?(n.Log.error("CheckSessionIFrame: error message from check session op iframe"),this._stopOnError&&this.stop()):"changed"===t.data?(n.Log.debug("CheckSessionIFrame: changed message from check session op iframe"),this.stop(),this._callback()):n.Log.debug("CheckSessionIFrame: "+t.data+" message from check session op iframe"))},t.prototype.start=function(t){var e=this;if(this._session_state!==t){n.Log.debug("CheckSessionIFrame.start"),this.stop(),this._session_state=t;var r=function(){e._frame.contentWindow.postMessage(e._client_id+" "+e._session_state,e._frame_origin)};r(),this._timer=window.setInterval(r,this._interval)}},t.prototype.stop=function(){this._session_state=null,this._timer&&(n.Log.debug("CheckSessionIFrame.stop"),window.clearInterval(this._timer),this._timer=null)},t}()},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.TokenRevocationClient=void 0;var n=r(0),i=r(2),o=r(1);e.TokenRevocationClient=function(){function t(e){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:o.Global.XMLHttpRequest,s=arguments.length>2&&void 0!==arguments[2]?arguments[2]:i.MetadataService;if(function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),!e)throw n.Log.error("TokenRevocationClient.ctor: No settings provided"),new Error("No settings provided.");this._settings=e,this._XMLHttpRequestCtor=r,this._metadataService=new s(this._settings)}return t.prototype.revoke=function(t,e){var r=this;if(!t)throw n.Log.error("TokenRevocationClient.revoke: No accessToken provided"),new Error("No accessToken provided.");return this._metadataService.getRevocationEndpoint().then(function(i){if(i){n.Log.error("TokenRevocationClient.revoke: Revoking access token");var o=r._settings.client_id,s=r._settings.client_secret;return r._revoke(i,o,s,t)}if(e)throw n.Log.error("TokenRevocationClient.revoke: Revocation not supported"),new Error("Revocation not supported")})},t.prototype._revoke=function(t,e,r,i){var o=this;return new Promise(function(s,a){var u=new o._XMLHttpRequestCtor;u.open("POST",t),u.onload=function(){n.Log.debug("TokenRevocationClient.revoke: HTTP response received, status",u.status),200===u.status?s():a(Error(u.statusText+" ("+u.status+")"))};var c="client_id="+encodeURIComponent(e);r&&(c+="&client_secret="+encodeURIComponent(r)),c+="&token_type_hint="+encodeURIComponent("access_token"),c+="&token="+encodeURIComponent(i),u.setRequestHeader("Content-Type","application/x-www-form-urlencoded"),u.send(c)})},t}()},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.CordovaPopupWindow=void 0;var n=function(){function t(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}}(),i=r(0);var o="location=no,toolbar=no,zoom=no",s="_blank";e.CordovaPopupWindow=function(){function t(e){var r=this;!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this._promise=new Promise(function(t,e){r._resolve=t,r._reject=e}),this.features=e.popupWindowFeatures||o,this.target=e.popupWindowTarget||s,this.redirect_uri=e.startUrl,i.Log.debug("CordovaPopupWindow.ctor: redirect_uri: "+this.redirect_uri)}return t.prototype._isInAppBrowserInstalled=function(t){return["cordova-plugin-inappbrowser","cordova-plugin-inappbrowser.inappbrowser","org.apache.cordova.inappbrowser"].some(function(e){return t.hasOwnProperty(e)})},t.prototype.navigate=function(t){if(t&&t.url){if(!window.cordova)return this._error("cordova is undefined");var e=window.cordova.require("cordova/plugin_list").metadata;if(!1===this._isInAppBrowserInstalled(e))return this._error("InAppBrowser plugin not found");this._popup=cordova.InAppBrowser.open(t.url,this.target,this.features),this._popup?(i.Log.debug("CordovaPopupWindow.navigate: popup successfully created"),this._exitCallbackEvent=this._exitCallback.bind(this),this._loadStartCallbackEvent=this._loadStartCallback.bind(this),this._popup.addEventListener("exit",this._exitCallbackEvent,!1),this._popup.addEventListener("loadstart",this._loadStartCallbackEvent,!1)):this._error("Error opening popup window")}else this._error("No url provided");return this.promise},t.prototype._loadStartCallback=function(t){0===t.url.indexOf(this.redirect_uri)&&this._success({url:t.url})},t.prototype._exitCallback=function(t){this._error(t)},t.prototype._success=function(t){this._cleanup(),i.Log.debug("CordovaPopupWindow: Successful response from cordova popup window"),this._resolve(t)},t.prototype._error=function(t){this._cleanup(),i.Log.error(t),this._reject(new Error(t))},t.prototype.close=function(){this._cleanup()},t.prototype._cleanup=function(){this._popup&&(i.Log.debug("CordovaPopupWindow: cleaning up popup"),this._popup.removeEventListener("exit",this._exitCallbackEvent,!1),this._popup.removeEventListener("loadstart",this._loadStartCallbackEvent,!1),this._popup.close()),this._popup=null},n(t,[{key:"promise",get:function(){return this._promise}}]),t}()},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=r(0);Object.defineProperty(e,"Log",{enumerable:!0,get:function(){return n.Log}});var i=r(7);Object.defineProperty(e,"OidcClient",{enumerable:!0,get:function(){return i.OidcClient}});var o=r(4);Object.defineProperty(e,"OidcClientSettings",{enumerable:!0,get:function(){return o.OidcClientSettings}});var s=r(5);Object.defineProperty(e,"WebStorageStateStore",{enumerable:!0,get:function(){return s.WebStorageStateStore}});var a=r(33);Object.defineProperty(e,"InMemoryWebStorage",{enumerable:!0,get:function(){return a.InMemoryWebStorage}});var u=r(34);Object.defineProperty(e,"UserManager",{enumerable:!0,get:function(){return u.UserManager}});var c=r(13);Object.defineProperty(e,"AccessTokenEvents",{enumerable:!0,get:function(){return c.AccessTokenEvents}});var h=r(2);Object.defineProperty(e,"MetadataService",{enumerable:!0,get:function(){return h.MetadataService}});var l=r(44);Object.defineProperty(e,"CordovaPopupNavigator",{enumerable:!0,get:function(){return l.CordovaPopupNavigator}});var f=r(45);Object.defineProperty(e,"CordovaIFrameNavigator",{enumerable:!0,get:function(){return f.CordovaIFrameNavigator}});var d=r(16);Object.defineProperty(e,"CheckSessionIFrame",{enumerable:!0,get:function(){return d.CheckSessionIFrame}});var p=r(17);Object.defineProperty(e,"TokenRevocationClient",{enumerable:!0,get:function(){return p.TokenRevocationClient}});var g=r(15);Object.defineProperty(e,"SessionMonitor",{enumerable:!0,get:function(){return g.SessionMonitor}});var v=r(1);Object.defineProperty(e,"Global",{enumerable:!0,get:function(){return v.Global}});var y=r(12);Object.defineProperty(e,"User",{enumerable:!0,get:function(){return y.User}})},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.ResponseValidator=void 0;var n=r(0),i=r(2),o=r(21),s=r(9),a=r(22);var u=["nonce","at_hash","iat","nbf","exp","aud","iss","c_hash"];e.ResponseValidator=function(){function t(e){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:i.MetadataService,s=arguments.length>2&&void 0!==arguments[2]?arguments[2]:o.UserInfoService,u=arguments.length>3&&void 0!==arguments[3]?arguments[3]:a.JoseUtil;if(function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),!e)throw n.Log.error("ResponseValidator.ctor: No settings passed to ResponseValidator"),new Error("settings");this._settings=e,this._metadataService=new r(this._settings),this._userInfoService=new s(this._settings),this._joseUtil=u}return t.prototype.validateSigninResponse=function(t,e){var r=this;return n.Log.debug("ResponseValidator.validateSigninResponse"),this._processSigninParams(t,e).then(function(e){return n.Log.debug("ResponseValidator.validateSigninResponse: state processed"),r._validateTokens(t,e).then(function(t){return n.Log.debug("ResponseValidator.validateSigninResponse: tokens validated"),r._processClaims(t).then(function(t){return n.Log.debug("ResponseValidator.validateSigninResponse: claims processed"),t})})})},t.prototype.validateSignoutResponse=function(t,e){return t.id!==e.state?(n.Log.error("ResponseValidator.validateSignoutResponse: State does not match"),Promise.reject(new Error("State does not match"))):(n.Log.debug("ResponseValidator.validateSignoutResponse: state validated"),e.state=t.data,e.error?(n.Log.warn("ResponseValidator.validateSignoutResponse: Response was error",e.error),Promise.reject(new s.ErrorResponse(e))):Promise.resolve(e))},t.prototype._processSigninParams=function(t,e){if(t.id!==e.state)return n.Log.error("ResponseValidator._processSigninParams: State does not match"),Promise.reject(new Error("State does not match"));if(!t.client_id)return n.Log.error("ResponseValidator._processSigninParams: No client_id on state"),Promise.reject(new Error("No client_id on state"));if(!t.authority)return n.Log.error("ResponseValidator._processSigninParams: No authority on state"),Promise.reject(new Error("No authority on state"));if(this._settings.authority){if(this._settings.authority&&this._settings.authority!==t.authority)return n.Log.error("ResponseValidator._processSigninParams: authority mismatch on settings vs. signin state"),Promise.reject(new Error("authority mismatch on settings vs. signin state"))}else this._settings.authority=t.authority;if(this._settings.client_id){if(this._settings.client_id&&this._settings.client_id!==t.client_id)return n.Log.error("ResponseValidator._processSigninParams: client_id mismatch on settings vs. signin state"),Promise.reject(new Error("client_id mismatch on settings vs. signin state"))}else this._settings.client_id=t.client_id;return n.Log.debug("ResponseValidator._processSigninParams: state validated"),e.state=t.data,e.error?(n.Log.warn("ResponseValidator._processSigninParams: Response was error",e.error),Promise.reject(new s.ErrorResponse(e))):t.nonce&&!e.id_token?(n.Log.error("ResponseValidator._processSigninParams: Expecting id_token in response"),Promise.reject(new Error("No id_token in response"))):!t.nonce&&e.id_token?(n.Log.error("ResponseValidator._processSigninParams: Not expecting id_token in response"),Promise.reject(new Error("Unexpected id_token in response"))):Promise.resolve(e)},t.prototype._processClaims=function(t){var e=this;if(t.isOpenIdConnect){if(n.Log.debug("ResponseValidator._processClaims: response is OIDC, processing claims"),t.profile=this._filterProtocolClaims(t.profile),this._settings.loadUserInfo&&t.access_token)return n.Log.debug("ResponseValidator._processClaims: loading user info"),this._userInfoService.getClaims(t.access_token).then(function(r){return n.Log.debug("ResponseValidator._processClaims: user info claims received from user info endpoint"),r.sub!==t.profile.sub?(n.Log.error("ResponseValidator._processClaims: sub from user info endpoint does not match sub in access_token"),Promise.reject(new Error("sub from user info endpoint does not match sub in access_token"))):(t.profile=e._mergeClaims(t.profile,r),n.Log.debug("ResponseValidator._processClaims: user info claims received, updated profile:",t.profile),t)});n.Log.debug("ResponseValidator._processClaims: not loading user info")}else n.Log.debug("ResponseValidator._processClaims: response is not OIDC, not processing claims");return Promise.resolve(t)},t.prototype._mergeClaims=function(t,e){var r=Object.assign({},t);for(var n in e){var i=e[n];Array.isArray(i)||(i=[i]);for(var o=0;o<i.length;o++){var s=i[o];r[n]?Array.isArray(r[n])?r[n].indexOf(s)<0&&r[n].push(s):r[n]!==s&&(r[n]=[r[n],s]):r[n]=s}}return r},t.prototype._filterProtocolClaims=function(t){n.Log.debug("ResponseValidator._filterProtocolClaims, incoming claims:",t);var e=Object.assign({},t);return this._settings._filterProtocolClaims?(u.forEach(function(t){delete e[t]}),n.Log.debug("ResponseValidator._filterProtocolClaims: protocol claims filtered",e)):n.Log.debug("ResponseValidator._filterProtocolClaims: protocol claims not filtered"),e},t.prototype._validateTokens=function(t,e){return e.id_token?e.access_token?(n.Log.debug("ResponseValidator._validateTokens: Validating id_token and access_token"),this._validateIdTokenAndAccessToken(t,e)):(n.Log.debug("ResponseValidator._validateTokens: Validating id_token"),this._validateIdToken(t,e)):(n.Log.debug("ResponseValidator._validateTokens: No id_token to validate"),Promise.resolve(e))},t.prototype._validateIdTokenAndAccessToken=function(t,e){var r=this;return this._validateIdToken(t,e).then(function(t){return r._validateAccessToken(t)})},t.prototype._validateIdToken=function(t,e){var r=this;if(!t.nonce)return n.Log.error("ResponseValidator._validateIdToken: No nonce on state"),Promise.reject(new Error("No nonce on state"));var i=this._joseUtil.parseJwt(e.id_token);if(!i||!i.header||!i.payload)return n.Log.error("ResponseValidator._validateIdToken: Failed to parse id_token",i),Promise.reject(new Error("Failed to parse id_token"));if(t.nonce!==i.payload.nonce)return n.Log.error("ResponseValidator._validateIdToken: Invalid nonce in id_token"),Promise.reject(new Error("Invalid nonce in id_token"));var o=i.header.kid;return this._metadataService.getIssuer().then(function(s){return n.Log.debug("ResponseValidator._validateIdToken: Received issuer"),r._metadataService.getSigningKeys().then(function(a){if(!a)return n.Log.error("ResponseValidator._validateIdToken: No signing keys from metadata"),Promise.reject(new Error("No signing keys from metadata"));n.Log.debug("ResponseValidator._validateIdToken: Received signing keys");var u=void 0;if(o)u=a.filter(function(t){return t.kid===o})[0];else{if((a=r._filterByAlg(a,i.header.alg)).length>1)return n.Log.error("ResponseValidator._validateIdToken: No kid found in id_token and more than one key found in metadata"),Promise.reject(new Error("No kid found in id_token and more than one key found in metadata"));u=a[0]}if(!u)return n.Log.error("ResponseValidator._validateIdToken: No key matching kid or alg found in signing keys"),Promise.reject(new Error("No key matching kid or alg found in signing keys"));var c=t.client_id,h=r._settings.clockSkew;return n.Log.debug("ResponseValidator._validateIdToken: Validaing JWT; using clock skew (in seconds) of: ",h),r._joseUtil.validateJwt(e.id_token,u,s,c,h).then(function(){return n.Log.debug("ResponseValidator._validateIdToken: JWT validation successful"),i.payload.sub?(e.profile=i.payload,e):(n.Log.error("ResponseValidator._validateIdToken: No sub present in id_token"),Promise.reject(new Error("No sub present in id_token")))})})})},t.prototype._filterByAlg=function(t,e){var r=null;if(e.startsWith("RS"))r="RSA";else if(e.startsWith("PS"))r="PS";else{if(!e.startsWith("ES"))return n.Log.debug("ResponseValidator._filterByAlg: alg not supported: ",e),[];r="EC"}return n.Log.debug("ResponseValidator._filterByAlg: Looking for keys that match kty: ",r),t=t.filter(function(t){return t.kty===r}),n.Log.debug("ResponseValidator._filterByAlg: Number of keys that match kty: ",r,t.length),t},t.prototype._validateAccessToken=function(t){if(!t.profile)return n.Log.error("ResponseValidator._validateAccessToken: No profile loaded from id_token"),Promise.reject(new Error("No profile loaded from id_token"));if(!t.profile.at_hash)return n.Log.error("ResponseValidator._validateAccessToken: No at_hash in id_token"),Promise.reject(new Error("No at_hash in id_token"));if(!t.id_token)return n.Log.error("ResponseValidator._validateAccessToken: No id_token"),Promise.reject(new Error("No id_token"));var e=this._joseUtil.parseJwt(t.id_token);if(!e||!e.header)return n.Log.error("ResponseValidator._validateAccessToken: Failed to parse id_token",e),Promise.reject(new Error("Failed to parse id_token"));var r=e.header.alg;if(!r||5!==r.length)return n.Log.error("ResponseValidator._validateAccessToken: Unsupported alg:",r),Promise.reject(new Error("Unsupported alg: "+r));var i=r.substr(2,3);if(!i)return n.Log.error("ResponseValidator._validateAccessToken: Unsupported alg:",r,i),Promise.reject(new Error("Unsupported alg: "+r));if(256!==(i=parseInt(i))&&384!==i&&512!==i)return n.Log.error("ResponseValidator._validateAccessToken: Unsupported alg:",r,i),Promise.reject(new Error("Unsupported alg: "+r));var o="sha"+i,s=this._joseUtil.hashString(t.access_token,o);if(!s)return n.Log.error("ResponseValidator._validateAccessToken: access_token hash failed:",o),Promise.reject(new Error("Failed to validate at_hash"));var a=s.substr(0,s.length/2),u=this._joseUtil.hexToBase64Url(a);return u!==t.profile.at_hash?(n.Log.error("ResponseValidator._validateAccessToken: Failed to validate at_hash",u,t.profile.at_hash),Promise.reject(new Error("Failed to validate at_hash"))):(n.Log.debug("ResponseValidator._validateAccessToken: success"),Promise.resolve(t))},t}()},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.UserInfoService=void 0;var n=r(8),i=r(2),o=r(0);e.UserInfoService=function(){function t(e){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:n.JsonService,s=arguments.length>2&&void 0!==arguments[2]?arguments[2]:i.MetadataService;if(function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),!e)throw o.Log.error("UserInfoService.ctor: No settings passed"),new Error("settings");this._settings=e,this._jsonService=new r,this._metadataService=new s(this._settings)}return t.prototype.getClaims=function(t){var e=this;return t?this._metadataService.getUserInfoEndpoint().then(function(r){return o.Log.debug("UserInfoService.getClaims: received userinfo url",r),e._jsonService.getJson(r,t).then(function(t){return o.Log.debug("UserInfoService.getClaims: claims received",t),t})}):(o.Log.error("UserInfoService.getClaims: No token passed"),Promise.reject(new Error("A token is required")))},t}()},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.JoseUtil=void 0;var n=r(23),i=r(0);var o=["RS256","RS384","RS512","PS256","PS384","PS512","ES256","ES384","ES512"];e.JoseUtil=function(){function t(){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t)}return t.parseJwt=function(t){i.Log.debug("JoseUtil.parseJwt");try{var e=n.jws.JWS.parse(t);return{header:e.headerObj,payload:e.payloadObj}}catch(t){i.Log.error(t)}},t.validateJwt=function(e,r,o,s,a,u){i.Log.debug("JoseUtil.validateJwt");try{if("RSA"===r.kty)if(r.e&&r.n)r=n.KEYUTIL.getKey(r);else{if(!r.x5c||!r.x5c.length)return i.Log.error("JoseUtil.validateJwt: RSA key missing key material",r),Promise.reject(new Error("RSA key missing key material"));var c=(0,n.b64tohex)(r.x5c[0]);r=n.X509.getPublicKeyFromCertHex(c)}else{if("EC"!==r.kty)return i.Log.error("JoseUtil.validateJwt: Unsupported key type",r&&r.kty),Promise.reject(new Error("Unsupported key type: "+r&&r.kty));if(!(r.crv&&r.x&&r.y))return i.Log.error("JoseUtil.validateJwt: EC key missing key material",r),Promise.reject(new Error("EC key missing key material"));r=n.KEYUTIL.getKey(r)}return t._validateJwt(e,r,o,s,a,u)}catch(t){return i.Log.error(t&&t.message||t),Promise.reject("JWT validation failed")}},t._validateJwt=function(e,r,s,a,u,c){u||(u=0),c||(c=parseInt(Date.now()/1e3));var h=t.parseJwt(e).payload;if(!h.iss)return i.Log.error("JoseUtil._validateJwt: issuer was not provided"),Promise.reject(new Error("issuer was not provided"));if(h.iss!==s)return i.Log.error("JoseUtil._validateJwt: Invalid issuer in token",h.iss),Promise.reject(new Error("Invalid issuer in token: "+h.iss));if(!h.aud)return i.Log.error("JoseUtil._validateJwt: aud was not provided"),Promise.reject(new Error("aud was not provided"));if(!(h.aud===a||Array.isArray(h.aud)&&h.aud.indexOf(a)>=0))return i.Log.error("JoseUtil._validateJwt: Invalid audience in token",h.aud),Promise.reject(new Error("Invalid audience in token: "+h.aud));var l=c+u,f=c-u;if(!h.iat)return i.Log.error("JoseUtil._validateJwt: iat was not provided"),Promise.reject(new Error("iat was not provided"));if(l<h.iat)return i.Log.error("JoseUtil._validateJwt: iat is in the future",h.iat),Promise.reject(new Error("iat is in the future: "+h.iat));if(h.nbf&&l<h.nbf)return i.Log.error("JoseUtil._validateJwt: nbf is in the future",h.nbf),Promise.reject(new Error("nbf is in the future: "+h.nbf));if(!h.exp)return i.Log.error("JoseUtil._validateJwt: exp was not provided"),Promise.reject(new Error("exp was not provided"));if(h.exp<f)return i.Log.error("JoseUtil._validateJwt: exp is in the past",h.exp),Promise.reject(new Error("exp is in the past:"+h.exp));try{if(!n.jws.JWS.verify(e,r,o))return i.Log.error("JoseUtil._validateJwt: signature validation failed"),Promise.reject(new Error("signature validation failed"))}catch(t){return i.Log.error(t&&t.message||t),Promise.reject(new Error("signature validation failed"))}return Promise.resolve()},t.hashString=function(t,e){try{return n.crypto.Util.hashString(t,e)}catch(t){i.Log.error(t)}},t.hexToBase64Url=function(t){try{return(0,n.hextob64u)(t)}catch(t){i.Log.error(t)}},t}()},function(t,e,r){"use strict";(function(t){var r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},n={userAgent:!1},i={};
/*!
Copyright (c) 2011, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 2.9.0
*/
if(void 0===o)var o={};o.lang={extend:function(t,e,r){if(!e||!t)throw new Error("YAHOO.lang.extend failed, please check that all dependencies are included.");var i=function(){};if(i.prototype=e.prototype,t.prototype=new i,t.prototype.constructor=t,t.superclass=e.prototype,e.prototype.constructor==Object.prototype.constructor&&(e.prototype.constructor=e),r){var o;for(o in r)t.prototype[o]=r[o];var s=function(){},a=["toString","valueOf"];try{/MSIE/.test(n.userAgent)&&(s=function(t,e){for(o=0;o<a.length;o+=1){var r=a[o],n=e[r];"function"==typeof n&&n!=Object.prototype[r]&&(t[r]=n)}})}catch(t){}s(t.prototype,r)}}};
/*! CryptoJS v3.1.2 core-fix.js
 * code.google.com/p/crypto-js
 * (c) 2009-2013 by Jeff Mott. All rights reserved.
 * code.google.com/p/crypto-js/wiki/License
 * THIS IS FIX of 'core.js' to fix Hmac issue.
 * https://code.google.com/p/crypto-js/issues/detail?id=84
 * https://crypto-js.googlecode.com/svn-history/r667/branches/3.x/src/core.js
 */
var s,a,u,c,h,l,f,d,p,g,v,y=y||(s=Math,u=(a={}).lib={},c=u.Base=function(){function t(){}return{extend:function(e){t.prototype=this;var r=new t;return e&&r.mixIn(e),r.hasOwnProperty("init")||(r.init=function(){r.$super.init.apply(this,arguments)}),r.init.prototype=r,r.$super=this,r},create:function(){var t=this.extend();return t.init.apply(t,arguments),t},init:function(){},mixIn:function(t){for(var e in t)t.hasOwnProperty(e)&&(this[e]=t[e]);t.hasOwnProperty("toString")&&(this.toString=t.toString)},clone:function(){return this.init.prototype.extend(this)}}}(),h=u.WordArray=c.extend({init:function(t,e){t=this.words=t||[],this.sigBytes=void 0!=e?e:4*t.length},toString:function(t){return(t||f).stringify(this)},concat:function(t){var e=this.words,r=t.words,n=this.sigBytes,i=t.sigBytes;if(this.clamp(),n%4)for(var o=0;o<i;o++){var s=r[o>>>2]>>>24-o%4*8&255;e[n+o>>>2]|=s<<24-(n+o)%4*8}else for(o=0;o<i;o+=4)e[n+o>>>2]=r[o>>>2];return this.sigBytes+=i,this},clamp:function(){var t=this.words,e=this.sigBytes;t[e>>>2]&=4294967295<<32-e%4*8,t.length=s.ceil(e/4)},clone:function(){var t=c.clone.call(this);return t.words=this.words.slice(0),t},random:function(t){for(var e=[],r=0;r<t;r+=4)e.push(4294967296*s.random()|0);return new h.init(e,t)}}),l=a.enc={},f=l.Hex={stringify:function(t){for(var e=t.words,r=t.sigBytes,n=[],i=0;i<r;i++){var o=e[i>>>2]>>>24-i%4*8&255;n.push((o>>>4).toString(16)),n.push((15&o).toString(16))}return n.join("")},parse:function(t){for(var e=t.length,r=[],n=0;n<e;n+=2)r[n>>>3]|=parseInt(t.substr(n,2),16)<<24-n%8*4;return new h.init(r,e/2)}},d=l.Latin1={stringify:function(t){for(var e=t.words,r=t.sigBytes,n=[],i=0;i<r;i++){var o=e[i>>>2]>>>24-i%4*8&255;n.push(String.fromCharCode(o))}return n.join("")},parse:function(t){for(var e=t.length,r=[],n=0;n<e;n++)r[n>>>2]|=(255&t.charCodeAt(n))<<24-n%4*8;return new h.init(r,e)}},p=l.Utf8={stringify:function(t){try{return decodeURIComponent(escape(d.stringify(t)))}catch(t){throw new Error("Malformed UTF-8 data")}},parse:function(t){return d.parse(unescape(encodeURIComponent(t)))}},g=u.BufferedBlockAlgorithm=c.extend({reset:function(){this._data=new h.init,this._nDataBytes=0},_append:function(t){"string"==typeof t&&(t=p.parse(t)),this._data.concat(t),this._nDataBytes+=t.sigBytes},_process:function(t){var e=this._data,r=e.words,n=e.sigBytes,i=this.blockSize,o=n/(4*i),a=(o=t?s.ceil(o):s.max((0|o)-this._minBufferSize,0))*i,u=s.min(4*a,n);if(a){for(var c=0;c<a;c+=i)this._doProcessBlock(r,c);var l=r.splice(0,a);e.sigBytes-=u}return new h.init(l,u)},clone:function(){var t=c.clone.call(this);return t._data=this._data.clone(),t},_minBufferSize:0}),u.Hasher=g.extend({cfg:c.extend(),init:function(t){this.cfg=this.cfg.extend(t),this.reset()},reset:function(){g.reset.call(this),this._doReset()},update:function(t){return this._append(t),this._process(),this},finalize:function(t){return t&&this._append(t),this._doFinalize()},blockSize:16,_createHelper:function(t){return function(e,r){return new t.init(r).finalize(e)}},_createHmacHelper:function(t){return function(e,r){return new v.HMAC.init(t,r).finalize(e)}}}),v=a.algo={},a);!function(t){var e,r=(e=y).lib,n=r.Base,i=r.WordArray;(e=e.x64={}).Word=n.extend({init:function(t,e){this.high=t,this.low=e}}),e.WordArray=n.extend({init:function(t,e){t=this.words=t||[],this.sigBytes=void 0!=e?e:8*t.length},toX32:function(){for(var t=this.words,e=t.length,r=[],n=0;n<e;n++){var o=t[n];r.push(o.high),r.push(o.low)}return i.create(r,this.sigBytes)},clone:function(){for(var t=n.clone.call(this),e=t.words=this.words.slice(0),r=e.length,i=0;i<r;i++)e[i]=e[i].clone();return t}})}(),function(){var t=y,e=t.lib.WordArray;t.enc.Base64={stringify:function(t){var e=t.words,r=t.sigBytes,n=this._map;t.clamp(),t=[];for(var i=0;i<r;i+=3)for(var o=(e[i>>>2]>>>24-i%4*8&255)<<16|(e[i+1>>>2]>>>24-(i+1)%4*8&255)<<8|e[i+2>>>2]>>>24-(i+2)%4*8&255,s=0;4>s&&i+.75*s<r;s++)t.push(n.charAt(o>>>6*(3-s)&63));if(e=n.charAt(64))for(;t.length%4;)t.push(e);return t.join("")},parse:function(t){var r=t.length,n=this._map;(i=n.charAt(64))&&(-1!=(i=t.indexOf(i))&&(r=i));for(var i=[],o=0,s=0;s<r;s++)if(s%4){var a=n.indexOf(t.charAt(s-1))<<s%4*2,u=n.indexOf(t.charAt(s))>>>6-s%4*2;i[o>>>2]|=(a|u)<<24-o%4*8,o++}return e.create(i,o)},_map:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="}}(),function(t){for(var e=y,r=(i=e.lib).WordArray,n=i.Hasher,i=e.algo,o=[],s=[],a=function(t){return 4294967296*(t-(0|t))|0},u=2,c=0;64>c;){var h;t:{h=u;for(var l=t.sqrt(h),f=2;f<=l;f++)if(!(h%f)){h=!1;break t}h=!0}h&&(8>c&&(o[c]=a(t.pow(u,.5))),s[c]=a(t.pow(u,1/3)),c++),u++}var d=[];i=i.SHA256=n.extend({_doReset:function(){this._hash=new r.init(o.slice(0))},_doProcessBlock:function(t,e){for(var r=this._hash.words,n=r[0],i=r[1],o=r[2],a=r[3],u=r[4],c=r[5],h=r[6],l=r[7],f=0;64>f;f++){if(16>f)d[f]=0|t[e+f];else{var p=d[f-15],g=d[f-2];d[f]=((p<<25|p>>>7)^(p<<14|p>>>18)^p>>>3)+d[f-7]+((g<<15|g>>>17)^(g<<13|g>>>19)^g>>>10)+d[f-16]}p=l+((u<<26|u>>>6)^(u<<21|u>>>11)^(u<<7|u>>>25))+(u&c^~u&h)+s[f]+d[f],g=((n<<30|n>>>2)^(n<<19|n>>>13)^(n<<10|n>>>22))+(n&i^n&o^i&o),l=h,h=c,c=u,u=a+p|0,a=o,o=i,i=n,n=p+g|0}r[0]=r[0]+n|0,r[1]=r[1]+i|0,r[2]=r[2]+o|0,r[3]=r[3]+a|0,r[4]=r[4]+u|0,r[5]=r[5]+c|0,r[6]=r[6]+h|0,r[7]=r[7]+l|0},_doFinalize:function(){var e=this._data,r=e.words,n=8*this._nDataBytes,i=8*e.sigBytes;return r[i>>>5]|=128<<24-i%32,r[14+(i+64>>>9<<4)]=t.floor(n/4294967296),r[15+(i+64>>>9<<4)]=n,e.sigBytes=4*r.length,this._process(),this._hash},clone:function(){var t=n.clone.call(this);return t._hash=this._hash.clone(),t}});e.SHA256=n._createHelper(i),e.HmacSHA256=n._createHmacHelper(i)}(Math),function(){function t(){return n.create.apply(n,arguments)}for(var e=y,r=e.lib.Hasher,n=(o=e.x64).Word,i=o.WordArray,o=e.algo,s=[t(1116352408,3609767458),t(1899447441,602891725),t(3049323471,3964484399),t(3921009573,2173295548),t(961987163,4081628472),t(1508970993,3053834265),t(2453635748,2937671579),t(2870763221,3664609560),t(3624381080,2734883394),t(310598401,1164996542),t(607225278,1323610764),t(1426881987,3590304994),t(1925078388,4068182383),t(2162078206,991336113),t(2614888103,633803317),t(3248222580,3479774868),t(3835390401,2666613458),t(4022224774,944711139),t(264347078,2341262773),t(604807628,2007800933),t(770255983,1495990901),t(1249150122,1856431235),t(1555081692,3175218132),t(1996064986,2198950837),t(2554220882,3999719339),t(2821834349,766784016),t(2952996808,2566594879),t(3210313671,3203337956),t(3336571891,1034457026),t(3584528711,2466948901),t(113926993,3758326383),t(338241895,168717936),t(666307205,1188179964),t(773529912,1546045734),t(1294757372,1522805485),t(1396182291,2643833823),t(1695183700,2343527390),t(1986661051,1014477480),t(2177026350,1206759142),t(2456956037,344077627),t(2730485921,1290863460),t(2820302411,3158454273),t(3259730800,3505952657),t(3345764771,106217008),t(3516065817,3606008344),t(3600352804,1432725776),t(4094571909,1467031594),t(275423344,851169720),t(430227734,3100823752),t(506948616,1363258195),t(659060556,3750685593),t(883997877,3785050280),t(958139571,3318307427),t(1322822218,3812723403),t(1537002063,2003034995),t(1747873779,3602036899),t(1955562222,1575990012),t(2024104815,1125592928),t(2227730452,2716904306),t(2361852424,442776044),t(2428436474,593698344),t(2756734187,3733110249),t(3204031479,2999351573),t(3329325298,3815920427),t(3391569614,3928383900),t(3515267271,566280711),t(3940187606,3454069534),t(4118630271,4000239992),t(116418474,1914138554),t(174292421,2731055270),t(289380356,3203993006),t(460393269,320620315),t(685471733,587496836),t(852142971,1086792851),t(1017036298,365543100),t(1126000580,2618297676),t(1288033470,3409855158),t(1501505948,4234509866),t(1607167915,987167468),t(1816402316,1246189591)],a=[],u=0;80>u;u++)a[u]=t();o=o.SHA512=r.extend({_doReset:function(){this._hash=new i.init([new n.init(1779033703,4089235720),new n.init(3144134277,2227873595),new n.init(1013904242,4271175723),new n.init(2773480762,1595750129),new n.init(1359893119,2917565137),new n.init(2600822924,725511199),new n.init(528734635,4215389547),new n.init(1541459225,327033209)])},_doProcessBlock:function(t,e){for(var r=(l=this._hash.words)[0],n=l[1],i=l[2],o=l[3],u=l[4],c=l[5],h=l[6],l=l[7],f=r.high,d=r.low,p=n.high,g=n.low,v=i.high,y=i.low,m=o.high,S=o.low,b=u.high,w=u.low,F=c.high,_=c.low,E=h.high,x=h.low,A=l.high,P=l.low,C=f,R=d,T=p,k=g,D=v,I=y,N=m,B=S,j=b,L=w,O=F,H=_,U=E,M=x,V=A,K=P,q=0;80>q;q++){var W=a[q];if(16>q)var J=W.high=0|t[e+2*q],Y=W.low=0|t[e+2*q+1];else{J=((Y=(J=a[q-15]).high)>>>1|(z=J.low)<<31)^(Y>>>8|z<<24)^Y>>>7;var z=(z>>>1|Y<<31)^(z>>>8|Y<<24)^(z>>>7|Y<<25),G=((Y=(G=a[q-2]).high)>>>19|(X=G.low)<<13)^(Y<<3|X>>>29)^Y>>>6,X=(X>>>19|Y<<13)^(X<<3|Y>>>29)^(X>>>6|Y<<26),$=(Y=a[q-7]).high,Z=(Q=a[q-16]).high,Q=Q.low;J=(J=(J=J+$+((Y=z+Y.low)>>>0<z>>>0?1:0))+G+((Y=Y+X)>>>0<X>>>0?1:0))+Z+((Y=Y+Q)>>>0<Q>>>0?1:0);W.high=J,W.low=Y}$=j&O^~j&U,Q=L&H^~L&M,W=C&T^C&D^T&D;var tt=R&k^R&I^k&I,et=(z=(C>>>28|R<<4)^(C<<30|R>>>2)^(C<<25|R>>>7),G=(R>>>28|C<<4)^(R<<30|C>>>2)^(R<<25|C>>>7),(X=s[q]).high),rt=X.low;Z=(Z=(Z=(Z=V+((j>>>14|L<<18)^(j>>>18|L<<14)^(j<<23|L>>>9))+((X=K+((L>>>14|j<<18)^(L>>>18|j<<14)^(L<<23|j>>>9)))>>>0<K>>>0?1:0))+$+((X=X+Q)>>>0<Q>>>0?1:0))+et+((X=X+rt)>>>0<rt>>>0?1:0))+J+((X=X+Y)>>>0<Y>>>0?1:0),W=z+W+((Y=G+tt)>>>0<G>>>0?1:0),V=U,K=M,U=O,M=H,O=j,H=L,j=N+Z+((L=B+X|0)>>>0<B>>>0?1:0)|0,N=D,B=I,D=T,I=k,T=C,k=R,C=Z+W+((R=X+Y|0)>>>0<X>>>0?1:0)|0}d=r.low=d+R,r.high=f+C+(d>>>0<R>>>0?1:0),g=n.low=g+k,n.high=p+T+(g>>>0<k>>>0?1:0),y=i.low=y+I,i.high=v+D+(y>>>0<I>>>0?1:0),S=o.low=S+B,o.high=m+N+(S>>>0<B>>>0?1:0),w=u.low=w+L,u.high=b+j+(w>>>0<L>>>0?1:0),_=c.low=_+H,c.high=F+O+(_>>>0<H>>>0?1:0),x=h.low=x+M,h.high=E+U+(x>>>0<M>>>0?1:0),P=l.low=P+K,l.high=A+V+(P>>>0<K>>>0?1:0)},_doFinalize:function(){var t=this._data,e=t.words,r=8*this._nDataBytes,n=8*t.sigBytes;return e[n>>>5]|=128<<24-n%32,e[30+(n+128>>>10<<5)]=Math.floor(r/4294967296),e[31+(n+128>>>10<<5)]=r,t.sigBytes=4*e.length,this._process(),this._hash.toX32()},clone:function(){var t=r.clone.call(this);return t._hash=this._hash.clone(),t},blockSize:32}),e.SHA512=r._createHelper(o),e.HmacSHA512=r._createHmacHelper(o)}(),function(){var t=y,e=(i=t.x64).Word,r=i.WordArray,n=(i=t.algo).SHA512,i=i.SHA384=n.extend({_doReset:function(){this._hash=new r.init([new e.init(3418070365,3238371032),new e.init(1654270250,914150663),new e.init(2438529370,812702999),new e.init(355462360,4144912697),new e.init(1731405415,4290775857),new e.init(2394180231,1750603025),new e.init(3675008525,1694076839),new e.init(1203062813,3204075428)])},_doFinalize:function(){var t=n._doFinalize.call(this);return t.sigBytes-=16,t}});t.SHA384=n._createHelper(i),t.HmacSHA384=n._createHmacHelper(i)}();
/*! (c) Tom Wu | http://www-cs-students.stanford.edu/~tjw/jsbn/
 */
var m,S="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",b="=";function w(t){var e,r,n="";for(e=0;e+3<=t.length;e+=3)r=parseInt(t.substring(e,e+3),16),n+=S.charAt(r>>6)+S.charAt(63&r);if(e+1==t.length?(r=parseInt(t.substring(e,e+1),16),n+=S.charAt(r<<2)):e+2==t.length&&(r=parseInt(t.substring(e,e+2),16),n+=S.charAt(r>>2)+S.charAt((3&r)<<4)),b)for(;(3&n.length)>0;)n+=b;return n}function F(t){var e,r,n,i="",o=0;for(e=0;e<t.length&&t.charAt(e)!=b;++e)(n=S.indexOf(t.charAt(e)))<0||(0==o?(i+=T(n>>2),r=3&n,o=1):1==o?(i+=T(r<<2|n>>4),r=15&n,o=2):2==o?(i+=T(r),i+=T(n>>2),r=3&n,o=3):(i+=T(r<<2|n>>4),i+=T(15&n),o=0));return 1==o&&(i+=T(r<<2)),i}function _(t){var e,r=F(t),n=new Array;for(e=0;2*e<r.length;++e)n[e]=parseInt(r.substring(2*e,2*e+2),16);return n}function E(t,e,r){null!=t&&("number"==typeof t?this.fromNumber(t,e,r):null==e&&"string"!=typeof t?this.fromString(t,256):this.fromString(t,e))}function x(){return new E(null)}"Microsoft Internet Explorer"==n.appName?(E.prototype.am=function(t,e,r,n,i,o){for(var s=32767&e,a=e>>15;--o>=0;){var u=32767&this[t],c=this[t++]>>15,h=a*u+c*s;i=((u=s*u+((32767&h)<<15)+r[n]+(1073741823&i))>>>30)+(h>>>15)+a*c+(i>>>30),r[n++]=1073741823&u}return i},m=30):"Netscape"!=n.appName?(E.prototype.am=function(t,e,r,n,i,o){for(;--o>=0;){var s=e*this[t++]+r[n]+i;i=Math.floor(s/67108864),r[n++]=67108863&s}return i},m=26):(E.prototype.am=function(t,e,r,n,i,o){for(var s=16383&e,a=e>>14;--o>=0;){var u=16383&this[t],c=this[t++]>>14,h=a*u+c*s;i=((u=s*u+((16383&h)<<14)+r[n]+i)>>28)+(h>>14)+a*c,r[n++]=268435455&u}return i},m=28),E.prototype.DB=m,E.prototype.DM=(1<<m)-1,E.prototype.DV=1<<m;E.prototype.FV=Math.pow(2,52),E.prototype.F1=52-m,E.prototype.F2=2*m-52;var A,P,C="0123456789abcdefghijklmnopqrstuvwxyz",R=new Array;for(A="0".charCodeAt(0),P=0;P<=9;++P)R[A++]=P;for(A="a".charCodeAt(0),P=10;P<36;++P)R[A++]=P;for(A="A".charCodeAt(0),P=10;P<36;++P)R[A++]=P;function T(t){return C.charAt(t)}function k(t,e){var r=R[t.charCodeAt(e)];return null==r?-1:r}function D(t){var e=x();return e.fromInt(t),e}function I(t){var e,r=1;return 0!=(e=t>>>16)&&(t=e,r+=16),0!=(e=t>>8)&&(t=e,r+=8),0!=(e=t>>4)&&(t=e,r+=4),0!=(e=t>>2)&&(t=e,r+=2),0!=(e=t>>1)&&(t=e,r+=1),r}function N(t){this.m=t}function B(t){this.m=t,this.mp=t.invDigit(),this.mpl=32767&this.mp,this.mph=this.mp>>15,this.um=(1<<t.DB-15)-1,this.mt2=2*t.t}function j(t,e){return t&e}function L(t,e){return t|e}function O(t,e){return t^e}function H(t,e){return t&~e}function U(t){if(0==t)return-1;var e=0;return 0==(65535&t)&&(t>>=16,e+=16),0==(255&t)&&(t>>=8,e+=8),0==(15&t)&&(t>>=4,e+=4),0==(3&t)&&(t>>=2,e+=2),0==(1&t)&&++e,e}function M(t){for(var e=0;0!=t;)t&=t-1,++e;return e}function V(){}function K(t){return t}function q(t){this.r2=x(),this.q3=x(),E.ONE.dlShiftTo(2*t.t,this.r2),this.mu=this.r2.divide(t),this.m=t}N.prototype.convert=function(t){return t.s<0||t.compareTo(this.m)>=0?t.mod(this.m):t},N.prototype.revert=function(t){return t},N.prototype.reduce=function(t){t.divRemTo(this.m,null,t)},N.prototype.mulTo=function(t,e,r){t.multiplyTo(e,r),this.reduce(r)},N.prototype.sqrTo=function(t,e){t.squareTo(e),this.reduce(e)},B.prototype.convert=function(t){var e=x();return t.abs().dlShiftTo(this.m.t,e),e.divRemTo(this.m,null,e),t.s<0&&e.compareTo(E.ZERO)>0&&this.m.subTo(e,e),e},B.prototype.revert=function(t){var e=x();return t.copyTo(e),this.reduce(e),e},B.prototype.reduce=function(t){for(;t.t<=this.mt2;)t[t.t++]=0;for(var e=0;e<this.m.t;++e){var r=32767&t[e],n=r*this.mpl+((r*this.mph+(t[e]>>15)*this.mpl&this.um)<<15)&t.DM;for(t[r=e+this.m.t]+=this.m.am(0,n,t,e,0,this.m.t);t[r]>=t.DV;)t[r]-=t.DV,t[++r]++}t.clamp(),t.drShiftTo(this.m.t,t),t.compareTo(this.m)>=0&&t.subTo(this.m,t)},B.prototype.mulTo=function(t,e,r){t.multiplyTo(e,r),this.reduce(r)},B.prototype.sqrTo=function(t,e){t.squareTo(e),this.reduce(e)},E.prototype.copyTo=function(t){for(var e=this.t-1;e>=0;--e)t[e]=this[e];t.t=this.t,t.s=this.s},E.prototype.fromInt=function(t){this.t=1,this.s=t<0?-1:0,t>0?this[0]=t:t<-1?this[0]=t+this.DV:this.t=0},E.prototype.fromString=function(t,e){var r;if(16==e)r=4;else if(8==e)r=3;else if(256==e)r=8;else if(2==e)r=1;else if(32==e)r=5;else{if(4!=e)return void this.fromRadix(t,e);r=2}this.t=0,this.s=0;for(var n=t.length,i=!1,o=0;--n>=0;){var s=8==r?255&t[n]:k(t,n);s<0?"-"==t.charAt(n)&&(i=!0):(i=!1,0==o?this[this.t++]=s:o+r>this.DB?(this[this.t-1]|=(s&(1<<this.DB-o)-1)<<o,this[this.t++]=s>>this.DB-o):this[this.t-1]|=s<<o,(o+=r)>=this.DB&&(o-=this.DB))}8==r&&0!=(128&t[0])&&(this.s=-1,o>0&&(this[this.t-1]|=(1<<this.DB-o)-1<<o)),this.clamp(),i&&E.ZERO.subTo(this,this)},E.prototype.clamp=function(){for(var t=this.s&this.DM;this.t>0&&this[this.t-1]==t;)--this.t},E.prototype.dlShiftTo=function(t,e){var r;for(r=this.t-1;r>=0;--r)e[r+t]=this[r];for(r=t-1;r>=0;--r)e[r]=0;e.t=this.t+t,e.s=this.s},E.prototype.drShiftTo=function(t,e){for(var r=t;r<this.t;++r)e[r-t]=this[r];e.t=Math.max(this.t-t,0),e.s=this.s},E.prototype.lShiftTo=function(t,e){var r,n=t%this.DB,i=this.DB-n,o=(1<<i)-1,s=Math.floor(t/this.DB),a=this.s<<n&this.DM;for(r=this.t-1;r>=0;--r)e[r+s+1]=this[r]>>i|a,a=(this[r]&o)<<n;for(r=s-1;r>=0;--r)e[r]=0;e[s]=a,e.t=this.t+s+1,e.s=this.s,e.clamp()},E.prototype.rShiftTo=function(t,e){e.s=this.s;var r=Math.floor(t/this.DB);if(r>=this.t)e.t=0;else{var n=t%this.DB,i=this.DB-n,o=(1<<n)-1;e[0]=this[r]>>n;for(var s=r+1;s<this.t;++s)e[s-r-1]|=(this[s]&o)<<i,e[s-r]=this[s]>>n;n>0&&(e[this.t-r-1]|=(this.s&o)<<i),e.t=this.t-r,e.clamp()}},E.prototype.subTo=function(t,e){for(var r=0,n=0,i=Math.min(t.t,this.t);r<i;)n+=this[r]-t[r],e[r++]=n&this.DM,n>>=this.DB;if(t.t<this.t){for(n-=t.s;r<this.t;)n+=this[r],e[r++]=n&this.DM,n>>=this.DB;n+=this.s}else{for(n+=this.s;r<t.t;)n-=t[r],e[r++]=n&this.DM,n>>=this.DB;n-=t.s}e.s=n<0?-1:0,n<-1?e[r++]=this.DV+n:n>0&&(e[r++]=n),e.t=r,e.clamp()},E.prototype.multiplyTo=function(t,e){var r=this.abs(),n=t.abs(),i=r.t;for(e.t=i+n.t;--i>=0;)e[i]=0;for(i=0;i<n.t;++i)e[i+r.t]=r.am(0,n[i],e,i,0,r.t);e.s=0,e.clamp(),this.s!=t.s&&E.ZERO.subTo(e,e)},E.prototype.squareTo=function(t){for(var e=this.abs(),r=t.t=2*e.t;--r>=0;)t[r]=0;for(r=0;r<e.t-1;++r){var n=e.am(r,e[r],t,2*r,0,1);(t[r+e.t]+=e.am(r+1,2*e[r],t,2*r+1,n,e.t-r-1))>=e.DV&&(t[r+e.t]-=e.DV,t[r+e.t+1]=1)}t.t>0&&(t[t.t-1]+=e.am(r,e[r],t,2*r,0,1)),t.s=0,t.clamp()},E.prototype.divRemTo=function(t,e,r){var n=t.abs();if(!(n.t<=0)){var i=this.abs();if(i.t<n.t)return null!=e&&e.fromInt(0),void(null!=r&&this.copyTo(r));null==r&&(r=x());var o=x(),s=this.s,a=t.s,u=this.DB-I(n[n.t-1]);u>0?(n.lShiftTo(u,o),i.lShiftTo(u,r)):(n.copyTo(o),i.copyTo(r));var c=o.t,h=o[c-1];if(0!=h){var l=h*(1<<this.F1)+(c>1?o[c-2]>>this.F2:0),f=this.FV/l,d=(1<<this.F1)/l,p=1<<this.F2,g=r.t,v=g-c,y=null==e?x():e;for(o.dlShiftTo(v,y),r.compareTo(y)>=0&&(r[r.t++]=1,r.subTo(y,r)),E.ONE.dlShiftTo(c,y),y.subTo(o,o);o.t<c;)o[o.t++]=0;for(;--v>=0;){var m=r[--g]==h?this.DM:Math.floor(r[g]*f+(r[g-1]+p)*d);if((r[g]+=o.am(0,m,r,v,0,c))<m)for(o.dlShiftTo(v,y),r.subTo(y,r);r[g]<--m;)r.subTo(y,r)}null!=e&&(r.drShiftTo(c,e),s!=a&&E.ZERO.subTo(e,e)),r.t=c,r.clamp(),u>0&&r.rShiftTo(u,r),s<0&&E.ZERO.subTo(r,r)}}},E.prototype.invDigit=function(){if(this.t<1)return 0;var t=this[0];if(0==(1&t))return 0;var e=3&t;return(e=(e=(e=(e=e*(2-(15&t)*e)&15)*(2-(255&t)*e)&255)*(2-((65535&t)*e&65535))&65535)*(2-t*e%this.DV)%this.DV)>0?this.DV-e:-e},E.prototype.isEven=function(){return 0==(this.t>0?1&this[0]:this.s)},E.prototype.exp=function(t,e){if(t>4294967295||t<1)return E.ONE;var r=x(),n=x(),i=e.convert(this),o=I(t)-1;for(i.copyTo(r);--o>=0;)if(e.sqrTo(r,n),(t&1<<o)>0)e.mulTo(n,i,r);else{var s=r;r=n,n=s}return e.revert(r)},E.prototype.toString=function(t){if(this.s<0)return"-"+this.negate().toString(t);var e;if(16==t)e=4;else if(8==t)e=3;else if(2==t)e=1;else if(32==t)e=5;else{if(4!=t)return this.toRadix(t);e=2}var r,n=(1<<e)-1,i=!1,o="",s=this.t,a=this.DB-s*this.DB%e;if(s-- >0)for(a<this.DB&&(r=this[s]>>a)>0&&(i=!0,o=T(r));s>=0;)a<e?(r=(this[s]&(1<<a)-1)<<e-a,r|=this[--s]>>(a+=this.DB-e)):(r=this[s]>>(a-=e)&n,a<=0&&(a+=this.DB,--s)),r>0&&(i=!0),i&&(o+=T(r));return i?o:"0"},E.prototype.negate=function(){var t=x();return E.ZERO.subTo(this,t),t},E.prototype.abs=function(){return this.s<0?this.negate():this},E.prototype.compareTo=function(t){var e=this.s-t.s;if(0!=e)return e;var r=this.t;if(0!=(e=r-t.t))return this.s<0?-e:e;for(;--r>=0;)if(0!=(e=this[r]-t[r]))return e;return 0},E.prototype.bitLength=function(){return this.t<=0?0:this.DB*(this.t-1)+I(this[this.t-1]^this.s&this.DM)},E.prototype.mod=function(t){var e=x();return this.abs().divRemTo(t,null,e),this.s<0&&e.compareTo(E.ZERO)>0&&t.subTo(e,e),e},E.prototype.modPowInt=function(t,e){var r;return r=t<256||e.isEven()?new N(e):new B(e),this.exp(t,r)},E.ZERO=D(0),E.ONE=D(1),V.prototype.convert=K,V.prototype.revert=K,V.prototype.mulTo=function(t,e,r){t.multiplyTo(e,r)},V.prototype.sqrTo=function(t,e){t.squareTo(e)},q.prototype.convert=function(t){if(t.s<0||t.t>2*this.m.t)return t.mod(this.m);if(t.compareTo(this.m)<0)return t;var e=x();return t.copyTo(e),this.reduce(e),e},q.prototype.revert=function(t){return t},q.prototype.reduce=function(t){for(t.drShiftTo(this.m.t-1,this.r2),t.t>this.m.t+1&&(t.t=this.m.t+1,t.clamp()),this.mu.multiplyUpperTo(this.r2,this.m.t+1,this.q3),this.m.multiplyLowerTo(this.q3,this.m.t+1,this.r2);t.compareTo(this.r2)<0;)t.dAddOffset(1,this.m.t+1);for(t.subTo(this.r2,t);t.compareTo(this.m)>=0;)t.subTo(this.m,t)},q.prototype.mulTo=function(t,e,r){t.multiplyTo(e,r),this.reduce(r)},q.prototype.sqrTo=function(t,e){t.squareTo(e),this.reduce(e)};var W=[2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97,101,103,107,109,113,127,131,137,139,149,151,157,163,167,173,179,181,191,193,197,199,211,223,227,229,233,239,241,251,257,263,269,271,277,281,283,293,307,311,313,317,331,337,347,349,353,359,367,373,379,383,389,397,401,409,419,421,431,433,439,443,449,457,461,463,467,479,487,491,499,503,509,521,523,541,547,557,563,569,571,577,587,593,599,601,607,613,617,619,631,641,643,647,653,659,661,673,677,683,691,701,709,719,727,733,739,743,751,757,761,769,773,787,797,809,811,821,823,827,829,839,853,857,859,863,877,881,883,887,907,911,919,929,937,941,947,953,967,971,977,983,991,997],J=(1<<26)/W[W.length-1];
/*! (c) Tom Wu | http://www-cs-students.stanford.edu/~tjw/jsbn/
 */
function Y(){this.i=0,this.j=0,this.S=new Array}E.prototype.chunkSize=function(t){return Math.floor(Math.LN2*this.DB/Math.log(t))},E.prototype.toRadix=function(t){if(null==t&&(t=10),0==this.signum()||t<2||t>36)return"0";var e=this.chunkSize(t),r=Math.pow(t,e),n=D(r),i=x(),o=x(),s="";for(this.divRemTo(n,i,o);i.signum()>0;)s=(r+o.intValue()).toString(t).substr(1)+s,i.divRemTo(n,i,o);return o.intValue().toString(t)+s},E.prototype.fromRadix=function(t,e){this.fromInt(0),null==e&&(e=10);for(var r=this.chunkSize(e),n=Math.pow(e,r),i=!1,o=0,s=0,a=0;a<t.length;++a){var u=k(t,a);u<0?"-"==t.charAt(a)&&0==this.signum()&&(i=!0):(s=e*s+u,++o>=r&&(this.dMultiply(n),this.dAddOffset(s,0),o=0,s=0))}o>0&&(this.dMultiply(Math.pow(e,o)),this.dAddOffset(s,0)),i&&E.ZERO.subTo(this,this)},E.prototype.fromNumber=function(t,e,r){if("number"==typeof e)if(t<2)this.fromInt(1);else for(this.fromNumber(t,r),this.testBit(t-1)||this.bitwiseTo(E.ONE.shiftLeft(t-1),L,this),this.isEven()&&this.dAddOffset(1,0);!this.isProbablePrime(e);)this.dAddOffset(2,0),this.bitLength()>t&&this.subTo(E.ONE.shiftLeft(t-1),this);else{var n=new Array,i=7&t;n.length=1+(t>>3),e.nextBytes(n),i>0?n[0]&=(1<<i)-1:n[0]=0,this.fromString(n,256)}},E.prototype.bitwiseTo=function(t,e,r){var n,i,o=Math.min(t.t,this.t);for(n=0;n<o;++n)r[n]=e(this[n],t[n]);if(t.t<this.t){for(i=t.s&this.DM,n=o;n<this.t;++n)r[n]=e(this[n],i);r.t=this.t}else{for(i=this.s&this.DM,n=o;n<t.t;++n)r[n]=e(i,t[n]);r.t=t.t}r.s=e(this.s,t.s),r.clamp()},E.prototype.changeBit=function(t,e){var r=E.ONE.shiftLeft(t);return this.bitwiseTo(r,e,r),r},E.prototype.addTo=function(t,e){for(var r=0,n=0,i=Math.min(t.t,this.t);r<i;)n+=this[r]+t[r],e[r++]=n&this.DM,n>>=this.DB;if(t.t<this.t){for(n+=t.s;r<this.t;)n+=this[r],e[r++]=n&this.DM,n>>=this.DB;n+=this.s}else{for(n+=this.s;r<t.t;)n+=t[r],e[r++]=n&this.DM,n>>=this.DB;n+=t.s}e.s=n<0?-1:0,n>0?e[r++]=n:n<-1&&(e[r++]=this.DV+n),e.t=r,e.clamp()},E.prototype.dMultiply=function(t){this[this.t]=this.am(0,t-1,this,0,0,this.t),++this.t,this.clamp()},E.prototype.dAddOffset=function(t,e){if(0!=t){for(;this.t<=e;)this[this.t++]=0;for(this[e]+=t;this[e]>=this.DV;)this[e]-=this.DV,++e>=this.t&&(this[this.t++]=0),++this[e]}},E.prototype.multiplyLowerTo=function(t,e,r){var n,i=Math.min(this.t+t.t,e);for(r.s=0,r.t=i;i>0;)r[--i]=0;for(n=r.t-this.t;i<n;++i)r[i+this.t]=this.am(0,t[i],r,i,0,this.t);for(n=Math.min(t.t,e);i<n;++i)this.am(0,t[i],r,i,0,e-i);r.clamp()},E.prototype.multiplyUpperTo=function(t,e,r){--e;var n=r.t=this.t+t.t-e;for(r.s=0;--n>=0;)r[n]=0;for(n=Math.max(e-this.t,0);n<t.t;++n)r[this.t+n-e]=this.am(e-n,t[n],r,0,0,this.t+n-e);r.clamp(),r.drShiftTo(1,r)},E.prototype.modInt=function(t){if(t<=0)return 0;var e=this.DV%t,r=this.s<0?t-1:0;if(this.t>0)if(0==e)r=this[0]%t;else for(var n=this.t-1;n>=0;--n)r=(e*r+this[n])%t;return r},E.prototype.millerRabin=function(t){var e=this.subtract(E.ONE),r=e.getLowestSetBit();if(r<=0)return!1;var n=e.shiftRight(r);(t=t+1>>1)>W.length&&(t=W.length);for(var i=x(),o=0;o<t;++o){i.fromInt(W[Math.floor(Math.random()*W.length)]);var s=i.modPow(n,this);if(0!=s.compareTo(E.ONE)&&0!=s.compareTo(e)){for(var a=1;a++<r&&0!=s.compareTo(e);)if(0==(s=s.modPowInt(2,this)).compareTo(E.ONE))return!1;if(0!=s.compareTo(e))return!1}}return!0},E.prototype.clone=
/*! (c) Tom Wu | http://www-cs-students.stanford.edu/~tjw/jsbn/
 */
function(){var t=x();return this.copyTo(t),t},E.prototype.intValue=function(){if(this.s<0){if(1==this.t)return this[0]-this.DV;if(0==this.t)return-1}else{if(1==this.t)return this[0];if(0==this.t)return 0}return(this[1]&(1<<32-this.DB)-1)<<this.DB|this[0]},E.prototype.byteValue=function(){return 0==this.t?this.s:this[0]<<24>>24},E.prototype.shortValue=function(){return 0==this.t?this.s:this[0]<<16>>16},E.prototype.signum=function(){return this.s<0?-1:this.t<=0||1==this.t&&this[0]<=0?0:1},E.prototype.toByteArray=function(){var t=this.t,e=new Array;e[0]=this.s;var r,n=this.DB-t*this.DB%8,i=0;if(t-- >0)for(n<this.DB&&(r=this[t]>>n)!=(this.s&this.DM)>>n&&(e[i++]=r|this.s<<this.DB-n);t>=0;)n<8?(r=(this[t]&(1<<n)-1)<<8-n,r|=this[--t]>>(n+=this.DB-8)):(r=this[t]>>(n-=8)&255,n<=0&&(n+=this.DB,--t)),0!=(128&r)&&(r|=-256),0==i&&(128&this.s)!=(128&r)&&++i,(i>0||r!=this.s)&&(e[i++]=r);return e},E.prototype.equals=function(t){return 0==this.compareTo(t)},E.prototype.min=function(t){return this.compareTo(t)<0?this:t},E.prototype.max=function(t){return this.compareTo(t)>0?this:t},E.prototype.and=function(t){var e=x();return this.bitwiseTo(t,j,e),e},E.prototype.or=function(t){var e=x();return this.bitwiseTo(t,L,e),e},E.prototype.xor=function(t){var e=x();return this.bitwiseTo(t,O,e),e},E.prototype.andNot=function(t){var e=x();return this.bitwiseTo(t,H,e),e},E.prototype.not=function(){for(var t=x(),e=0;e<this.t;++e)t[e]=this.DM&~this[e];return t.t=this.t,t.s=~this.s,t},E.prototype.shiftLeft=function(t){var e=x();return t<0?this.rShiftTo(-t,e):this.lShiftTo(t,e),e},E.prototype.shiftRight=function(t){var e=x();return t<0?this.lShiftTo(-t,e):this.rShiftTo(t,e),e},E.prototype.getLowestSetBit=function(){for(var t=0;t<this.t;++t)if(0!=this[t])return t*this.DB+U(this[t]);return this.s<0?this.t*this.DB:-1},E.prototype.bitCount=function(){for(var t=0,e=this.s&this.DM,r=0;r<this.t;++r)t+=M(this[r]^e);return t},E.prototype.testBit=function(t){var e=Math.floor(t/this.DB);return e>=this.t?0!=this.s:0!=(this[e]&1<<t%this.DB)},E.prototype.setBit=function(t){return this.changeBit(t,L)},E.prototype.clearBit=function(t){return this.changeBit(t,H)},E.prototype.flipBit=function(t){return this.changeBit(t,O)},E.prototype.add=function(t){var e=x();return this.addTo(t,e),e},E.prototype.subtract=function(t){var e=x();return this.subTo(t,e),e},E.prototype.multiply=function(t){var e=x();return this.multiplyTo(t,e),e},E.prototype.divide=function(t){var e=x();return this.divRemTo(t,e,null),e},E.prototype.remainder=function(t){var e=x();return this.divRemTo(t,null,e),e},E.prototype.divideAndRemainder=function(t){var e=x(),r=x();return this.divRemTo(t,e,r),new Array(e,r)},E.prototype.modPow=function(t,e){var r,n,i=t.bitLength(),o=D(1);if(i<=0)return o;r=i<18?1:i<48?3:i<144?4:i<768?5:6,n=i<8?new N(e):e.isEven()?new q(e):new B(e);var s=new Array,a=3,u=r-1,c=(1<<r)-1;if(s[1]=n.convert(this),r>1){var h=x();for(n.sqrTo(s[1],h);a<=c;)s[a]=x(),n.mulTo(h,s[a-2],s[a]),a+=2}var l,f,d=t.t-1,p=!0,g=x();for(i=I(t[d])-1;d>=0;){for(i>=u?l=t[d]>>i-u&c:(l=(t[d]&(1<<i+1)-1)<<u-i,d>0&&(l|=t[d-1]>>this.DB+i-u)),a=r;0==(1&l);)l>>=1,--a;if((i-=a)<0&&(i+=this.DB,--d),p)s[l].copyTo(o),p=!1;else{for(;a>1;)n.sqrTo(o,g),n.sqrTo(g,o),a-=2;a>0?n.sqrTo(o,g):(f=o,o=g,g=f),n.mulTo(g,s[l],o)}for(;d>=0&&0==(t[d]&1<<i);)n.sqrTo(o,g),f=o,o=g,g=f,--i<0&&(i=this.DB-1,--d)}return n.revert(o)},E.prototype.modInverse=function(t){var e=t.isEven();if(this.isEven()&&e||0==t.signum())return E.ZERO;for(var r=t.clone(),n=this.clone(),i=D(1),o=D(0),s=D(0),a=D(1);0!=r.signum();){for(;r.isEven();)r.rShiftTo(1,r),e?(i.isEven()&&o.isEven()||(i.addTo(this,i),o.subTo(t,o)),i.rShiftTo(1,i)):o.isEven()||o.subTo(t,o),o.rShiftTo(1,o);for(;n.isEven();)n.rShiftTo(1,n),e?(s.isEven()&&a.isEven()||(s.addTo(this,s),a.subTo(t,a)),s.rShiftTo(1,s)):a.isEven()||a.subTo(t,a),a.rShiftTo(1,a);r.compareTo(n)>=0?(r.subTo(n,r),e&&i.subTo(s,i),o.subTo(a,o)):(n.subTo(r,n),e&&s.subTo(i,s),a.subTo(o,a))}return 0!=n.compareTo(E.ONE)?E.ZERO:a.compareTo(t)>=0?a.subtract(t):a.signum()<0?(a.addTo(t,a),a.signum()<0?a.add(t):a):a},E.prototype.pow=function(t){return this.exp(t,new V)},E.prototype.gcd=function(t){var e=this.s<0?this.negate():this.clone(),r=t.s<0?t.negate():t.clone();if(e.compareTo(r)<0){var n=e;e=r,r=n}var i=e.getLowestSetBit(),o=r.getLowestSetBit();if(o<0)return e;for(i<o&&(o=i),o>0&&(e.rShiftTo(o,e),r.rShiftTo(o,r));e.signum()>0;)(i=e.getLowestSetBit())>0&&e.rShiftTo(i,e),(i=r.getLowestSetBit())>0&&r.rShiftTo(i,r),e.compareTo(r)>=0?(e.subTo(r,e),e.rShiftTo(1,e)):(r.subTo(e,r),r.rShiftTo(1,r));return o>0&&r.lShiftTo(o,r),r},E.prototype.isProbablePrime=function(t){var e,r=this.abs();if(1==r.t&&r[0]<=W[W.length-1]){for(e=0;e<W.length;++e)if(r[0]==W[e])return!0;return!1}if(r.isEven())return!1;for(e=1;e<W.length;){for(var n=W[e],i=e+1;i<W.length&&n<J;)n*=W[i++];for(n=r.modInt(n);e<i;)if(n%W[e++]==0)return!1}return r.millerRabin(t)},E.prototype.square=function(){var t=x();return this.squareTo(t),t},Y.prototype.init=function(t){var e,r,n;for(e=0;e<256;++e)this.S[e]=e;for(r=0,e=0;e<256;++e)r=r+this.S[e]+t[e%t.length]&255,n=this.S[e],this.S[e]=this.S[r],this.S[r]=n;this.i=0,this.j=0},Y.prototype.next=function(){var t;return this.i=this.i+1&255,this.j=this.j+this.S[this.i]&255,t=this.S[this.i],this.S[this.i]=this.S[this.j],this.S[this.j]=t,this.S[t+this.S[this.i]&255]};var z,G,X,$=256;
/*! (c) Tom Wu | http://www-cs-students.stanford.edu/~tjw/jsbn/
 */function Z(){var t;t=(new Date).getTime(),G[X++]^=255&t,G[X++]^=t>>8&255,G[X++]^=t>>16&255,G[X++]^=t>>24&255,X>=$&&(X-=$)}if(null==G){var Q;if(G=new Array,X=0,void 0!==i&&(void 0!==i.crypto||void 0!==i.msCrypto)){var tt=i.crypto||i.msCrypto;if(tt.getRandomValues){var et=new Uint8Array(32);for(tt.getRandomValues(et),Q=0;Q<32;++Q)G[X++]=et[Q]}else if("Netscape"==n.appName&&n.appVersion<"5"){var rt=i.crypto.random(32);for(Q=0;Q<rt.length;++Q)G[X++]=255&rt.charCodeAt(Q)}}for(;X<$;)Q=Math.floor(65536*Math.random()),G[X++]=Q>>>8,G[X++]=255&Q;X=0,Z()}function nt(){if(null==z){for(Z(),(z=new Y).init(G),X=0;X<G.length;++X)G[X]=0;X=0}return z.next()}function it(){}
/*! (c) Tom Wu | http://www-cs-students.stanford.edu/~tjw/jsbn/
 */
function ot(t,e){return new E(t,e)}function st(t,e,r){for(var n="",i=0;n.length<e;)n+=r(String.fromCharCode.apply(String,t.concat([(4278190080&i)>>24,(16711680&i)>>16,(65280&i)>>8,255&i]))),i+=1;return n}function at(){this.n=null,this.e=0,this.d=null,this.p=null,this.q=null,this.dmp1=null,this.dmq1=null,this.coeff=null}
/*! (c) Tom Wu | http://www-cs-students.stanford.edu/~tjw/jsbn/
 */
function ut(t,e){this.x=e,this.q=t}function ct(t,e,r,n){this.curve=t,this.x=e,this.y=r,this.z=null==n?E.ONE:n,this.zinv=null}function ht(t,e,r){this.q=t,this.a=this.fromBigInteger(e),this.b=this.fromBigInteger(r),this.infinity=new ct(this,null,null)}it.prototype.nextBytes=function(t){var e;for(e=0;e<t.length;++e)t[e]=nt()},at.prototype.doPublic=function(t){return t.modPowInt(this.e,this.n)},at.prototype.setPublic=function(t,e){if(this.isPublic=!0,this.isPrivate=!1,"string"!=typeof t)this.n=t,this.e=e;else{if(!(null!=t&&null!=e&&t.length>0&&e.length>0))throw"Invalid RSA public key";this.n=ot(t,16),this.e=parseInt(e,16)}},at.prototype.encrypt=function(t){var e=function(t,e){if(e<t.length+11)throw"Message too long for RSA";for(var r=new Array,n=t.length-1;n>=0&&e>0;){var i=t.charCodeAt(n--);i<128?r[--e]=i:i>127&&i<2048?(r[--e]=63&i|128,r[--e]=i>>6|192):(r[--e]=63&i|128,r[--e]=i>>6&63|128,r[--e]=i>>12|224)}r[--e]=0;for(var o=new it,s=new Array;e>2;){for(s[0]=0;0==s[0];)o.nextBytes(s);r[--e]=s[0]}return r[--e]=2,r[--e]=0,new E(r)}(t,this.n.bitLength()+7>>3);if(null==e)return null;var r=this.doPublic(e);if(null==r)return null;var n=r.toString(16);return 0==(1&n.length)?n:"0"+n},at.prototype.encryptOAEP=function(t,e,r){var n=function(t,e,r,n){var i=ft.crypto.MessageDigest,o=ft.crypto.Util,s=null;if(r||(r="sha1"),"string"==typeof r&&(s=i.getCanonicalAlgName(r),n=i.getHashLength(s),r=function(t){return At(o.hashHex(Pt(t),s))}),t.length+2*n+2>e)throw"Message too long for RSA";var a,u="";for(a=0;a<e-t.length-2*n-2;a+=1)u+="\0";var c=r("")+u+""+t,h=new Array(n);(new it).nextBytes(h);var l=st(h,c.length,r),f=[];for(a=0;a<c.length;a+=1)f[a]=c.charCodeAt(a)^l.charCodeAt(a);var d=st(f,h.length,r),p=[0];for(a=0;a<h.length;a+=1)p[a+1]=h[a]^d.charCodeAt(a);return new E(p.concat(f))}(t,this.n.bitLength()+7>>3,e,r);if(null==n)return null;var i=this.doPublic(n);if(null==i)return null;var o=i.toString(16);return 0==(1&o.length)?o:"0"+o},at.prototype.type="RSA",ut.prototype.equals=function(t){return t==this||this.q.equals(t.q)&&this.x.equals(t.x)},ut.prototype.toBigInteger=function(){return this.x},ut.prototype.negate=function(){return new ut(this.q,this.x.negate().mod(this.q))},ut.prototype.add=function(t){return new ut(this.q,this.x.add(t.toBigInteger()).mod(this.q))},ut.prototype.subtract=function(t){return new ut(this.q,this.x.subtract(t.toBigInteger()).mod(this.q))},ut.prototype.multiply=function(t){return new ut(this.q,this.x.multiply(t.toBigInteger()).mod(this.q))},ut.prototype.square=function(){return new ut(this.q,this.x.square().mod(this.q))},ut.prototype.divide=function(t){return new ut(this.q,this.x.multiply(t.toBigInteger().modInverse(this.q)).mod(this.q))},ct.prototype.getX=function(){return null==this.zinv&&(this.zinv=this.z.modInverse(this.curve.q)),this.curve.fromBigInteger(this.x.toBigInteger().multiply(this.zinv).mod(this.curve.q))},ct.prototype.getY=function(){return null==this.zinv&&(this.zinv=this.z.modInverse(this.curve.q)),this.curve.fromBigInteger(this.y.toBigInteger().multiply(this.zinv).mod(this.curve.q))},ct.prototype.equals=function(t){return t==this||(this.isInfinity()?t.isInfinity():t.isInfinity()?this.isInfinity():!!t.y.toBigInteger().multiply(this.z).subtract(this.y.toBigInteger().multiply(t.z)).mod(this.curve.q).equals(E.ZERO)&&t.x.toBigInteger().multiply(this.z).subtract(this.x.toBigInteger().multiply(t.z)).mod(this.curve.q).equals(E.ZERO))},ct.prototype.isInfinity=function(){return null==this.x&&null==this.y||this.z.equals(E.ZERO)&&!this.y.toBigInteger().equals(E.ZERO)},ct.prototype.negate=function(){return new ct(this.curve,this.x,this.y.negate(),this.z)},ct.prototype.add=function(t){if(this.isInfinity())return t;if(t.isInfinity())return this;var e=t.y.toBigInteger().multiply(this.z).subtract(this.y.toBigInteger().multiply(t.z)).mod(this.curve.q),r=t.x.toBigInteger().multiply(this.z).subtract(this.x.toBigInteger().multiply(t.z)).mod(this.curve.q);if(E.ZERO.equals(r))return E.ZERO.equals(e)?this.twice():this.curve.getInfinity();var n=new E("3"),i=this.x.toBigInteger(),o=this.y.toBigInteger(),s=(t.x.toBigInteger(),t.y.toBigInteger(),r.square()),a=s.multiply(r),u=i.multiply(s),c=e.square().multiply(this.z),h=c.subtract(u.shiftLeft(1)).multiply(t.z).subtract(a).multiply(r).mod(this.curve.q),l=u.multiply(n).multiply(e).subtract(o.multiply(a)).subtract(c.multiply(e)).multiply(t.z).add(e.multiply(a)).mod(this.curve.q),f=a.multiply(this.z).multiply(t.z).mod(this.curve.q);return new ct(this.curve,this.curve.fromBigInteger(h),this.curve.fromBigInteger(l),f)},ct.prototype.twice=function(){if(this.isInfinity())return this;if(0==this.y.toBigInteger().signum())return this.curve.getInfinity();var t=new E("3"),e=this.x.toBigInteger(),r=this.y.toBigInteger(),n=r.multiply(this.z),i=n.multiply(r).mod(this.curve.q),o=this.curve.a.toBigInteger(),s=e.square().multiply(t);E.ZERO.equals(o)||(s=s.add(this.z.square().multiply(o)));var a=(s=s.mod(this.curve.q)).square().subtract(e.shiftLeft(3).multiply(i)).shiftLeft(1).multiply(n).mod(this.curve.q),u=s.multiply(t).multiply(e).subtract(i.shiftLeft(1)).shiftLeft(2).multiply(i).subtract(s.square().multiply(s)).mod(this.curve.q),c=n.square().multiply(n).shiftLeft(3).mod(this.curve.q);return new ct(this.curve,this.curve.fromBigInteger(a),this.curve.fromBigInteger(u),c)},ct.prototype.multiply=function(t){if(this.isInfinity())return this;if(0==t.signum())return this.curve.getInfinity();var e,r=t,n=r.multiply(new E("3")),i=this.negate(),o=this;for(e=n.bitLength()-2;e>0;--e){o=o.twice();var s=n.testBit(e);s!=r.testBit(e)&&(o=o.add(s?this:i))}return o},ct.prototype.multiplyTwo=function(t,e,r){var n;n=t.bitLength()>r.bitLength()?t.bitLength()-1:r.bitLength()-1;for(var i=this.curve.getInfinity(),o=this.add(e);n>=0;)i=i.twice(),t.testBit(n)?i=r.testBit(n)?i.add(o):i.add(this):r.testBit(n)&&(i=i.add(e)),--n;return i},ht.prototype.getQ=function(){return this.q},ht.prototype.getA=function(){return this.a},ht.prototype.getB=function(){return this.b},ht.prototype.equals=function(t){return t==this||this.q.equals(t.q)&&this.a.equals(t.a)&&this.b.equals(t.b)},ht.prototype.getInfinity=function(){return this.infinity},ht.prototype.fromBigInteger=function(t){return new ut(this.q,t)},ht.prototype.decodePointHex=function(t){switch(parseInt(t.substr(0,2),16)){case 0:return this.infinity;case 2:case 3:return null;case 4:case 6:case 7:var e=(t.length-2)/2,r=t.substr(2,e),n=t.substr(e+2,e);return new ct(this,this.fromBigInteger(new E(r,16)),this.fromBigInteger(new E(n,16)));default:return null}};
/*! Mike Samuel (c) 2009 | code.google.com/p/json-sans-eval
 */
var lt=function(){var t=new RegExp('(?:false|true|null|[\\{\\}\\[\\]]|(?:-?\\b(?:0|[1-9][0-9]*)(?:\\.[0-9]+)?(?:[eE][+-]?[0-9]+)?\\b)|(?:"(?:[^\\0-\\x08\\x0a-\\x1f"\\\\]|\\\\(?:["/\\\\bfnrt]|u[0-9A-Fa-f]{4}))*"))',"g"),e=new RegExp("\\\\(?:([^u])|u(.{4}))","g"),n={'"':'"',"/":"/","\\":"\\",b:"\b",f:"\f",n:"\n",r:"\r",t:"\t"};function i(t,e,r){return e?n[e]:String.fromCharCode(parseInt(r,16))}var o=new String(""),s=(Object,Array,Object.hasOwnProperty);return function(n,a){var u,c,h=n.match(t),l=h[0],f=!1;"{"===l?u={}:"["===l?u=[]:(u=[],f=!0);for(var d=[u],p=1-f,g=h.length;p<g;++p){var v;switch((l=h[p]).charCodeAt(0)){default:(v=d[0])[c||v.length]=+l,c=void 0;break;case 34:if(-1!==(l=l.substring(1,l.length-1)).indexOf("\\")&&(l=l.replace(e,i)),v=d[0],!c){if(!(v instanceof Array)){c=l||o;break}c=v.length}v[c]=l,c=void 0;break;case 91:v=d[0],d.unshift(v[c||v.length]=[]),c=void 0;break;case 93:d.shift();break;case 102:(v=d[0])[c||v.length]=!1,c=void 0;break;case 110:(v=d[0])[c||v.length]=null,c=void 0;break;case 116:(v=d[0])[c||v.length]=!0,c=void 0;break;case 123:v=d[0],d.unshift(v[c||v.length]={}),c=void 0;break;case 125:d.shift()}}if(f){if(1!==d.length)throw new Error;u=u[0]}else if(d.length)throw new Error;if(a){u=function t(e,n){var i=e[n];if(i&&"object"===(void 0===i?"undefined":r(i))){var o=null;for(var u in i)if(s.call(i,u)&&i!==e){var c=t(i,u);void 0!==c?i[u]=c:(o||(o=[]),o.push(u))}if(o)for(var h=o.length;--h>=0;)delete i[o[h]]}return a.call(e,n,i)}({"":u},"")}return u}}();void 0!==ft&&ft||(ft={}),void 0!==ft.asn1&&ft.asn1||(ft.asn1={}),ft.asn1.ASN1Util=new function(){this.integerToByteHex=function(t){var e=t.toString(16);return e.length%2==1&&(e="0"+e),e},this.bigIntToMinTwosComplementsHex=function(t){var e=t.toString(16);if("-"!=e.substr(0,1))e.length%2==1?e="0"+e:e.match(/^[0-7]/)||(e="00"+e);else{var r=e.substr(1).length;r%2==1?r+=1:e.match(/^[0-7]/)||(r+=2);for(var n="",i=0;i<r;i++)n+="f";e=new E(n,16).xor(t).add(E.ONE).toString(16).replace(/^-/,"")}return e},this.getPEMStringFromHex=function(t,e){return kt(t,e)},this.newObject=function(t){var e=ft.asn1,r=e.DERBoolean,n=e.DERInteger,i=e.DERBitString,o=e.DEROctetString,s=e.DERNull,a=e.DERObjectIdentifier,u=e.DEREnumerated,c=e.DERUTF8String,h=e.DERNumericString,l=e.DERPrintableString,f=e.DERTeletexString,d=e.DERIA5String,p=e.DERUTCTime,g=e.DERGeneralizedTime,v=e.DERSequence,y=e.DERSet,m=e.DERTaggedObject,S=e.ASN1Util.newObject,b=Object.keys(t);if(1!=b.length)throw"key of param shall be only one.";var w=b[0];if(-1==":bool:int:bitstr:octstr:null:oid:enum:utf8str:numstr:prnstr:telstr:ia5str:utctime:gentime:seq:set:tag:".indexOf(":"+w+":"))throw"undefined key: "+w;if("bool"==w)return new r(t[w]);if("int"==w)return new n(t[w]);if("bitstr"==w)return new i(t[w]);if("octstr"==w)return new o(t[w]);if("null"==w)return new s(t[w]);if("oid"==w)return new a(t[w]);if("enum"==w)return new u(t[w]);if("utf8str"==w)return new c(t[w]);if("numstr"==w)return new h(t[w]);if("prnstr"==w)return new l(t[w]);if("telstr"==w)return new f(t[w]);if("ia5str"==w)return new d(t[w]);if("utctime"==w)return new p(t[w]);if("gentime"==w)return new g(t[w]);if("seq"==w){for(var F=t[w],_=[],E=0;E<F.length;E++){var x=S(F[E]);_.push(x)}return new v({array:_})}if("set"==w){for(F=t[w],_=[],E=0;E<F.length;E++){x=S(F[E]);_.push(x)}return new y({array:_})}if("tag"==w){var A=t[w];if("[object Array]"===Object.prototype.toString.call(A)&&3==A.length){var P=S(A[2]);return new m({tag:A[0],explicit:A[1],obj:P})}var C={};if(void 0!==A.explicit&&(C.explicit=A.explicit),void 0!==A.tag&&(C.tag=A.tag),void 0===A.obj)throw"obj shall be specified for 'tag'.";return C.obj=S(A.obj),new m(C)}},this.jsonToASN1HEX=function(t){return this.newObject(t).getEncodedHex()}},ft.asn1.ASN1Util.oidHexToInt=function(t){for(var e="",r=parseInt(t.substr(0,2),16),n=(e=Math.floor(r/40)+"."+r%40,""),i=2;i<t.length;i+=2){var o=("00000000"+parseInt(t.substr(i,2),16).toString(2)).slice(-8);if(n+=o.substr(1,7),"0"==o.substr(0,1))e=e+"."+new E(n,2).toString(10),n=""}return e},ft.asn1.ASN1Util.oidIntToHex=function(t){var e=function(t){var e=t.toString(16);return 1==e.length&&(e="0"+e),e},r=function(t){var r="",n=new E(t,10).toString(2),i=7-n.length%7;7==i&&(i=0);for(var o="",s=0;s<i;s++)o+="0";n=o+n;for(s=0;s<n.length-1;s+=7){var a=n.substr(s,7);s!=n.length-7&&(a="1"+a),r+=e(parseInt(a,2))}return r};if(!t.match(/^[0-9.]+$/))throw"malformed oid string: "+t;var n="",i=t.split("."),o=40*parseInt(i[0])+parseInt(i[1]);n+=e(o),i.splice(0,2);for(var s=0;s<i.length;s++)n+=r(i[s]);return n},ft.asn1.ASN1Object=function(){this.getLengthHexFromValue=function(){if(void 0===this.hV||null==this.hV)throw"this.hV is null or undefined.";if(this.hV.length%2==1)throw"value hex must be even length: n="+"".length+",v="+this.hV;var t=this.hV.length/2,e=t.toString(16);if(e.length%2==1&&(e="0"+e),t<128)return e;var r=e.length/2;if(r>15)throw"ASN.1 length too long to represent by 8x: n = "+t.toString(16);return(128+r).toString(16)+e},this.getEncodedHex=function(){return(null==this.hTLV||this.isModified)&&(this.hV=this.getFreshValueHex(),this.hL=this.getLengthHexFromValue(),this.hTLV=this.hT+this.hL+this.hV,this.isModified=!1),this.hTLV},this.getValueHex=function(){return this.getEncodedHex(),this.hV},this.getFreshValueHex=function(){return""}},ft.asn1.DERAbstractString=function(t){ft.asn1.DERAbstractString.superclass.constructor.call(this);this.getString=function(){return this.s},this.setString=function(t){this.hTLV=null,this.isModified=!0,this.s=t,this.hV=Et(this.s).toLowerCase()},this.setStringHex=function(t){this.hTLV=null,this.isModified=!0,this.s=null,this.hV=t},this.getFreshValueHex=function(){return this.hV},void 0!==t&&("string"==typeof t?this.setString(t):void 0!==t.str?this.setString(t.str):void 0!==t.hex&&this.setStringHex(t.hex))},o.lang.extend(ft.asn1.DERAbstractString,ft.asn1.ASN1Object),ft.asn1.DERAbstractTime=function(t){ft.asn1.DERAbstractTime.superclass.constructor.call(this);this.localDateToUTC=function(t){return utc=t.getTime()+6e4*t.getTimezoneOffset(),new Date(utc)},this.formatDate=function(t,e,r){var n=this.zeroPadding,i=this.localDateToUTC(t),o=String(i.getFullYear());"utc"==e&&(o=o.substr(2,2));var s=o+n(String(i.getMonth()+1),2)+n(String(i.getDate()),2)+n(String(i.getHours()),2)+n(String(i.getMinutes()),2)+n(String(i.getSeconds()),2);if(!0===r){var a=i.getMilliseconds();if(0!=a){var u=n(String(a),3);s=s+"."+(u=u.replace(/[0]+$/,""))}}return s+"Z"},this.zeroPadding=function(t,e){return t.length>=e?t:new Array(e-t.length+1).join("0")+t},this.getString=function(){return this.s},this.setString=function(t){this.hTLV=null,this.isModified=!0,this.s=t,this.hV=St(t)},this.setByDateValue=function(t,e,r,n,i,o){var s=new Date(Date.UTC(t,e-1,r,n,i,o,0));this.setByDate(s)},this.getFreshValueHex=function(){return this.hV}},o.lang.extend(ft.asn1.DERAbstractTime,ft.asn1.ASN1Object),ft.asn1.DERAbstractStructured=function(t){ft.asn1.DERAbstractString.superclass.constructor.call(this);this.setByASN1ObjectArray=function(t){this.hTLV=null,this.isModified=!0,this.asn1Array=t},this.appendASN1Object=function(t){this.hTLV=null,this.isModified=!0,this.asn1Array.push(t)},this.asn1Array=new Array,void 0!==t&&void 0!==t.array&&(this.asn1Array=t.array)},o.lang.extend(ft.asn1.DERAbstractStructured,ft.asn1.ASN1Object),ft.asn1.DERBoolean=function(){ft.asn1.DERBoolean.superclass.constructor.call(this),this.hT="01",this.hTLV="0101ff"},o.lang.extend(ft.asn1.DERBoolean,ft.asn1.ASN1Object),ft.asn1.DERInteger=function(t){ft.asn1.DERInteger.superclass.constructor.call(this),this.hT="02",this.setByBigInteger=function(t){this.hTLV=null,this.isModified=!0,this.hV=ft.asn1.ASN1Util.bigIntToMinTwosComplementsHex(t)},this.setByInteger=function(t){var e=new E(String(t),10);this.setByBigInteger(e)},this.setValueHex=function(t){this.hV=t},this.getFreshValueHex=function(){return this.hV},void 0!==t&&(void 0!==t.bigint?this.setByBigInteger(t.bigint):void 0!==t.int?this.setByInteger(t.int):"number"==typeof t?this.setByInteger(t):void 0!==t.hex&&this.setValueHex(t.hex))},o.lang.extend(ft.asn1.DERInteger,ft.asn1.ASN1Object),ft.asn1.DERBitString=function(t){if(void 0!==t&&void 0!==t.obj){var e=ft.asn1.ASN1Util.newObject(t.obj);t.hex="00"+e.getEncodedHex()}ft.asn1.DERBitString.superclass.constructor.call(this),this.hT="03",this.setHexValueIncludingUnusedBits=function(t){this.hTLV=null,this.isModified=!0,this.hV=t},this.setUnusedBitsAndHexValue=function(t,e){if(t<0||7<t)throw"unused bits shall be from 0 to 7: u = "+t;var r="0"+t;this.hTLV=null,this.isModified=!0,this.hV=r+e},this.setByBinaryString=function(t){var e=8-(t=t.replace(/0+$/,"")).length%8;8==e&&(e=0);for(var r=0;r<=e;r++)t+="0";var n="";for(r=0;r<t.length-1;r+=8){var i=t.substr(r,8),o=parseInt(i,2).toString(16);1==o.length&&(o="0"+o),n+=o}this.hTLV=null,this.isModified=!0,this.hV="0"+e+n},this.setByBooleanArray=function(t){for(var e="",r=0;r<t.length;r++)1==t[r]?e+="1":e+="0";this.setByBinaryString(e)},this.newFalseArray=function(t){for(var e=new Array(t),r=0;r<t;r++)e[r]=!1;return e},this.getFreshValueHex=function(){return this.hV},void 0!==t&&("string"==typeof t&&t.toLowerCase().match(/^[0-9a-f]+$/)?this.setHexValueIncludingUnusedBits(t):void 0!==t.hex?this.setHexValueIncludingUnusedBits(t.hex):void 0!==t.bin?this.setByBinaryString(t.bin):void 0!==t.array&&this.setByBooleanArray(t.array))},o.lang.extend(ft.asn1.DERBitString,ft.asn1.ASN1Object),ft.asn1.DEROctetString=function(t){if(void 0!==t&&void 0!==t.obj){var e=ft.asn1.ASN1Util.newObject(t.obj);t.hex=e.getEncodedHex()}ft.asn1.DEROctetString.superclass.constructor.call(this,t),this.hT="04"},o.lang.extend(ft.asn1.DEROctetString,ft.asn1.DERAbstractString),ft.asn1.DERNull=function(){ft.asn1.DERNull.superclass.constructor.call(this),this.hT="05",this.hTLV="0500"},o.lang.extend(ft.asn1.DERNull,ft.asn1.ASN1Object),ft.asn1.DERObjectIdentifier=function(t){var e=function(t){var e=t.toString(16);return 1==e.length&&(e="0"+e),e},r=function(t){var r="",n=new E(t,10).toString(2),i=7-n.length%7;7==i&&(i=0);for(var o="",s=0;s<i;s++)o+="0";n=o+n;for(s=0;s<n.length-1;s+=7){var a=n.substr(s,7);s!=n.length-7&&(a="1"+a),r+=e(parseInt(a,2))}return r};ft.asn1.DERObjectIdentifier.superclass.constructor.call(this),this.hT="06",this.setValueHex=function(t){this.hTLV=null,this.isModified=!0,this.s=null,this.hV=t},this.setValueOidString=function(t){if(!t.match(/^[0-9.]+$/))throw"malformed oid string: "+t;var n="",i=t.split("."),o=40*parseInt(i[0])+parseInt(i[1]);n+=e(o),i.splice(0,2);for(var s=0;s<i.length;s++)n+=r(i[s]);this.hTLV=null,this.isModified=!0,this.s=null,this.hV=n},this.setValueName=function(t){var e=ft.asn1.x509.OID.name2oid(t);if(""===e)throw"DERObjectIdentifier oidName undefined: "+t;this.setValueOidString(e)},this.getFreshValueHex=function(){return this.hV},void 0!==t&&("string"==typeof t?t.match(/^[0-2].[0-9.]+$/)?this.setValueOidString(t):this.setValueName(t):void 0!==t.oid?this.setValueOidString(t.oid):void 0!==t.hex?this.setValueHex(t.hex):void 0!==t.name&&this.setValueName(t.name))},o.lang.extend(ft.asn1.DERObjectIdentifier,ft.asn1.ASN1Object),ft.asn1.DEREnumerated=function(t){ft.asn1.DEREnumerated.superclass.constructor.call(this),this.hT="0a",this.setByBigInteger=function(t){this.hTLV=null,this.isModified=!0,this.hV=ft.asn1.ASN1Util.bigIntToMinTwosComplementsHex(t)},this.setByInteger=function(t){var e=new E(String(t),10);this.setByBigInteger(e)},this.setValueHex=function(t){this.hV=t},this.getFreshValueHex=function(){return this.hV},void 0!==t&&(void 0!==t.int?this.setByInteger(t.int):"number"==typeof t?this.setByInteger(t):void 0!==t.hex&&this.setValueHex(t.hex))},o.lang.extend(ft.asn1.DEREnumerated,ft.asn1.ASN1Object),ft.asn1.DERUTF8String=function(t){ft.asn1.DERUTF8String.superclass.constructor.call(this,t),this.hT="0c"},o.lang.extend(ft.asn1.DERUTF8String,ft.asn1.DERAbstractString),ft.asn1.DERNumericString=function(t){ft.asn1.DERNumericString.superclass.constructor.call(this,t),this.hT="12"},o.lang.extend(ft.asn1.DERNumericString,ft.asn1.DERAbstractString),ft.asn1.DERPrintableString=function(t){ft.asn1.DERPrintableString.superclass.constructor.call(this,t),this.hT="13"},o.lang.extend(ft.asn1.DERPrintableString,ft.asn1.DERAbstractString),ft.asn1.DERTeletexString=function(t){ft.asn1.DERTeletexString.superclass.constructor.call(this,t),this.hT="14"},o.lang.extend(ft.asn1.DERTeletexString,ft.asn1.DERAbstractString),ft.asn1.DERIA5String=function(t){ft.asn1.DERIA5String.superclass.constructor.call(this,t),this.hT="16"},o.lang.extend(ft.asn1.DERIA5String,ft.asn1.DERAbstractString),ft.asn1.DERUTCTime=function(t){ft.asn1.DERUTCTime.superclass.constructor.call(this,t),this.hT="17",this.setByDate=function(t){this.hTLV=null,this.isModified=!0,this.date=t,this.s=this.formatDate(this.date,"utc"),this.hV=St(this.s)},this.getFreshValueHex=function(){return void 0===this.date&&void 0===this.s&&(this.date=new Date,this.s=this.formatDate(this.date,"utc"),this.hV=St(this.s)),this.hV},void 0!==t&&(void 0!==t.str?this.setString(t.str):"string"==typeof t&&t.match(/^[0-9]{12}Z$/)?this.setString(t):void 0!==t.hex?this.setStringHex(t.hex):void 0!==t.date&&this.setByDate(t.date))},o.lang.extend(ft.asn1.DERUTCTime,ft.asn1.DERAbstractTime),ft.asn1.DERGeneralizedTime=function(t){ft.asn1.DERGeneralizedTime.superclass.constructor.call(this,t),this.hT="18",this.withMillis=!1,this.setByDate=function(t){this.hTLV=null,this.isModified=!0,this.date=t,this.s=this.formatDate(this.date,"gen",this.withMillis),this.hV=St(this.s)},this.getFreshValueHex=function(){return void 0===this.date&&void 0===this.s&&(this.date=new Date,this.s=this.formatDate(this.date,"gen",this.withMillis),this.hV=St(this.s)),this.hV},void 0!==t&&(void 0!==t.str?this.setString(t.str):"string"==typeof t&&t.match(/^[0-9]{14}Z$/)?this.setString(t):void 0!==t.hex?this.setStringHex(t.hex):void 0!==t.date&&this.setByDate(t.date),!0===t.millis&&(this.withMillis=!0))},o.lang.extend(ft.asn1.DERGeneralizedTime,ft.asn1.DERAbstractTime),ft.asn1.DERSequence=function(t){ft.asn1.DERSequence.superclass.constructor.call(this,t),this.hT="30",this.getFreshValueHex=function(){for(var t="",e=0;e<this.asn1Array.length;e++){t+=this.asn1Array[e].getEncodedHex()}return this.hV=t,this.hV}},o.lang.extend(ft.asn1.DERSequence,ft.asn1.DERAbstractStructured),ft.asn1.DERSet=function(t){ft.asn1.DERSet.superclass.constructor.call(this,t),this.hT="31",this.sortFlag=!0,this.getFreshValueHex=function(){for(var t=new Array,e=0;e<this.asn1Array.length;e++){var r=this.asn1Array[e];t.push(r.getEncodedHex())}return 1==this.sortFlag&&t.sort(),this.hV=t.join(""),this.hV},void 0!==t&&void 0!==t.sortflag&&0==t.sortflag&&(this.sortFlag=!1)},o.lang.extend(ft.asn1.DERSet,ft.asn1.DERAbstractStructured),ft.asn1.DERTaggedObject=function(t){ft.asn1.DERTaggedObject.superclass.constructor.call(this),this.hT="a0",this.hV="",this.isExplicit=!0,this.asn1Object=null,this.setASN1Object=function(t,e,r){this.hT=e,this.isExplicit=t,this.asn1Object=r,this.isExplicit?(this.hV=this.asn1Object.getEncodedHex(),this.hTLV=null,this.isModified=!0):(this.hV=null,this.hTLV=r.getEncodedHex(),this.hTLV=this.hTLV.replace(/^../,e),this.isModified=!1)},this.getFreshValueHex=function(){return this.hV},void 0!==t&&(void 0!==t.tag&&(this.hT=t.tag),void 0!==t.explicit&&(this.isExplicit=t.explicit),void 0!==t.obj&&(this.asn1Object=t.obj,this.setASN1Object(this.isExplicit,this.hT,this.asn1Object)))},o.lang.extend(ft.asn1.DERTaggedObject,ft.asn1.ASN1Object);var ft,dt,pt,gt=new function(){};function vt(t){for(var e=new Array,r=0;r<t.length;r++)e[r]=t.charCodeAt(r);return e}function yt(t){for(var e="",r=0;r<t.length;r++)e+=String.fromCharCode(t[r]);return e}function mt(t){for(var e="",r=0;r<t.length;r++){var n=t[r].toString(16);1==n.length&&(n="0"+n),e+=n}return e}function St(t){return mt(vt(t))}function bt(t){return t=(t=(t=t.replace(/\=/g,"")).replace(/\+/g,"-")).replace(/\//g,"_")}function wt(t){return t.length%4==2?t+="==":t.length%4==3&&(t+="="),t=(t=t.replace(/-/g,"+")).replace(/_/g,"/")}function Ft(t){return t.length%2==1&&(t="0"+t),bt(w(t))}function _t(t){return F(wt(t))}function Et(t){return Bt(Ut(t))}function xt(t){return decodeURIComponent(jt(t))}function At(t){for(var e="",r=0;r<t.length-1;r+=2)e+=String.fromCharCode(parseInt(t.substr(r,2),16));return e}function Pt(t){for(var e="",r=0;r<t.length;r++)e+=("0"+t.charCodeAt(r).toString(16)).slice(-2);return e}function Ct(t){return w(t)}function Rt(t){var e=Ct(t).replace(/(.{64})/g,"$1\r\n");return e=e.replace(/\r\n$/,"")}function Tt(t){return F(t.replace(/[^0-9A-Za-z\/+=]*/g,""))}function kt(t,e){return"-----BEGIN "+e+"-----\r\n"+Rt(t)+"\r\n-----END "+e+"-----\r\n"}function Dt(t,e){if(-1==t.indexOf("-----BEGIN "))throw"can't find PEM header: "+e;return Tt(t=void 0!==e?(t=t.replace("-----BEGIN "+e+"-----","")).replace("-----END "+e+"-----",""):(t=t.replace(/-----BEGIN [^-]+-----/,"")).replace(/-----END [^-]+-----/,""))}function It(t){var e,r,n,i,o,s,a,u,c,h,l;if(l=t.match(/^(\d{2}|\d{4})(\d\d)(\d\d)(\d\d)(\d\d)(\d\d)(|\.\d+)Z$/))return u=l[1],e=parseInt(u),2===u.length&&(50<=e&&e<100?e=1900+e:0<=e&&e<50&&(e=2e3+e)),r=parseInt(l[2])-1,n=parseInt(l[3]),i=parseInt(l[4]),o=parseInt(l[5]),s=parseInt(l[6]),a=0,""!==(c=l[7])&&(h=(c.substr(1)+"00").substr(0,3),a=parseInt(h)),Date.UTC(e,r,n,i,o,s,a);throw"unsupported zulu format: "+t}function Nt(t){return~~(It(t)/1e3)}function Bt(t){return t.replace(/%/g,"")}function jt(t){return t.replace(/(..)/g,"%$1")}function Lt(t){var e="malformed IPv6 address";if(!t.match(/^[0-9A-Fa-f:]+$/))throw e;var r=(t=t.toLowerCase()).split(":").length-1;if(r<2)throw e;var n=":".repeat(7-r+2),i=(t=t.replace("::",n)).split(":");if(8!=i.length)throw e;for(var o=0;o<8;o++)i[o]=("0000"+i[o]).slice(-4);return i.join("")}function Ot(t){if(!t.match(/^[0-9A-Fa-f]{32}$/))throw"malformed IPv6 address octet";for(var e=(t=t.toLowerCase()).match(/.{1,4}/g),r=0;r<8;r++)e[r]=e[r].replace(/^0+/,""),""==e[r]&&(e[r]="0");var n=(t=":"+e.join(":")+":").match(/:(0:){2,}/g);if(null===n)return t.slice(1,-1);var i="";for(r=0;r<n.length;r++)n[r].length>i.length&&(i=n[r]);return(t=t.replace(i,"::")).slice(1,-1)}function Ht(t){var e="malformed hex value";if(!t.match(/^([0-9A-Fa-f][0-9A-Fa-f]){1,}$/))throw e;if(8!=t.length)return 32==t.length?Ot(t):t;try{return parseInt(t.substr(0,2),16)+"."+parseInt(t.substr(2,2),16)+"."+parseInt(t.substr(4,2),16)+"."+parseInt(t.substr(6,2),16)}catch(t){throw e}}function Ut(t){for(var e=encodeURIComponent(t),r="",n=0;n<e.length;n++)"%"==e[n]?(r+=e.substr(n,3),n+=2):r=r+"%"+St(e[n]);return r}function Mt(t){return t.length%2==1?"0"+t:t.substr(0,1)>"7"?"00"+t:t}function Vt(t){t=(t=(t=t.replace(/^\s*\[\s*/,"")).replace(/\s*\]\s*$/,"")).replace(/\s*/g,"");try{return t.split(/,/).map(function(t,e,r){var n=parseInt(t);if(n<0||255<n)throw"integer not in range 0-255";return("00"+n.toString(16)).slice(-2)}).join("")}catch(t){throw"malformed integer array string: "+t}}gt.getLblen=function(t,e){if("8"!=t.substr(e+2,1))return 1;var r=parseInt(t.substr(e+3,1));return 0==r?-1:0<r&&r<10?r+1:-2},gt.getL=function(t,e){var r=gt.getLblen(t,e);return r<1?"":t.substr(e+2,2*r)},gt.getVblen=function(t,e){var r;return""==(r=gt.getL(t,e))?-1:("8"===r.substr(0,1)?new E(r.substr(2),16):new E(r,16)).intValue()},gt.getVidx=function(t,e){var r=gt.getLblen(t,e);return r<0?r:e+2*(r+1)},gt.getV=function(t,e){var r=gt.getVidx(t,e),n=gt.getVblen(t,e);return t.substr(r,2*n)},gt.getTLV=function(t,e){return t.substr(e,2)+gt.getL(t,e)+gt.getV(t,e)},gt.getNextSiblingIdx=function(t,e){return gt.getVidx(t,e)+2*gt.getVblen(t,e)},gt.getChildIdx=function(t,e){var r=gt,n=new Array,i=r.getVidx(t,e);"03"==t.substr(e,2)?n.push(i+2):n.push(i);for(var o=r.getVblen(t,e),s=i,a=0;;){var u=r.getNextSiblingIdx(t,s);if(null==u||u-i>=2*o)break;if(a>=200)break;n.push(u),s=u,a++}return n},gt.getNthChildIdx=function(t,e,r){return gt.getChildIdx(t,e)[r]},gt.getIdxbyList=function(t,e,r,n){var i,o,s=gt;if(0==r.length){if(void 0!==n&&t.substr(e,2)!==n)throw"checking tag doesn't match: "+t.substr(e,2)+"!="+n;return e}return i=r.shift(),o=s.getChildIdx(t,e),s.getIdxbyList(t,o[i],r,n)},gt.getTLVbyList=function(t,e,r,n){var i=gt,o=i.getIdxbyList(t,e,r);if(void 0===o)throw"can't find nthList object";if(void 0!==n&&t.substr(o,2)!=n)throw"checking tag doesn't match: "+t.substr(o,2)+"!="+n;return i.getTLV(t,o)},gt.getVbyList=function(t,e,r,n,i){var o,s,a=gt;if(void 0===(o=a.getIdxbyList(t,e,r,n)))throw"can't find nthList object";return s=a.getV(t,o),!0===i&&(s=s.substr(2)),s},gt.hextooidstr=function(t){var e=function(t,e){return t.length>=e?t:new Array(e-t.length+1).join("0")+t},r=[],n=t.substr(0,2),i=parseInt(n,16);r[0]=new String(Math.floor(i/40)),r[1]=new String(i%40);for(var o=t.substr(2),s=[],a=0;a<o.length/2;a++)s.push(parseInt(o.substr(2*a,2),16));var u=[],c="";for(a=0;a<s.length;a++)128&s[a]?c+=e((127&s[a]).toString(2),7):(c+=e((127&s[a]).toString(2),7),u.push(new String(parseInt(c,2))),c="");var h=r.join(".");return u.length>0&&(h=h+"."+u.join(".")),h},gt.dump=function(t,e,r,n){var i=gt,o=i.getV,s=i.dump,a=i.getChildIdx,u=t;t instanceof ft.asn1.ASN1Object&&(u=t.getEncodedHex());var c=function(t,e){return t.length<=2*e?t:t.substr(0,e)+"..(total "+t.length/2+"bytes).."+t.substr(t.length-e,e)};void 0===e&&(e={ommit_long_octet:32}),void 0===r&&(r=0),void 0===n&&(n="");var h=e.ommit_long_octet;if("01"==u.substr(r,2))return"00"==(l=o(u,r))?n+"BOOLEAN FALSE\n":n+"BOOLEAN TRUE\n";if("02"==u.substr(r,2))return n+"INTEGER "+c(l=o(u,r),h)+"\n";if("03"==u.substr(r,2))return n+"BITSTRING "+c(l=o(u,r),h)+"\n";if("04"==u.substr(r,2)){var l=o(u,r);if(i.isASN1HEX(l)){var f=n+"OCTETSTRING, encapsulates\n";return f+=s(l,e,0,n+"  ")}return n+"OCTETSTRING "+c(l,h)+"\n"}if("05"==u.substr(r,2))return n+"NULL\n";if("06"==u.substr(r,2)){var d=o(u,r),p=ft.asn1.ASN1Util.oidHexToInt(d),g=ft.asn1.x509.OID.oid2name(p),v=p.replace(/\./g," ");return""!=g?n+"ObjectIdentifier "+g+" ("+v+")\n":n+"ObjectIdentifier ("+v+")\n"}if("0c"==u.substr(r,2))return n+"UTF8String '"+xt(o(u,r))+"'\n";if("13"==u.substr(r,2))return n+"PrintableString '"+xt(o(u,r))+"'\n";if("14"==u.substr(r,2))return n+"TeletexString '"+xt(o(u,r))+"'\n";if("16"==u.substr(r,2))return n+"IA5String '"+xt(o(u,r))+"'\n";if("17"==u.substr(r,2))return n+"UTCTime "+xt(o(u,r))+"\n";if("18"==u.substr(r,2))return n+"GeneralizedTime "+xt(o(u,r))+"\n";if("30"==u.substr(r,2)){if("3000"==u.substr(r,4))return n+"SEQUENCE {}\n";f=n+"SEQUENCE\n";var y=e;if((2==(b=a(u,r)).length||3==b.length)&&"06"==u.substr(b[0],2)&&"04"==u.substr(b[b.length-1],2)){g=i.oidname(o(u,b[0]));var m=JSON.parse(JSON.stringify(e));m.x509ExtName=g,y=m}for(var S=0;S<b.length;S++)f+=s(u,y,b[S],n+"  ");return f}if("31"==u.substr(r,2)){f=n+"SET\n";var b=a(u,r);for(S=0;S<b.length;S++)f+=s(u,e,b[S],n+"  ");return f}var w=parseInt(u.substr(r,2),16);if(0!=(128&w)){var F=31&w;if(0!=(32&w)){var f=n+"["+F+"]\n";for(b=a(u,r),S=0;S<b.length;S++)f+=s(u,e,b[S],n+"  ");return f}return"68747470"==(l=o(u,r)).substr(0,8)&&(l=xt(l)),"subjectAltName"===e.x509ExtName&&2==F&&(l=xt(l)),f=n+"["+F+"] "+l+"\n"}return n+"UNKNOWN("+u.substr(r,2)+") "+o(u,r)+"\n"},gt.isASN1HEX=function(t){var e=gt;if(t.length%2==1)return!1;var r=e.getVblen(t,0),n=t.substr(0,2),i=e.getL(t,0);return t.length-n.length-i.length==2*r},gt.oidname=function(t){var e=ft.asn1;ft.lang.String.isHex(t)&&(t=e.ASN1Util.oidHexToInt(t));var r=e.x509.OID.oid2name(t);return""===r&&(r=t),r},void 0!==ft&&ft||(ft={}),void 0!==ft.asn1&&ft.asn1||(ft.asn1={}),void 0!==ft.asn1.x509&&ft.asn1.x509||(ft.asn1.x509={}),ft.asn1.x509.Certificate=function(t){ft.asn1.x509.Certificate.superclass.constructor.call(this);var e=ft,r=(e.crypto,e.asn1),n=r.DERSequence,i=r.DERBitString;this.sign=function(){this.asn1SignatureAlg=this.asn1TBSCert.asn1SignatureAlg;var t=new ft.crypto.Signature({alg:this.asn1SignatureAlg.nameAlg});t.init(this.prvKey),t.updateHex(this.asn1TBSCert.getEncodedHex()),this.hexSig=t.sign(),this.asn1Sig=new i({hex:"00"+this.hexSig});var e=new n({array:[this.asn1TBSCert,this.asn1SignatureAlg,this.asn1Sig]});this.hTLV=e.getEncodedHex(),this.isModified=!1},this.setSignatureHex=function(t){this.asn1SignatureAlg=this.asn1TBSCert.asn1SignatureAlg,this.hexSig=t,this.asn1Sig=new i({hex:"00"+this.hexSig});var e=new n({array:[this.asn1TBSCert,this.asn1SignatureAlg,this.asn1Sig]});this.hTLV=e.getEncodedHex(),this.isModified=!1},this.getEncodedHex=function(){if(0==this.isModified&&null!=this.hTLV)return this.hTLV;throw"not signed yet"},this.getPEMString=function(){return"-----BEGIN CERTIFICATE-----\r\n"+Rt(this.getEncodedHex())+"\r\n-----END CERTIFICATE-----\r\n"},void 0!==t&&(void 0!==t.tbscertobj&&(this.asn1TBSCert=t.tbscertobj),void 0!==t.prvkeyobj&&(this.prvKey=t.prvkeyobj))},o.lang.extend(ft.asn1.x509.Certificate,ft.asn1.ASN1Object),ft.asn1.x509.TBSCertificate=function(t){ft.asn1.x509.TBSCertificate.superclass.constructor.call(this);var e=ft.asn1,r=e.DERSequence,n=e.DERInteger,i=e.DERTaggedObject,o=e.x509,s=o.Time,a=o.X500Name,u=o.SubjectPublicKeyInfo;this._initialize=function(){this.asn1Array=new Array,this.asn1Version=new i({obj:new n({int:2})}),this.asn1SerialNumber=null,this.asn1SignatureAlg=null,this.asn1Issuer=null,this.asn1NotBefore=null,this.asn1NotAfter=null,this.asn1Subject=null,this.asn1SubjPKey=null,this.extensionsArray=new Array},this.setSerialNumberByParam=function(t){this.asn1SerialNumber=new n(t)},this.setSignatureAlgByParam=function(t){this.asn1SignatureAlg=new o.AlgorithmIdentifier(t)},this.setIssuerByParam=function(t){this.asn1Issuer=new a(t)},this.setNotBeforeByParam=function(t){this.asn1NotBefore=new s(t)},this.setNotAfterByParam=function(t){this.asn1NotAfter=new s(t)},this.setSubjectByParam=function(t){this.asn1Subject=new a(t)},this.setSubjectPublicKey=function(t){this.asn1SubjPKey=new u(t)},this.setSubjectPublicKeyByGetKey=function(t){var e=Kt.getKey(t);this.asn1SubjPKey=new u(e)},this.appendExtension=function(t){this.extensionsArray.push(t)},this.appendExtensionByName=function(t,e){ft.asn1.x509.Extension.appendByNameToArray(t,e,this.extensionsArray)},this.getEncodedHex=function(){if(null==this.asn1NotBefore||null==this.asn1NotAfter)throw"notBefore and/or notAfter not set";var t=new r({array:[this.asn1NotBefore,this.asn1NotAfter]});if(this.asn1Array=new Array,this.asn1Array.push(this.asn1Version),this.asn1Array.push(this.asn1SerialNumber),this.asn1Array.push(this.asn1SignatureAlg),this.asn1Array.push(this.asn1Issuer),this.asn1Array.push(t),this.asn1Array.push(this.asn1Subject),this.asn1Array.push(this.asn1SubjPKey),this.extensionsArray.length>0){var e=new r({array:this.extensionsArray}),n=new i({explicit:!0,tag:"a3",obj:e});this.asn1Array.push(n)}var o=new r({array:this.asn1Array});return this.hTLV=o.getEncodedHex(),this.isModified=!1,this.hTLV},this._initialize()},o.lang.extend(ft.asn1.x509.TBSCertificate,ft.asn1.ASN1Object),ft.asn1.x509.Extension=function(t){ft.asn1.x509.Extension.superclass.constructor.call(this);var e=ft.asn1,r=e.DERObjectIdentifier,n=e.DEROctetString,i=(e.DERBitString,e.DERBoolean),o=e.DERSequence;this.getEncodedHex=function(){var t=new r({oid:this.oid}),e=new n({hex:this.getExtnValueHex()}),s=new Array;return s.push(t),this.critical&&s.push(new i),s.push(e),new o({array:s}).getEncodedHex()},this.critical=!1,void 0!==t&&void 0!==t.critical&&(this.critical=t.critical)},o.lang.extend(ft.asn1.x509.Extension,ft.asn1.ASN1Object),ft.asn1.x509.Extension.appendByNameToArray=function(t,e,r){var n=t.toLowerCase(),i=ft.asn1.x509;if("basicconstraints"==n){var o=new i.BasicConstraints(e);r.push(o)}else if("keyusage"==n){o=new i.KeyUsage(e);r.push(o)}else if("crldistributionpoints"==n){o=new i.CRLDistributionPoints(e);r.push(o)}else if("extkeyusage"==n){o=new i.ExtKeyUsage(e);r.push(o)}else if("authoritykeyidentifier"==n){o=new i.AuthorityKeyIdentifier(e);r.push(o)}else if("authorityinfoaccess"==n){o=new i.AuthorityInfoAccess(e);r.push(o)}else if("subjectaltname"==n){o=new i.SubjectAltName(e);r.push(o)}else{if("issueraltname"!=n)throw"unsupported extension name: "+t;o=new i.IssuerAltName(e);r.push(o)}},ft.asn1.x509.KeyUsage=function(t){ft.asn1.x509.KeyUsage.superclass.constructor.call(this,t);var e=zt.KEYUSAGE_NAME;if(this.getExtnValueHex=function(){return this.asn1ExtnValue.getEncodedHex()},this.oid="2.5.29.15",void 0!==t&&(void 0!==t.bin&&(this.asn1ExtnValue=new ft.asn1.DERBitString(t)),void 0!==t.names&&void 0!==t.names.length)){for(var r=t.names,n="000000000",i=0;i<r.length;i++)for(var o=0;o<e.length;o++)r[i]===e[o]&&(n=n.substring(0,o)+"1"+n.substring(o+1,n.length));this.asn1ExtnValue=new ft.asn1.DERBitString({bin:n})}},o.lang.extend(ft.asn1.x509.KeyUsage,ft.asn1.x509.Extension),ft.asn1.x509.BasicConstraints=function(t){ft.asn1.x509.BasicConstraints.superclass.constructor.call(this,t);this.getExtnValueHex=function(){var t=new Array;this.cA&&t.push(new ft.asn1.DERBoolean),this.pathLen>-1&&t.push(new ft.asn1.DERInteger({int:this.pathLen}));var e=new ft.asn1.DERSequence({array:t});return this.asn1ExtnValue=e,this.asn1ExtnValue.getEncodedHex()},this.oid="2.5.29.19",this.cA=!1,this.pathLen=-1,void 0!==t&&(void 0!==t.cA&&(this.cA=t.cA),void 0!==t.pathLen&&(this.pathLen=t.pathLen))},o.lang.extend(ft.asn1.x509.BasicConstraints,ft.asn1.x509.Extension),ft.asn1.x509.CRLDistributionPoints=function(t){ft.asn1.x509.CRLDistributionPoints.superclass.constructor.call(this,t);var e=ft.asn1,r=e.x509;this.getExtnValueHex=function(){return this.asn1ExtnValue.getEncodedHex()},this.setByDPArray=function(t){this.asn1ExtnValue=new e.DERSequence({array:t})},this.setByOneURI=function(t){var e=new r.GeneralNames([{uri:t}]),n=new r.DistributionPointName(e),i=new r.DistributionPoint({dpobj:n});this.setByDPArray([i])},this.oid="2.5.29.31",void 0!==t&&(void 0!==t.array?this.setByDPArray(t.array):void 0!==t.uri&&this.setByOneURI(t.uri))},o.lang.extend(ft.asn1.x509.CRLDistributionPoints,ft.asn1.x509.Extension),ft.asn1.x509.ExtKeyUsage=function(t){ft.asn1.x509.ExtKeyUsage.superclass.constructor.call(this,t);var e=ft.asn1;this.setPurposeArray=function(t){this.asn1ExtnValue=new e.DERSequence;for(var r=0;r<t.length;r++){var n=new e.DERObjectIdentifier(t[r]);this.asn1ExtnValue.appendASN1Object(n)}},this.getExtnValueHex=function(){return this.asn1ExtnValue.getEncodedHex()},this.oid="2.5.29.37",void 0!==t&&void 0!==t.array&&this.setPurposeArray(t.array)},o.lang.extend(ft.asn1.x509.ExtKeyUsage,ft.asn1.x509.Extension),ft.asn1.x509.AuthorityKeyIdentifier=function(t){ft.asn1.x509.AuthorityKeyIdentifier.superclass.constructor.call(this,t);var e=ft.asn1,r=e.DERTaggedObject;this.asn1KID=null,this.asn1CertIssuer=null,this.asn1CertSN=null,this.getExtnValueHex=function(){var t=new Array;this.asn1KID&&t.push(new r({explicit:!1,tag:"80",obj:this.asn1KID})),this.asn1CertIssuer&&t.push(new r({explicit:!1,tag:"a1",obj:this.asn1CertIssuer})),this.asn1CertSN&&t.push(new r({explicit:!1,tag:"82",obj:this.asn1CertSN}));var n=new e.DERSequence({array:t});return this.asn1ExtnValue=n,this.asn1ExtnValue.getEncodedHex()},this.setKIDByParam=function(t){this.asn1KID=new ft.asn1.DEROctetString(t)},this.setCertIssuerByParam=function(t){this.asn1CertIssuer=new ft.asn1.x509.X500Name(t)},this.setCertSNByParam=function(t){this.asn1CertSN=new ft.asn1.DERInteger(t)},this.oid="2.5.29.35",void 0!==t&&(void 0!==t.kid&&this.setKIDByParam(t.kid),void 0!==t.issuer&&this.setCertIssuerByParam(t.issuer),void 0!==t.sn&&this.setCertSNByParam(t.sn))},o.lang.extend(ft.asn1.x509.AuthorityKeyIdentifier,ft.asn1.x509.Extension),ft.asn1.x509.AuthorityInfoAccess=function(t){ft.asn1.x509.AuthorityInfoAccess.superclass.constructor.call(this,t),this.setAccessDescriptionArray=function(t){for(var e=new Array,r=ft.asn1,n=r.DERSequence,i=0;i<t.length;i++){var o=new n({array:[new r.DERObjectIdentifier(t[i].accessMethod),new r.x509.GeneralName(t[i].accessLocation)]});e.push(o)}this.asn1ExtnValue=new n({array:e})},this.getExtnValueHex=function(){return this.asn1ExtnValue.getEncodedHex()},this.oid="1.3.6.1.5.5.7.1.1",void 0!==t&&void 0!==t.array&&this.setAccessDescriptionArray(t.array)},o.lang.extend(ft.asn1.x509.AuthorityInfoAccess,ft.asn1.x509.Extension),ft.asn1.x509.SubjectAltName=function(t){ft.asn1.x509.SubjectAltName.superclass.constructor.call(this,t),this.setNameArray=function(t){this.asn1ExtnValue=new ft.asn1.x509.GeneralNames(t)},this.getExtnValueHex=function(){return this.asn1ExtnValue.getEncodedHex()},this.oid="2.5.29.17",void 0!==t&&void 0!==t.array&&this.setNameArray(t.array)},o.lang.extend(ft.asn1.x509.SubjectAltName,ft.asn1.x509.Extension),ft.asn1.x509.IssuerAltName=function(t){ft.asn1.x509.IssuerAltName.superclass.constructor.call(this,t),this.setNameArray=function(t){this.asn1ExtnValue=new ft.asn1.x509.GeneralNames(t)},this.getExtnValueHex=function(){return this.asn1ExtnValue.getEncodedHex()},this.oid="2.5.29.18",void 0!==t&&void 0!==t.array&&this.setNameArray(t.array)},o.lang.extend(ft.asn1.x509.IssuerAltName,ft.asn1.x509.Extension),ft.asn1.x509.CRL=function(t){ft.asn1.x509.CRL.superclass.constructor.call(this);this.sign=function(){this.asn1SignatureAlg=this.asn1TBSCertList.asn1SignatureAlg,sig=new ft.crypto.Signature({alg:"SHA1withRSA",prov:"cryptojs/jsrsa"}),sig.init(this.prvKey),sig.updateHex(this.asn1TBSCertList.getEncodedHex()),this.hexSig=sig.sign(),this.asn1Sig=new ft.asn1.DERBitString({hex:"00"+this.hexSig});var t=new ft.asn1.DERSequence({array:[this.asn1TBSCertList,this.asn1SignatureAlg,this.asn1Sig]});this.hTLV=t.getEncodedHex(),this.isModified=!1},this.getEncodedHex=function(){if(0==this.isModified&&null!=this.hTLV)return this.hTLV;throw"not signed yet"},this.getPEMString=function(){return"-----BEGIN X509 CRL-----\r\n"+Rt(this.getEncodedHex())+"\r\n-----END X509 CRL-----\r\n"},void 0!==t&&(void 0!==t.tbsobj&&(this.asn1TBSCertList=t.tbsobj),void 0!==t.prvkeyobj&&(this.prvKey=t.prvkeyobj))},o.lang.extend(ft.asn1.x509.CRL,ft.asn1.ASN1Object),ft.asn1.x509.TBSCertList=function(t){ft.asn1.x509.TBSCertList.superclass.constructor.call(this);var e=ft.asn1,r=e.DERSequence,n=e.x509,i=n.Time;this.setSignatureAlgByParam=function(t){this.asn1SignatureAlg=new n.AlgorithmIdentifier(t)},this.setIssuerByParam=function(t){this.asn1Issuer=new n.X500Name(t)},this.setThisUpdateByParam=function(t){this.asn1ThisUpdate=new i(t)},this.setNextUpdateByParam=function(t){this.asn1NextUpdate=new i(t)},this.addRevokedCert=function(t,e){var r={};void 0!=t&&null!=t&&(r.sn=t),void 0!=e&&null!=e&&(r.time=e);var i=new n.CRLEntry(r);this.aRevokedCert.push(i)},this.getEncodedHex=function(){if(this.asn1Array=new Array,null!=this.asn1Version&&this.asn1Array.push(this.asn1Version),this.asn1Array.push(this.asn1SignatureAlg),this.asn1Array.push(this.asn1Issuer),this.asn1Array.push(this.asn1ThisUpdate),null!=this.asn1NextUpdate&&this.asn1Array.push(this.asn1NextUpdate),this.aRevokedCert.length>0){var t=new r({array:this.aRevokedCert});this.asn1Array.push(t)}var e=new r({array:this.asn1Array});return this.hTLV=e.getEncodedHex(),this.isModified=!1,this.hTLV},this._initialize=function(){this.asn1Version=null,this.asn1SignatureAlg=null,this.asn1Issuer=null,this.asn1ThisUpdate=null,this.asn1NextUpdate=null,this.aRevokedCert=new Array},this._initialize()},o.lang.extend(ft.asn1.x509.TBSCertList,ft.asn1.ASN1Object),ft.asn1.x509.CRLEntry=function(t){ft.asn1.x509.CRLEntry.superclass.constructor.call(this);var e=ft.asn1;this.setCertSerial=function(t){this.sn=new e.DERInteger(t)},this.setRevocationDate=function(t){this.time=new e.x509.Time(t)},this.getEncodedHex=function(){var t=new e.DERSequence({array:[this.sn,this.time]});return this.TLV=t.getEncodedHex(),this.TLV},void 0!==t&&(void 0!==t.time&&this.setRevocationDate(t.time),void 0!==t.sn&&this.setCertSerial(t.sn))},o.lang.extend(ft.asn1.x509.CRLEntry,ft.asn1.ASN1Object),ft.asn1.x509.X500Name=function(t){ft.asn1.x509.X500Name.superclass.constructor.call(this),this.asn1Array=new Array;var e=ft.asn1,n=e.x509,i=Dt;if(this.setByString=function(t){var e=t.split("/");e.shift();for(var r=[],i=0;i<e.length;i++)if(e[i].match(/^[^=]+=.+$/))r.push(e[i]);else{var o=r.length-1;r[o]=r[o]+"/"+e[i]}for(i=0;i<r.length;i++)this.asn1Array.push(new n.RDN({str:r[i]}))},this.setByLdapString=function(t){var e=n.X500Name.ldapToOneline(t);this.setByString(e)},this.setByObject=function(t){for(var e in t)if(t.hasOwnProperty(e)){var r=new ft.asn1.x509.RDN({str:e+"="+t[e]});this.asn1Array?this.asn1Array.push(r):this.asn1Array=[r]}},this.getEncodedHex=function(){if("string"==typeof this.hTLV)return this.hTLV;var t=new e.DERSequence({array:this.asn1Array});return this.hTLV=t.getEncodedHex(),this.hTLV},void 0!==t){var o;if(void 0!==t.str?this.setByString(t.str):void 0!==t.ldapstr?this.setByLdapString(t.ldapstr):"object"===(void 0===t?"undefined":r(t))&&this.setByObject(t),void 0!==t.certissuer)(o=new zt).hex=i(t.certissuer),this.hTLV=o.getIssuerHex();if(void 0!==t.certsubject)(o=new zt).hex=i(t.certsubject),this.hTLV=o.getSubjectHex()}},o.lang.extend(ft.asn1.x509.X500Name,ft.asn1.ASN1Object),ft.asn1.x509.X500Name.onelineToLDAP=function(t){if("/"!==t.substr(0,1))throw"malformed input";var e=(t=t.substr(1)).split("/");return e.reverse(),(e=e.map(function(t){return t.replace(/,/,"\\,")})).join(",")},ft.asn1.x509.X500Name.ldapToOneline=function(t){for(var e=t.split(","),r=!1,n=[],i=0;e.length>0;i++){var o=e.shift();if(!0===r){var s=(n.pop()+","+o).replace(/\\,/g,",");n.push(s),r=!1}else n.push(o);"\\"===o.substr(-1,1)&&(r=!0)}return(n=n.map(function(t){return t.replace("/","\\/")})).reverse(),"/"+n.join("/")},ft.asn1.x509.RDN=function(t){ft.asn1.x509.RDN.superclass.constructor.call(this),this.asn1Array=new Array,this.addByString=function(t){this.asn1Array.push(new ft.asn1.x509.AttributeTypeAndValue({str:t}))},this.addByMultiValuedString=function(t){for(var e=ft.asn1.x509.RDN.parseString(t),r=0;r<e.length;r++)this.addByString(e[r])},this.getEncodedHex=function(){var t=new ft.asn1.DERSet({array:this.asn1Array});return this.TLV=t.getEncodedHex(),this.TLV},void 0!==t&&void 0!==t.str&&this.addByMultiValuedString(t.str)},o.lang.extend(ft.asn1.x509.RDN,ft.asn1.ASN1Object),ft.asn1.x509.RDN.parseString=function(t){for(var e=t.split(/\+/),r=!1,n=[],i=0;e.length>0;i++){var o=e.shift();if(!0===r){var s=(n.pop()+"+"+o).replace(/\\\+/g,"+");n.push(s),r=!1}else n.push(o);"\\"===o.substr(-1,1)&&(r=!0)}var a=!1,u=[];for(i=0;n.length>0;i++){o=n.shift();if(!0===a){var c=u.pop();if(o.match(/"$/)){s=(c+"+"+o).replace(/^([^=]+)="(.*)"$/,"$1=$2");u.push(s),a=!1}else u.push(c+"+"+o)}else u.push(o);o.match(/^[^=]+="/)&&(a=!0)}return u},ft.asn1.x509.AttributeTypeAndValue=function(t){ft.asn1.x509.AttributeTypeAndValue.superclass.constructor.call(this);var e=ft.asn1;this.setByString=function(t){var e=t.match(/^([^=]+)=(.+)$/);if(!e)throw"malformed attrTypeAndValueStr: "+t;this.setByAttrTypeAndValueStr(e[1],e[2])},this.setByAttrTypeAndValueStr=function(t,e){this.typeObj=ft.asn1.x509.OID.atype2obj(t);var r="utf8";"C"==t&&(r="prn"),this.valueObj=this.getValueObj(r,e)},this.getValueObj=function(t,r){if("utf8"==t)return new e.DERUTF8String({str:r});if("prn"==t)return new e.DERPrintableString({str:r});if("tel"==t)return new e.DERTeletexString({str:r});if("ia5"==t)return new e.DERIA5String({str:r});throw"unsupported directory string type: type="+t+" value="+r},this.getEncodedHex=function(){var t=new e.DERSequence({array:[this.typeObj,this.valueObj]});return this.TLV=t.getEncodedHex(),this.TLV},void 0!==t&&void 0!==t.str&&this.setByString(t.str)},o.lang.extend(ft.asn1.x509.AttributeTypeAndValue,ft.asn1.ASN1Object),ft.asn1.x509.SubjectPublicKeyInfo=function(t){ft.asn1.x509.SubjectPublicKeyInfo.superclass.constructor.call(this);var e=ft,r=e.asn1,n=r.DERInteger,i=r.DERBitString,o=r.DERObjectIdentifier,s=r.DERSequence,a=r.ASN1Util.newObject,u=r.x509.AlgorithmIdentifier,c=e.crypto;c.ECDSA,c.DSA;this.getASN1Object=function(){if(null==this.asn1AlgId||null==this.asn1SubjPKey)throw"algId and/or subjPubKey not set";return new s({array:[this.asn1AlgId,this.asn1SubjPKey]})},this.getEncodedHex=function(){var t=this.getASN1Object();return this.hTLV=t.getEncodedHex(),this.hTLV},this.setPubKey=function(t){try{if(t instanceof at){var e=a({seq:[{int:{bigint:t.n}},{int:{int:t.e}}]}).getEncodedHex();this.asn1AlgId=new u({name:"rsaEncryption"}),this.asn1SubjPKey=new i({hex:"00"+e})}}catch(t){}try{if(t instanceof ft.crypto.ECDSA){var r=new o({name:t.curveName});this.asn1AlgId=new u({name:"ecPublicKey",asn1params:r}),this.asn1SubjPKey=new i({hex:"00"+t.pubKeyHex})}}catch(t){}try{if(t instanceof ft.crypto.DSA){r=new a({seq:[{int:{bigint:t.p}},{int:{bigint:t.q}},{int:{bigint:t.g}}]});this.asn1AlgId=new u({name:"dsa",asn1params:r});var s=new n({bigint:t.y});this.asn1SubjPKey=new i({hex:"00"+s.getEncodedHex()})}}catch(t){}},void 0!==t&&this.setPubKey(t)},o.lang.extend(ft.asn1.x509.SubjectPublicKeyInfo,ft.asn1.ASN1Object),ft.asn1.x509.Time=function(t){ft.asn1.x509.Time.superclass.constructor.call(this);var e=ft.asn1,r=e.DERUTCTime,n=e.DERGeneralizedTime;this.setTimeParams=function(t){this.timeParams=t},this.getEncodedHex=function(){var t=null;return t=null!=this.timeParams?"utc"==this.type?new r(this.timeParams):new n(this.timeParams):"utc"==this.type?new r:new n,this.TLV=t.getEncodedHex(),this.TLV},this.type="utc",void 0!==t&&(void 0!==t.type?this.type=t.type:void 0!==t.str&&(t.str.match(/^[0-9]{12}Z$/)&&(this.type="utc"),t.str.match(/^[0-9]{14}Z$/)&&(this.type="gen")),this.timeParams=t)},o.lang.extend(ft.asn1.x509.Time,ft.asn1.ASN1Object),ft.asn1.x509.AlgorithmIdentifier=function(t){ft.asn1.x509.AlgorithmIdentifier.superclass.constructor.call(this),this.nameAlg=null,this.asn1Alg=null,this.asn1Params=null,this.paramEmpty=!1;var e=ft.asn1;if(this.getEncodedHex=function(){if(null===this.nameAlg&&null===this.asn1Alg)throw"algorithm not specified";null!==this.nameAlg&&null===this.asn1Alg&&(this.asn1Alg=e.x509.OID.name2obj(this.nameAlg));var t=[this.asn1Alg];null!==this.asn1Params&&t.push(this.asn1Params);var r=new e.DERSequence({array:t});return this.hTLV=r.getEncodedHex(),this.hTLV},void 0!==t&&(void 0!==t.name&&(this.nameAlg=t.name),void 0!==t.asn1params&&(this.asn1Params=t.asn1params),void 0!==t.paramempty&&(this.paramEmpty=t.paramempty)),null===this.asn1Params&&!1===this.paramEmpty&&null!==this.nameAlg){var r=this.nameAlg.toLowerCase();"withdsa"!==r.substr(-7,7)&&"withecdsa"!==r.substr(-9,9)&&(this.asn1Params=new e.DERNull)}},o.lang.extend(ft.asn1.x509.AlgorithmIdentifier,ft.asn1.ASN1Object),ft.asn1.x509.GeneralName=function(t){ft.asn1.x509.GeneralName.superclass.constructor.call(this);var e={rfc822:"81",dns:"82",dn:"a4",uri:"86",ip:"87"},r=ft.asn1,n=(r.DERSequence,r.DEROctetString),i=r.DERIA5String,o=r.DERTaggedObject,s=r.ASN1Object,a=r.x509.X500Name,u=Dt;this.explicit=!1,this.setByParam=function(t){var r=null;if(void 0!==t){if(void 0!==t.rfc822&&(this.type="rfc822",r=new i({str:t[this.type]})),void 0!==t.dns&&(this.type="dns",r=new i({str:t[this.type]})),void 0!==t.uri&&(this.type="uri",r=new i({str:t[this.type]})),void 0!==t.dn&&(this.type="dn",this.explicit=!0,r=new a({str:t.dn})),void 0!==t.ldapdn&&(this.type="dn",this.explicit=!0,r=new a({ldapstr:t.ldapdn})),void 0!==t.certissuer){this.type="dn",this.explicit=!0;var c=null;if((l=t.certissuer).match(/^[0-9A-Fa-f]+$/),-1!=l.indexOf("-----BEGIN ")&&(c=u(l)),null==c)throw"certissuer param not cert";(f=new zt).hex=c;var h=f.getIssuerHex();(r=new s).hTLV=h}if(void 0!==t.certsubj){this.type="dn",this.explicit=!0;var l,f;c=null;if((l=t.certsubj).match(/^[0-9A-Fa-f]+$/),-1!=l.indexOf("-----BEGIN ")&&(c=u(l)),null==c)throw"certsubj param not cert";(f=new zt).hex=c;h=f.getSubjectHex();(r=new s).hTLV=h}if(void 0!==t.ip){this.type="ip",this.explicit=!1;var d,p=t.ip,g="malformed IP address";if(p.match(/^[0-9.]+[.][0-9.]+$/)){if(8!==(d=Vt("["+p.split(".").join(",")+"]")).length)throw g}else if(p.match(/^[0-9A-Fa-f:]+:[0-9A-Fa-f:]+$/))d=Lt(p);else{if(!p.match(/^([0-9A-Fa-f][0-9A-Fa-f]){1,}$/))throw g;d=p}r=new n({hex:d})}if(null==this.type)throw"unsupported type in params="+t;this.asn1Obj=new o({explicit:this.explicit,tag:e[this.type],obj:r})}},this.getEncodedHex=function(){return this.asn1Obj.getEncodedHex()},void 0!==t&&this.setByParam(t)},o.lang.extend(ft.asn1.x509.GeneralName,ft.asn1.ASN1Object),ft.asn1.x509.GeneralNames=function(t){ft.asn1.x509.GeneralNames.superclass.constructor.call(this);var e=ft.asn1;this.setByParamArray=function(t){for(var r=0;r<t.length;r++){var n=new e.x509.GeneralName(t[r]);this.asn1Array.push(n)}},this.getEncodedHex=function(){return new e.DERSequence({array:this.asn1Array}).getEncodedHex()},this.asn1Array=new Array,void 0!==t&&this.setByParamArray(t)},o.lang.extend(ft.asn1.x509.GeneralNames,ft.asn1.ASN1Object),ft.asn1.x509.DistributionPointName=function(t){ft.asn1.x509.DistributionPointName.superclass.constructor.call(this);var e=ft.asn1,r=e.DERTaggedObject;if(this.getEncodedHex=function(){if("full"!=this.type)throw"currently type shall be 'full': "+this.type;return this.asn1Obj=new r({explicit:!1,tag:this.tag,obj:this.asn1V}),this.hTLV=this.asn1Obj.getEncodedHex(),this.hTLV},void 0!==t){if(!e.x509.GeneralNames.prototype.isPrototypeOf(t))throw"This class supports GeneralNames only as argument";this.type="full",this.tag="a0",this.asn1V=t}},o.lang.extend(ft.asn1.x509.DistributionPointName,ft.asn1.ASN1Object),ft.asn1.x509.DistributionPoint=function(t){ft.asn1.x509.DistributionPoint.superclass.constructor.call(this);var e=ft.asn1;this.getEncodedHex=function(){var t=new e.DERSequence;if(null!=this.asn1DP){var r=new e.DERTaggedObject({explicit:!0,tag:"a0",obj:this.asn1DP});t.appendASN1Object(r)}return this.hTLV=t.getEncodedHex(),this.hTLV},void 0!==t&&void 0!==t.dpobj&&(this.asn1DP=t.dpobj)},o.lang.extend(ft.asn1.x509.DistributionPoint,ft.asn1.ASN1Object),ft.asn1.x509.OID=new function(t){this.atype2oidList={CN:"2.5.4.3",L:"2.5.4.7",ST:"2.5.4.8",O:"2.5.4.10",OU:"2.5.4.11",C:"2.5.4.6",STREET:"2.5.4.9",DC:"0.9.2342.19200300.100.1.25",UID:"0.9.2342.19200300.100.1.1",SN:"2.5.4.4",T:"2.5.4.12",DN:"2.5.4.49",E:"1.2.840.113549.1.9.1",description:"2.5.4.13",businessCategory:"2.5.4.15",postalCode:"2.5.4.17",serialNumber:"2.5.4.5",uniqueIdentifier:"2.5.4.45",organizationIdentifier:"2.5.4.97",jurisdictionOfIncorporationL:"1.3.6.1.4.1.311.60.2.1.1",jurisdictionOfIncorporationSP:"1.3.6.1.4.1.311.60.2.1.2",jurisdictionOfIncorporationC:"1.3.6.1.4.1.311.60.2.1.3"},this.name2oidList={sha1:"1.3.14.3.2.26",sha256:"2.16.840.1.101.3.4.2.1",sha384:"2.16.840.1.101.3.4.2.2",sha512:"2.16.840.1.101.3.4.2.3",sha224:"2.16.840.1.101.3.4.2.4",md5:"1.2.840.113549.2.5",md2:"1.3.14.7.2.2.1",ripemd160:"1.3.36.3.2.1",MD2withRSA:"1.2.840.113549.1.1.2",MD4withRSA:"1.2.840.113549.1.1.3",MD5withRSA:"1.2.840.113549.1.1.4",SHA1withRSA:"1.2.840.113549.1.1.5",SHA224withRSA:"1.2.840.113549.1.1.14",SHA256withRSA:"1.2.840.113549.1.1.11",SHA384withRSA:"1.2.840.113549.1.1.12",SHA512withRSA:"1.2.840.113549.1.1.13",SHA1withECDSA:"1.2.840.10045.4.1",SHA224withECDSA:"1.2.840.10045.4.3.1",SHA256withECDSA:"1.2.840.10045.4.3.2",SHA384withECDSA:"1.2.840.10045.4.3.3",SHA512withECDSA:"1.2.840.10045.4.3.4",dsa:"1.2.840.10040.4.1",SHA1withDSA:"1.2.840.10040.4.3",SHA224withDSA:"2.16.840.1.101.3.4.3.1",SHA256withDSA:"2.16.840.1.101.3.4.3.2",rsaEncryption:"1.2.840.113549.1.1.1",commonName:"2.5.4.3",countryName:"2.5.4.6",localityName:"2.5.4.7",stateOrProvinceName:"2.5.4.8",streetAddress:"2.5.4.9",organizationName:"2.5.4.10",organizationalUnitName:"2.5.4.11",domainComponent:"0.9.2342.19200300.100.1.25",userId:"0.9.2342.19200300.100.1.1",surname:"2.5.4.4",title:"2.5.4.12",distinguishedName:"2.5.4.49",emailAddress:"1.2.840.113549.1.9.1",description:"2.5.4.13",businessCategory:"2.5.4.15",postalCode:"2.5.4.17",uniqueIdentifier:"2.5.4.45",organizationIdentifier:"2.5.4.97",jurisdictionOfIncorporationL:"1.3.6.1.4.1.311.60.2.1.1",jurisdictionOfIncorporationSP:"1.3.6.1.4.1.311.60.2.1.2",jurisdictionOfIncorporationC:"1.3.6.1.4.1.311.60.2.1.3",subjectKeyIdentifier:"2.5.29.14",keyUsage:"2.5.29.15",subjectAltName:"2.5.29.17",issuerAltName:"2.5.29.18",basicConstraints:"2.5.29.19",nameConstraints:"2.5.29.30",cRLDistributionPoints:"2.5.29.31",certificatePolicies:"2.5.29.32",authorityKeyIdentifier:"2.5.29.35",policyConstraints:"2.5.29.36",extKeyUsage:"2.5.29.37",authorityInfoAccess:"1.3.6.1.5.5.7.1.1",ocsp:"1.3.6.1.5.5.7.48.1",caIssuers:"1.3.6.1.5.5.7.48.2",anyExtendedKeyUsage:"2.5.29.37.0",serverAuth:"1.3.6.1.5.5.7.3.1",clientAuth:"1.3.6.1.5.5.7.3.2",codeSigning:"1.3.6.1.5.5.7.3.3",emailProtection:"1.3.6.1.5.5.7.3.4",timeStamping:"1.3.6.1.5.5.7.3.8",ocspSigning:"1.3.6.1.5.5.7.3.9",ecPublicKey:"1.2.840.10045.2.1",secp256r1:"1.2.840.10045.3.1.7",secp256k1:"1.3.132.0.10",secp384r1:"1.3.132.0.34",pkcs5PBES2:"1.2.840.113549.1.5.13",pkcs5PBKDF2:"1.2.840.113549.1.5.12","des-EDE3-CBC":"1.2.840.113549.3.7",data:"1.2.840.113549.1.7.1","signed-data":"1.2.840.113549.1.7.2","enveloped-data":"1.2.840.113549.1.7.3","digested-data":"1.2.840.113549.1.7.5","encrypted-data":"1.2.840.113549.1.7.6","authenticated-data":"1.2.840.113549.1.9.16.1.2",tstinfo:"1.2.840.113549.1.9.16.1.4",extensionRequest:"1.2.840.113549.1.9.14"},this.objCache={},this.name2obj=function(t){if(void 0!==this.objCache[t])return this.objCache[t];if(void 0===this.name2oidList[t])throw"Name of ObjectIdentifier not defined: "+t;var e=this.name2oidList[t],r=new ft.asn1.DERObjectIdentifier({oid:e});return this.objCache[t]=r,r},this.atype2obj=function(t){if(void 0!==this.objCache[t])return this.objCache[t];if(void 0===this.atype2oidList[t])throw"AttributeType name undefined: "+t;var e=this.atype2oidList[t],r=new ft.asn1.DERObjectIdentifier({oid:e});return this.objCache[t]=r,r}},ft.asn1.x509.OID.oid2name=function(t){var e=ft.asn1.x509.OID.name2oidList;for(var r in e)if(e[r]==t)return r;return""},ft.asn1.x509.OID.oid2atype=function(t){var e=ft.asn1.x509.OID.atype2oidList;for(var r in e)if(e[r]==t)return r;return t},ft.asn1.x509.OID.name2oid=function(t){var e=ft.asn1.x509.OID.name2oidList;return void 0===e[t]?"":e[t]},ft.asn1.x509.X509Util={},ft.asn1.x509.X509Util.newCertPEM=function(t){var e=ft.asn1.x509,r=e.TBSCertificate,n=e.Certificate,i=new r;if(void 0===t.serial)throw"serial number undefined.";if(i.setSerialNumberByParam(t.serial),"string"!=typeof t.sigalg.name)throw"unproper signature algorithm name";if(i.setSignatureAlgByParam(t.sigalg),void 0===t.issuer)throw"issuer name undefined.";if(i.setIssuerByParam(t.issuer),void 0===t.notbefore)throw"notbefore undefined.";if(i.setNotBeforeByParam(t.notbefore),void 0===t.notafter)throw"notafter undefined.";if(i.setNotAfterByParam(t.notafter),void 0===t.subject)throw"subject name undefined.";if(i.setSubjectByParam(t.subject),void 0===t.sbjpubkey)throw"subject public key undefined.";if(i.setSubjectPublicKeyByGetKey(t.sbjpubkey),void 0!==t.ext&&void 0!==t.ext.length)for(var o=0;o<t.ext.length;o++)for(key in t.ext[o])i.appendExtensionByName(key,t.ext[o][key]);if(void 0===t.cakey&&void 0===t.sighex)throw"param cakey and sighex undefined.";var s=null;return t.cakey&&(s=new n({tbscertobj:i,prvkeyobj:!0===t.cakey.isPrivate?t.cakey:Kt.getKey.apply(null,t.cakey)})).sign(),t.sighex&&(s=new n({tbscertobj:i})).setSignatureHex(t.sighex),s.getPEMString()},void 0!==ft&&ft||(ft={}),void 0!==ft.lang&&ft.lang||(ft.lang={}),ft.lang.String=function(){},"function"==typeof t?(dt=function(e){return bt(new t(e,"utf8").toString("base64"))},pt=function(e){return new t(wt(e),"base64").toString("utf8")}):(dt=function(t){return Ft(Bt(Ut(t)))},pt=function(t){return decodeURIComponent(jt(_t(t)))}),ft.lang.String.isInteger=function(t){return!!t.match(/^[0-9]+$/)||!!t.match(/^-[0-9]+$/)},ft.lang.String.isHex=function(t){return!(t.length%2!=0||!t.match(/^[0-9a-f]+$/)&&!t.match(/^[0-9A-F]+$/))},ft.lang.String.isBase64=function(t){return!(!(t=t.replace(/\s+/g,"")).match(/^[0-9A-Za-z+\/]+={0,3}$/)||t.length%4!=0)},ft.lang.String.isBase64URL=function(t){return!t.match(/[+/=]/)&&(t=wt(t),ft.lang.String.isBase64(t))},ft.lang.String.isIntegerArray=function(t){return!!(t=t.replace(/\s+/g,"")).match(/^\[[0-9,]+\]$/)};void 0!==ft&&ft||(ft={}),void 0!==ft.crypto&&ft.crypto||(ft.crypto={}),ft.crypto.Util=new function(){this.DIGESTINFOHEAD={sha1:"3021300906052b0e03021a05000414",sha224:"302d300d06096086480165030402040500041c",sha256:"3031300d060960864801650304020105000420",sha384:"3041300d060960864801650304020205000430",sha512:"3051300d060960864801650304020305000440",md2:"3020300c06082a864886f70d020205000410",md5:"3020300c06082a864886f70d020505000410",ripemd160:"3021300906052b2403020105000414"},this.DEFAULTPROVIDER={md5:"cryptojs",sha1:"cryptojs",sha224:"cryptojs",sha256:"cryptojs",sha384:"cryptojs",sha512:"cryptojs",ripemd160:"cryptojs",hmacmd5:"cryptojs",hmacsha1:"cryptojs",hmacsha224:"cryptojs",hmacsha256:"cryptojs",hmacsha384:"cryptojs",hmacsha512:"cryptojs",hmacripemd160:"cryptojs",MD5withRSA:"cryptojs/jsrsa",SHA1withRSA:"cryptojs/jsrsa",SHA224withRSA:"cryptojs/jsrsa",SHA256withRSA:"cryptojs/jsrsa",SHA384withRSA:"cryptojs/jsrsa",SHA512withRSA:"cryptojs/jsrsa",RIPEMD160withRSA:"cryptojs/jsrsa",MD5withECDSA:"cryptojs/jsrsa",SHA1withECDSA:"cryptojs/jsrsa",SHA224withECDSA:"cryptojs/jsrsa",SHA256withECDSA:"cryptojs/jsrsa",SHA384withECDSA:"cryptojs/jsrsa",SHA512withECDSA:"cryptojs/jsrsa",RIPEMD160withECDSA:"cryptojs/jsrsa",SHA1withDSA:"cryptojs/jsrsa",SHA224withDSA:"cryptojs/jsrsa",SHA256withDSA:"cryptojs/jsrsa",MD5withRSAandMGF1:"cryptojs/jsrsa",SHA1withRSAandMGF1:"cryptojs/jsrsa",SHA224withRSAandMGF1:"cryptojs/jsrsa",SHA256withRSAandMGF1:"cryptojs/jsrsa",SHA384withRSAandMGF1:"cryptojs/jsrsa",SHA512withRSAandMGF1:"cryptojs/jsrsa",RIPEMD160withRSAandMGF1:"cryptojs/jsrsa"},this.CRYPTOJSMESSAGEDIGESTNAME={md5:y.algo.MD5,sha1:y.algo.SHA1,sha224:y.algo.SHA224,sha256:y.algo.SHA256,sha384:y.algo.SHA384,sha512:y.algo.SHA512,ripemd160:y.algo.RIPEMD160},this.getDigestInfoHex=function(t,e){if(void 0===this.DIGESTINFOHEAD[e])throw"alg not supported in Util.DIGESTINFOHEAD: "+e;return this.DIGESTINFOHEAD[e]+t},this.getPaddedDigestInfoHex=function(t,e,r){var n=this.getDigestInfoHex(t,e),i=r/4;if(n.length+22>i)throw"key is too short for SigAlg: keylen="+r+","+e;for(var o="0001",s="00"+n,a="",u=i-o.length-s.length,c=0;c<u;c+=2)a+="ff";return o+a+s},this.hashString=function(t,e){return new ft.crypto.MessageDigest({alg:e}).digestString(t)},this.hashHex=function(t,e){return new ft.crypto.MessageDigest({alg:e}).digestHex(t)},this.sha1=function(t){return new ft.crypto.MessageDigest({alg:"sha1",prov:"cryptojs"}).digestString(t)},this.sha256=function(t){return new ft.crypto.MessageDigest({alg:"sha256",prov:"cryptojs"}).digestString(t)},this.sha256Hex=function(t){return new ft.crypto.MessageDigest({alg:"sha256",prov:"cryptojs"}).digestHex(t)},this.sha512=function(t){return new ft.crypto.MessageDigest({alg:"sha512",prov:"cryptojs"}).digestString(t)},this.sha512Hex=function(t){return new ft.crypto.MessageDigest({alg:"sha512",prov:"cryptojs"}).digestHex(t)}},ft.crypto.Util.md5=function(t){return new ft.crypto.MessageDigest({alg:"md5",prov:"cryptojs"}).digestString(t)},ft.crypto.Util.ripemd160=function(t){return new ft.crypto.MessageDigest({alg:"ripemd160",prov:"cryptojs"}).digestString(t)},ft.crypto.Util.SECURERANDOMGEN=new it,ft.crypto.Util.getRandomHexOfNbytes=function(t){var e=new Array(t);return ft.crypto.Util.SECURERANDOMGEN.nextBytes(e),mt(e)},ft.crypto.Util.getRandomBigIntegerOfNbytes=function(t){return new E(ft.crypto.Util.getRandomHexOfNbytes(t),16)},ft.crypto.Util.getRandomHexOfNbits=function(t){var e=t%8,r=new Array((t-e)/8+1);return ft.crypto.Util.SECURERANDOMGEN.nextBytes(r),r[0]=(255<<e&255^255)&r[0],mt(r)},ft.crypto.Util.getRandomBigIntegerOfNbits=function(t){return new E(ft.crypto.Util.getRandomHexOfNbits(t),16)},ft.crypto.Util.getRandomBigIntegerZeroToMax=function(t){for(var e=t.bitLength();;){var r=ft.crypto.Util.getRandomBigIntegerOfNbits(e);if(-1!=t.compareTo(r))return r}},ft.crypto.Util.getRandomBigIntegerMinToMax=function(t,e){var r=t.compareTo(e);if(1==r)throw"biMin is greater than biMax";if(0==r)return t;var n=e.subtract(t);return ft.crypto.Util.getRandomBigIntegerZeroToMax(n).add(t)},ft.crypto.MessageDigest=function(t){this.setAlgAndProvider=function(t,e){if(null!==(t=ft.crypto.MessageDigest.getCanonicalAlgName(t))&&void 0===e&&(e=ft.crypto.Util.DEFAULTPROVIDER[t]),-1!=":md5:sha1:sha224:sha256:sha384:sha512:ripemd160:".indexOf(t)&&"cryptojs"==e){try{this.md=ft.crypto.Util.CRYPTOJSMESSAGEDIGESTNAME[t].create()}catch(e){throw"setAlgAndProvider hash alg set fail alg="+t+"/"+e}this.updateString=function(t){this.md.update(t)},this.updateHex=function(t){var e=y.enc.Hex.parse(t);this.md.update(e)},this.digest=function(){return this.md.finalize().toString(y.enc.Hex)},this.digestString=function(t){return this.updateString(t),this.digest()},this.digestHex=function(t){return this.updateHex(t),this.digest()}}if(-1!=":sha256:".indexOf(t)&&"sjcl"==e){try{this.md=new sjcl.hash.sha256}catch(e){throw"setAlgAndProvider hash alg set fail alg="+t+"/"+e}this.updateString=function(t){this.md.update(t)},this.updateHex=function(t){var e=sjcl.codec.hex.toBits(t);this.md.update(e)},this.digest=function(){var t=this.md.finalize();return sjcl.codec.hex.fromBits(t)},this.digestString=function(t){return this.updateString(t),this.digest()},this.digestHex=function(t){return this.updateHex(t),this.digest()}}},this.updateString=function(t){throw"updateString(str) not supported for this alg/prov: "+this.algName+"/"+this.provName},this.updateHex=function(t){throw"updateHex(hex) not supported for this alg/prov: "+this.algName+"/"+this.provName},this.digest=function(){throw"digest() not supported for this alg/prov: "+this.algName+"/"+this.provName},this.digestString=function(t){throw"digestString(str) not supported for this alg/prov: "+this.algName+"/"+this.provName},this.digestHex=function(t){throw"digestHex(hex) not supported for this alg/prov: "+this.algName+"/"+this.provName},void 0!==t&&void 0!==t.alg&&(this.algName=t.alg,void 0===t.prov&&(this.provName=ft.crypto.Util.DEFAULTPROVIDER[this.algName]),this.setAlgAndProvider(this.algName,this.provName))},ft.crypto.MessageDigest.getCanonicalAlgName=function(t){return"string"==typeof t&&(t=(t=t.toLowerCase()).replace(/-/,"")),t},ft.crypto.MessageDigest.getHashLength=function(t){var e=ft.crypto.MessageDigest,r=e.getCanonicalAlgName(t);if(void 0===e.HASHLENGTH[r])throw"not supported algorithm: "+t;return e.HASHLENGTH[r]},ft.crypto.MessageDigest.HASHLENGTH={md5:16,sha1:20,sha224:28,sha256:32,sha384:48,sha512:64,ripemd160:20},ft.crypto.Mac=function(t){this.setAlgAndProvider=function(t,e){if(null==(t=t.toLowerCase())&&(t="hmacsha1"),"hmac"!=(t=t.toLowerCase()).substr(0,4))throw"setAlgAndProvider unsupported HMAC alg: "+t;void 0===e&&(e=ft.crypto.Util.DEFAULTPROVIDER[t]),this.algProv=t+"/"+e;var r=t.substr(4);if(-1!=":md5:sha1:sha224:sha256:sha384:sha512:ripemd160:".indexOf(r)&&"cryptojs"==e){try{var n=ft.crypto.Util.CRYPTOJSMESSAGEDIGESTNAME[r];this.mac=y.algo.HMAC.create(n,this.pass)}catch(t){throw"setAlgAndProvider hash alg set fail hashAlg="+r+"/"+t}this.updateString=function(t){this.mac.update(t)},this.updateHex=function(t){var e=y.enc.Hex.parse(t);this.mac.update(e)},this.doFinal=function(){return this.mac.finalize().toString(y.enc.Hex)},this.doFinalString=function(t){return this.updateString(t),this.doFinal()},this.doFinalHex=function(t){return this.updateHex(t),this.doFinal()}}},this.updateString=function(t){throw"updateString(str) not supported for this alg/prov: "+this.algProv},this.updateHex=function(t){throw"updateHex(hex) not supported for this alg/prov: "+this.algProv},this.doFinal=function(){throw"digest() not supported for this alg/prov: "+this.algProv},this.doFinalString=function(t){throw"digestString(str) not supported for this alg/prov: "+this.algProv},this.doFinalHex=function(t){throw"digestHex(hex) not supported for this alg/prov: "+this.algProv},this.setPassword=function(t){if("string"==typeof t){var e=t;return t.length%2!=1&&t.match(/^[0-9A-Fa-f]+$/)||(e=Pt(t)),void(this.pass=y.enc.Hex.parse(e))}if("object"!=(void 0===t?"undefined":r(t)))throw"KJUR.crypto.Mac unsupported password type: "+t;e=null;if(void 0!==t.hex){if(t.hex.length%2!=0||!t.hex.match(/^[0-9A-Fa-f]+$/))throw"Mac: wrong hex password: "+t.hex;e=t.hex}if(void 0!==t.utf8&&(e=Et(t.utf8)),void 0!==t.rstr&&(e=Pt(t.rstr)),void 0!==t.b64&&(e=F(t.b64)),void 0!==t.b64u&&(e=_t(t.b64u)),null==e)throw"KJUR.crypto.Mac unsupported password type: "+t;this.pass=y.enc.Hex.parse(e)},void 0!==t&&(void 0!==t.pass&&this.setPassword(t.pass),void 0!==t.alg&&(this.algName=t.alg,void 0===t.prov&&(this.provName=ft.crypto.Util.DEFAULTPROVIDER[this.algName]),this.setAlgAndProvider(this.algName,this.provName)))},ft.crypto.Signature=function(t){var e=null;if(this._setAlgNames=function(){var t=this.algName.match(/^(.+)with(.+)$/);t&&(this.mdAlgName=t[1].toLowerCase(),this.pubkeyAlgName=t[2].toLowerCase())},this._zeroPaddingOfSignature=function(t,e){for(var r="",n=e/4-t.length,i=0;i<n;i++)r+="0";return r+t},this.setAlgAndProvider=function(t,e){if(this._setAlgNames(),"cryptojs/jsrsa"!=e)throw"provider not supported: "+e;if(-1!=":md5:sha1:sha224:sha256:sha384:sha512:ripemd160:".indexOf(this.mdAlgName)){try{this.md=new ft.crypto.MessageDigest({alg:this.mdAlgName})}catch(t){throw"setAlgAndProvider hash alg set fail alg="+this.mdAlgName+"/"+t}this.init=function(t,e){var r=null;try{r=void 0===e?Kt.getKey(t):Kt.getKey(t,e)}catch(t){throw"init failed:"+t}if(!0===r.isPrivate)this.prvKey=r,this.state="SIGN";else{if(!0!==r.isPublic)throw"init failed.:"+r;this.pubKey=r,this.state="VERIFY"}},this.updateString=function(t){this.md.updateString(t)},this.updateHex=function(t){this.md.updateHex(t)},this.sign=function(){if(this.sHashHex=this.md.digest(),void 0!==this.ecprvhex&&void 0!==this.eccurvename){var t=new ft.crypto.ECDSA({curve:this.eccurvename});this.hSign=t.signHex(this.sHashHex,this.ecprvhex)}else if(this.prvKey instanceof at&&"rsaandmgf1"===this.pubkeyAlgName)this.hSign=this.prvKey.signWithMessageHashPSS(this.sHashHex,this.mdAlgName,this.pssSaltLen);else if(this.prvKey instanceof at&&"rsa"===this.pubkeyAlgName)this.hSign=this.prvKey.signWithMessageHash(this.sHashHex,this.mdAlgName);else if(this.prvKey instanceof ft.crypto.ECDSA)this.hSign=this.prvKey.signWithMessageHash(this.sHashHex);else{if(!(this.prvKey instanceof ft.crypto.DSA))throw"Signature: unsupported private key alg: "+this.pubkeyAlgName;this.hSign=this.prvKey.signWithMessageHash(this.sHashHex)}return this.hSign},this.signString=function(t){return this.updateString(t),this.sign()},this.signHex=function(t){return this.updateHex(t),this.sign()},this.verify=function(t){if(this.sHashHex=this.md.digest(),void 0!==this.ecpubhex&&void 0!==this.eccurvename)return new ft.crypto.ECDSA({curve:this.eccurvename}).verifyHex(this.sHashHex,t,this.ecpubhex);if(this.pubKey instanceof at&&"rsaandmgf1"===this.pubkeyAlgName)return this.pubKey.verifyWithMessageHashPSS(this.sHashHex,t,this.mdAlgName,this.pssSaltLen);if(this.pubKey instanceof at&&"rsa"===this.pubkeyAlgName)return this.pubKey.verifyWithMessageHash(this.sHashHex,t);if(void 0!==ft.crypto.ECDSA&&this.pubKey instanceof ft.crypto.ECDSA)return this.pubKey.verifyWithMessageHash(this.sHashHex,t);if(void 0!==ft.crypto.DSA&&this.pubKey instanceof ft.crypto.DSA)return this.pubKey.verifyWithMessageHash(this.sHashHex,t);throw"Signature: unsupported public key alg: "+this.pubkeyAlgName}}},this.init=function(t,e){throw"init(key, pass) not supported for this alg:prov="+this.algProvName},this.updateString=function(t){throw"updateString(str) not supported for this alg:prov="+this.algProvName},this.updateHex=function(t){throw"updateHex(hex) not supported for this alg:prov="+this.algProvName},this.sign=function(){throw"sign() not supported for this alg:prov="+this.algProvName},this.signString=function(t){throw"digestString(str) not supported for this alg:prov="+this.algProvName},this.signHex=function(t){throw"digestHex(hex) not supported for this alg:prov="+this.algProvName},this.verify=function(t){throw"verify(hSigVal) not supported for this alg:prov="+this.algProvName},this.initParams=t,void 0!==t&&(void 0!==t.alg&&(this.algName=t.alg,void 0===t.prov?this.provName=ft.crypto.Util.DEFAULTPROVIDER[this.algName]:this.provName=t.prov,this.algProvName=this.algName+":"+this.provName,this.setAlgAndProvider(this.algName,this.provName),this._setAlgNames()),void 0!==t.psssaltlen&&(this.pssSaltLen=t.psssaltlen),void 0!==t.prvkeypem)){if(void 0!==t.prvkeypas)throw"both prvkeypem and prvkeypas parameters not supported";try{e=Kt.getKey(t.prvkeypem);this.init(e)}catch(t){throw"fatal error to load pem private key: "+t}}},ft.crypto.Cipher=function(t){},ft.crypto.Cipher.encrypt=function(t,e,r){if(e instanceof at&&e.isPublic){var n=ft.crypto.Cipher.getAlgByKeyAndName(e,r);if("RSA"===n)return e.encrypt(t);if("RSAOAEP"===n)return e.encryptOAEP(t,"sha1");var i=n.match(/^RSAOAEP(\d+)$/);if(null!==i)return e.encryptOAEP(t,"sha"+i[1]);throw"Cipher.encrypt: unsupported algorithm for RSAKey: "+r}throw"Cipher.encrypt: unsupported key or algorithm"},ft.crypto.Cipher.decrypt=function(t,e,r){if(e instanceof at&&e.isPrivate){var n=ft.crypto.Cipher.getAlgByKeyAndName(e,r);if("RSA"===n)return e.decrypt(t);if("RSAOAEP"===n)return e.decryptOAEP(t,"sha1");var i=n.match(/^RSAOAEP(\d+)$/);if(null!==i)return e.decryptOAEP(t,"sha"+i[1]);throw"Cipher.decrypt: unsupported algorithm for RSAKey: "+r}throw"Cipher.decrypt: unsupported key or algorithm"},ft.crypto.Cipher.getAlgByKeyAndName=function(t,e){if(t instanceof at){if(-1!=":RSA:RSAOAEP:RSAOAEP224:RSAOAEP256:RSAOAEP384:RSAOAEP512:".indexOf(e))return e;if(null===e||void 0===e)return"RSA";throw"getAlgByKeyAndName: not supported algorithm name for RSAKey: "+e}throw"getAlgByKeyAndName: not supported algorithm name: "+e},ft.crypto.OID=new function(){this.oidhex2name={"2a864886f70d010101":"rsaEncryption","2a8648ce3d0201":"ecPublicKey","2a8648ce380401":"dsa","2a8648ce3d030107":"secp256r1","2b8104001f":"secp192k1","2b81040021":"secp224r1","2b8104000a":"secp256k1","2b81040023":"secp521r1","2b81040022":"secp384r1","2a8648ce380403":"SHA1withDSA","608648016503040301":"SHA224withDSA","608648016503040302":"SHA256withDSA"}},void 0!==ft&&ft||(ft={}),void 0!==ft.crypto&&ft.crypto||(ft.crypto={}),ft.crypto.ECDSA=function(t){var e=new it;this.type="EC",this.isPrivate=!1,this.isPublic=!1,this.getBigRandom=function(t){return new E(t.bitLength(),e).mod(t.subtract(E.ONE)).add(E.ONE)},this.setNamedCurve=function(t){this.ecparams=ft.crypto.ECParameterDB.getByName(t),this.prvKeyHex=null,this.pubKeyHex=null,this.curveName=t},this.setPrivateKeyHex=function(t){this.isPrivate=!0,this.prvKeyHex=t},this.setPublicKeyHex=function(t){this.isPublic=!0,this.pubKeyHex=t},this.getPublicKeyXYHex=function(){var t=this.pubKeyHex;if("04"!==t.substr(0,2))throw"this method supports uncompressed format(04) only";var e=this.ecparams.keylen/4;if(t.length!==2+2*e)throw"malformed public key hex length";var r={};return r.x=t.substr(2,e),r.y=t.substr(2+e),r},this.getShortNISTPCurveName=function(){var t=this.curveName;return"secp256r1"===t||"NIST P-256"===t||"P-256"===t||"prime256v1"===t?"P-256":"secp384r1"===t||"NIST P-384"===t||"P-384"===t?"P-384":null},this.generateKeyPairHex=function(){var t=this.ecparams.n,e=this.getBigRandom(t),r=this.ecparams.G.multiply(e),n=r.getX().toBigInteger(),i=r.getY().toBigInteger(),o=this.ecparams.keylen/4,s=("0000000000"+e.toString(16)).slice(-o),a="04"+("0000000000"+n.toString(16)).slice(-o)+("0000000000"+i.toString(16)).slice(-o);return this.setPrivateKeyHex(s),this.setPublicKeyHex(a),{ecprvhex:s,ecpubhex:a}},this.signWithMessageHash=function(t){return this.signHex(t,this.prvKeyHex)},this.signHex=function(t,e){var r=new E(e,16),n=this.ecparams.n,i=new E(t,16);do{var o=this.getBigRandom(n),s=this.ecparams.G.multiply(o).getX().toBigInteger().mod(n)}while(s.compareTo(E.ZERO)<=0);var a=o.modInverse(n).multiply(i.add(r.multiply(s))).mod(n);return ft.crypto.ECDSA.biRSSigToASN1Sig(s,a)},this.sign=function(t,e){var r=e,n=this.ecparams.n,i=E.fromByteArrayUnsigned(t);do{var o=this.getBigRandom(n),s=this.ecparams.G.multiply(o).getX().toBigInteger().mod(n)}while(s.compareTo(E.ZERO)<=0);var a=o.modInverse(n).multiply(i.add(r.multiply(s))).mod(n);return this.serializeSig(s,a)},this.verifyWithMessageHash=function(t,e){return this.verifyHex(t,e,this.pubKeyHex)},this.verifyHex=function(t,e,r){var n,i,o,s=ft.crypto.ECDSA.parseSigHex(e);n=s.r,i=s.s,o=ct.decodeFromHex(this.ecparams.curve,r);var a=new E(t,16);return this.verifyRaw(a,n,i,o)},this.verify=function(t,e,n){var i,o,s;if(Bitcoin.Util.isArray(e)){var a=this.parseSig(e);i=a.r,o=a.s}else{if("object"!==(void 0===e?"undefined":r(e))||!e.r||!e.s)throw"Invalid value for signature";i=e.r,o=e.s}if(n instanceof ct)s=n;else{if(!Bitcoin.Util.isArray(n))throw"Invalid format for pubkey value, must be byte array or ECPointFp";s=ct.decodeFrom(this.ecparams.curve,n)}var u=E.fromByteArrayUnsigned(t);return this.verifyRaw(u,i,o,s)},this.verifyRaw=function(t,e,r,n){var i=this.ecparams.n,o=this.ecparams.G;if(e.compareTo(E.ONE)<0||e.compareTo(i)>=0)return!1;if(r.compareTo(E.ONE)<0||r.compareTo(i)>=0)return!1;var s=r.modInverse(i),a=t.multiply(s).mod(i),u=e.multiply(s).mod(i);return o.multiply(a).add(n.multiply(u)).getX().toBigInteger().mod(i).equals(e)},this.serializeSig=function(t,e){var r=t.toByteArraySigned(),n=e.toByteArraySigned(),i=[];return i.push(2),i.push(r.length),(i=i.concat(r)).push(2),i.push(n.length),(i=i.concat(n)).unshift(i.length),i.unshift(48),i},this.parseSig=function(t){var e;if(48!=t[0])throw new Error("Signature not a valid DERSequence");if(2!=t[e=2])throw new Error("First element in signature must be a DERInteger");var r=t.slice(e+2,e+2+t[e+1]);if(2!=t[e+=2+t[e+1]])throw new Error("Second element in signature must be a DERInteger");var n=t.slice(e+2,e+2+t[e+1]);return e+=2+t[e+1],{r:E.fromByteArrayUnsigned(r),s:E.fromByteArrayUnsigned(n)}},this.parseSigCompact=function(t){if(65!==t.length)throw"Signature has the wrong length";var e=t[0]-27;if(e<0||e>7)throw"Invalid signature type";var r=this.ecparams.n;return{r:E.fromByteArrayUnsigned(t.slice(1,33)).mod(r),s:E.fromByteArrayUnsigned(t.slice(33,65)).mod(r),i:e}},this.readPKCS5PrvKeyHex=function(t){var e,r,n,i=gt,o=ft.crypto.ECDSA.getName,s=i.getVbyList;if(!1===i.isASN1HEX(t))throw"not ASN.1 hex string";try{e=s(t,0,[2,0],"06"),r=s(t,0,[1],"04");try{n=s(t,0,[3,0],"03").substr(2)}catch(t){}}catch(t){throw"malformed PKCS#1/5 plain ECC private key"}if(this.curveName=o(e),void 0===this.curveName)throw"unsupported curve name";this.setNamedCurve(this.curveName),this.setPublicKeyHex(n),this.setPrivateKeyHex(r),this.isPublic=!1},this.readPKCS8PrvKeyHex=function(t){var e,r,n,i=gt,o=ft.crypto.ECDSA.getName,s=i.getVbyList;if(!1===i.isASN1HEX(t))throw"not ASN.1 hex string";try{s(t,0,[1,0],"06"),e=s(t,0,[1,1],"06"),r=s(t,0,[2,0,1],"04");try{n=s(t,0,[2,0,2,0],"03").substr(2)}catch(t){}}catch(t){throw"malformed PKCS#8 plain ECC private key"}if(this.curveName=o(e),void 0===this.curveName)throw"unsupported curve name";this.setNamedCurve(this.curveName),this.setPublicKeyHex(n),this.setPrivateKeyHex(r),this.isPublic=!1},this.readPKCS8PubKeyHex=function(t){var e,r,n=gt,i=ft.crypto.ECDSA.getName,o=n.getVbyList;if(!1===n.isASN1HEX(t))throw"not ASN.1 hex string";try{o(t,0,[0,0],"06"),e=o(t,0,[0,1],"06"),r=o(t,0,[1],"03").substr(2)}catch(t){throw"malformed PKCS#8 ECC public key"}if(this.curveName=i(e),null===this.curveName)throw"unsupported curve name";this.setNamedCurve(this.curveName),this.setPublicKeyHex(r)},this.readCertPubKeyHex=function(t,e){5!==e&&(e=6);var r,n,i=gt,o=ft.crypto.ECDSA.getName,s=i.getVbyList;if(!1===i.isASN1HEX(t))throw"not ASN.1 hex string";try{r=s(t,0,[0,e,0,1],"06"),n=s(t,0,[0,e,1],"03").substr(2)}catch(t){throw"malformed X.509 certificate ECC public key"}if(this.curveName=o(r),null===this.curveName)throw"unsupported curve name";this.setNamedCurve(this.curveName),this.setPublicKeyHex(n)},void 0!==t&&void 0!==t.curve&&(this.curveName=t.curve),void 0===this.curveName&&(this.curveName="secp256r1"),this.setNamedCurve(this.curveName),void 0!==t&&(void 0!==t.prv&&this.setPrivateKeyHex(t.prv),void 0!==t.pub&&this.setPublicKeyHex(t.pub))},ft.crypto.ECDSA.parseSigHex=function(t){var e=ft.crypto.ECDSA.parseSigHexInHexRS(t);return{r:new E(e.r,16),s:new E(e.s,16)}},ft.crypto.ECDSA.parseSigHexInHexRS=function(t){var e=gt,r=e.getChildIdx,n=e.getV;if("30"!=t.substr(0,2))throw"signature is not a ASN.1 sequence";var i=r(t,0);if(2!=i.length)throw"number of signature ASN.1 sequence elements seem wrong";var o=i[0],s=i[1];if("02"!=t.substr(o,2))throw"1st item of sequene of signature is not ASN.1 integer";if("02"!=t.substr(s,2))throw"2nd item of sequene of signature is not ASN.1 integer";return{r:n(t,o),s:n(t,s)}},ft.crypto.ECDSA.asn1SigToConcatSig=function(t){var e=ft.crypto.ECDSA.parseSigHexInHexRS(t),r=e.r,n=e.s;if("00"==r.substr(0,2)&&r.length%32==2&&(r=r.substr(2)),"00"==n.substr(0,2)&&n.length%32==2&&(n=n.substr(2)),r.length%32==30&&(r="00"+r),n.length%32==30&&(n="00"+n),r.length%32!=0)throw"unknown ECDSA sig r length error";if(n.length%32!=0)throw"unknown ECDSA sig s length error";return r+n},ft.crypto.ECDSA.concatSigToASN1Sig=function(t){if(t.length/2*8%128!=0)throw"unknown ECDSA concatinated r-s sig  length error";var e=t.substr(0,t.length/2),r=t.substr(t.length/2);return ft.crypto.ECDSA.hexRSSigToASN1Sig(e,r)},ft.crypto.ECDSA.hexRSSigToASN1Sig=function(t,e){var r=new E(t,16),n=new E(e,16);return ft.crypto.ECDSA.biRSSigToASN1Sig(r,n)},ft.crypto.ECDSA.biRSSigToASN1Sig=function(t,e){var r=ft.asn1,n=new r.DERInteger({bigint:t}),i=new r.DERInteger({bigint:e});return new r.DERSequence({array:[n,i]}).getEncodedHex()},ft.crypto.ECDSA.getName=function(t){return"2a8648ce3d030107"===t?"secp256r1":"2b8104000a"===t?"secp256k1":"2b81040022"===t?"secp384r1":-1!=="|secp256r1|NIST P-256|P-256|prime256v1|".indexOf(t)?"secp256r1":-1!=="|secp256k1|".indexOf(t)?"secp256k1":-1!=="|secp384r1|NIST P-384|P-384|".indexOf(t)?"secp384r1":null},void 0!==ft&&ft||(ft={}),void 0!==ft.crypto&&ft.crypto||(ft.crypto={}),ft.crypto.ECParameterDB=new function(){var t={},e={};function r(t){return new E(t,16)}this.getByName=function(r){var n=r;if(void 0!==e[n]&&(n=e[r]),void 0!==t[n])return t[n];throw"unregistered EC curve name: "+n},this.regist=function(n,i,o,s,a,u,c,h,l,f,d,p){t[n]={};var g=r(o),v=r(s),y=r(a),m=r(u),S=r(c),b=new ht(g,v,y),w=b.decodePointHex("04"+h+l);t[n].name=n,t[n].keylen=i,t[n].curve=b,t[n].G=w,t[n].n=m,t[n].h=S,t[n].oid=d,t[n].info=p;for(var F=0;F<f.length;F++)e[f[F]]=n}},ft.crypto.ECParameterDB.regist("secp128r1",128,"FFFFFFFDFFFFFFFFFFFFFFFFFFFFFFFF","FFFFFFFDFFFFFFFFFFFFFFFFFFFFFFFC","E87579C11079F43DD824993C2CEE5ED3","FFFFFFFE0000000075A30D1B9038A115","1","161FF7528B899B2D0C28607CA52C5B86","CF5AC8395BAFEB13C02DA292DDED7A83",[],"","secp128r1 : SECG curve over a 128 bit prime field"),ft.crypto.ECParameterDB.regist("secp160k1",160,"FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFAC73","0","7","0100000000000000000001B8FA16DFAB9ACA16B6B3","1","3B4C382CE37AA192A4019E763036F4F5DD4D7EBB","938CF935318FDCED6BC28286531733C3F03C4FEE",[],"","secp160k1 : SECG curve over a 160 bit prime field"),ft.crypto.ECParameterDB.regist("secp160r1",160,"FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF7FFFFFFF","FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF7FFFFFFC","1C97BEFC54BD7A8B65ACF89F81D4D4ADC565FA45","0100000000000000000001F4C8F927AED3CA752257","1","4A96B5688EF573284664698968C38BB913CBFC82","23A628553168947D59DCC912042351377AC5FB32",[],"","secp160r1 : SECG curve over a 160 bit prime field"),ft.crypto.ECParameterDB.regist("secp192k1",192,"FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFEE37","0","3","FFFFFFFFFFFFFFFFFFFFFFFE26F2FC170F69466A74DEFD8D","1","DB4FF10EC057E9AE26B07D0280B7F4341DA5D1B1EAE06C7D","9B2F2F6D9C5628A7844163D015BE86344082AA88D95E2F9D",[]),ft.crypto.ECParameterDB.regist("secp192r1",192,"FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFFFFFFFFFFFF","FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFFFFFFFFFFFC","64210519E59C80E70FA7E9AB72243049FEB8DEECC146B9B1","FFFFFFFFFFFFFFFFFFFFFFFF99DEF836146BC9B1B4D22831","1","188DA80EB03090F67CBF20EB43A18800F4FF0AFD82FF1012","07192B95FFC8DA78631011ED6B24CDD573F977A11E794811",[]),ft.crypto.ECParameterDB.regist("secp224r1",224,"FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF000000000000000000000001","FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFFFFFFFFFFFFFFFFFFFE","B4050A850C04B3ABF54132565044B0B7D7BFD8BA270B39432355FFB4","FFFFFFFFFFFFFFFFFFFFFFFFFFFF16A2E0B8F03E13DD29455C5C2A3D","1","B70E0CBD6BB4BF7F321390B94A03C1D356C21122343280D6115C1D21","BD376388B5F723FB4C22DFE6CD4375A05A07476444D5819985007E34",[]),ft.crypto.ECParameterDB.regist("secp256k1",256,"FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F","0","7","FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141","1","79BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798","483ADA7726A3C4655DA4FBFC0E1108A8FD17B448A68554199C47D08FFB10D4B8",[]),ft.crypto.ECParameterDB.regist("secp256r1",256,"FFFFFFFF00000001000000000000000000000000FFFFFFFFFFFFFFFFFFFFFFFF","FFFFFFFF00000001000000000000000000000000FFFFFFFFFFFFFFFFFFFFFFFC","5AC635D8AA3A93E7B3EBBD55769886BC651D06B0CC53B0F63BCE3C3E27D2604B","FFFFFFFF00000000FFFFFFFFFFFFFFFFBCE6FAADA7179E84F3B9CAC2FC632551","1","6B17D1F2E12C4247F8BCE6E563A440F277037D812DEB33A0F4A13945D898C296","4FE342E2FE1A7F9B8EE7EB4A7C0F9E162BCE33576B315ECECBB6406837BF51F5",["NIST P-256","P-256","prime256v1"]),ft.crypto.ECParameterDB.regist("secp384r1",384,"FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFFFF0000000000000000FFFFFFFF","FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFFFF0000000000000000FFFFFFFC","B3312FA7E23EE7E4988E056BE3F82D19181D9C6EFE8141120314088F5013875AC656398D8A2ED19D2A85C8EDD3EC2AEF","FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFC7634D81F4372DDF581A0DB248B0A77AECEC196ACCC52973","1","AA87CA22BE8B05378EB1C71EF320AD746E1D3B628BA79B9859F741E082542A385502F25DBF55296C3A545E3872760AB7","3617de4a96262c6f5d9e98bf9292dc29f8f41dbd289a147ce9da3113b5f0b8c00a60b1ce1d7e819d7a431d7c90ea0e5f",["NIST P-384","P-384"]),ft.crypto.ECParameterDB.regist("secp521r1",521,"1FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF","1FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFC","051953EB9618E1C9A1F929A21A0B68540EEA2DA725B99B315F3B8B489918EF109E156193951EC7E937B1652C0BD3BB1BF073573DF883D2C34F1EF451FD46B503F00","1FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFA51868783BF2F966B7FCC0148F709A5D03BB5C9B8899C47AEBB6FB71E91386409","1","C6858E06B70404E9CD9E3ECB662395B4429C648139053FB521F828AF606B4D3DBAA14B5E77EFE75928FE1DC127A2FFA8DE3348B3C1856A429BF97E7E31C2E5BD66","011839296a789a3bc0045c8a5fb42c7d1bd998f54449579b446817afbd17273e662c97ee72995ef42640c550b9013fad0761353c7086a272c24088be94769fd16650",["NIST P-521","P-521"]);var Kt=function(){var t=function(t,r,n){return e(y.AES,t,r,n)},e=function(t,e,r,n){var i=y.enc.Hex.parse(e),o=y.enc.Hex.parse(r),s=y.enc.Hex.parse(n),a={};a.key=o,a.iv=s,a.ciphertext=i;var u=t.decrypt(a,o,{iv:s});return y.enc.Hex.stringify(u)},r=function(t,e,r){return n(y.AES,t,e,r)},n=function(t,e,r,n){var i=y.enc.Hex.parse(e),o=y.enc.Hex.parse(r),s=y.enc.Hex.parse(n),a=t.encrypt(i,o,{iv:s}),u=y.enc.Hex.parse(a.toString());return y.enc.Base64.stringify(u)},i={"AES-256-CBC":{proc:t,eproc:r,keylen:32,ivlen:16},"AES-192-CBC":{proc:t,eproc:r,keylen:24,ivlen:16},"AES-128-CBC":{proc:t,eproc:r,keylen:16,ivlen:16},"DES-EDE3-CBC":{proc:function(t,r,n){return e(y.TripleDES,t,r,n)},eproc:function(t,e,r){return n(y.TripleDES,t,e,r)},keylen:24,ivlen:8},"DES-CBC":{proc:function(t,r,n){return e(y.DES,t,r,n)},eproc:function(t,e,r){return n(y.DES,t,e,r)},keylen:8,ivlen:8}},o=function(t){var e={},r=t.match(new RegExp("DEK-Info: ([^,]+),([0-9A-Fa-f]+)","m"));r&&(e.cipher=r[1],e.ivsalt=r[2]);var n=t.match(new RegExp("-----BEGIN ([A-Z]+) PRIVATE KEY-----"));n&&(e.type=n[1]);var i=-1,o=0;-1!=t.indexOf("\r\n\r\n")&&(i=t.indexOf("\r\n\r\n"),o=2),-1!=t.indexOf("\n\n")&&(i=t.indexOf("\n\n"),o=1);var s=t.indexOf("-----END");if(-1!=i&&-1!=s){var a=t.substring(i+2*o,s-o);a=a.replace(/\s+/g,""),e.data=a}return e},s=function(t,e,r){for(var n=r.substring(0,16),o=y.enc.Hex.parse(n),s=y.enc.Utf8.parse(e),a=i[t].keylen+i[t].ivlen,u="",c=null;;){var h=y.algo.MD5.create();if(null!=c&&h.update(c),h.update(s),h.update(o),c=h.finalize(),(u+=y.enc.Hex.stringify(c)).length>=2*a)break}var l={};return l.keyhex=u.substr(0,2*i[t].keylen),l.ivhex=u.substr(2*i[t].keylen,2*i[t].ivlen),l},a=function(t,e,r,n){var o=y.enc.Base64.parse(t),s=y.enc.Hex.stringify(o);return(0,i[e].proc)(s,r,n)};return{version:"1.0.0",parsePKCS5PEM:function(t){return o(t)},getKeyAndUnusedIvByPasscodeAndIvsalt:function(t,e,r){return s(t,e,r)},decryptKeyB64:function(t,e,r,n){return a(t,e,r,n)},getDecryptedKeyHex:function(t,e){var r=o(t),n=(r.type,r.cipher),i=r.ivsalt,u=r.data,c=s(n,e,i).keyhex;return a(u,n,c,i)},getEncryptedPKCS5PEMFromPrvKeyHex:function(t,e,r,n,o){var a="";if(void 0!==n&&null!=n||(n="AES-256-CBC"),void 0===i[n])throw"KEYUTIL unsupported algorithm: "+n;void 0!==o&&null!=o||(o=function(t){var e=y.lib.WordArray.random(t);return y.enc.Hex.stringify(e)}(i[n].ivlen).toUpperCase());var u=function(t,e,r,n){return(0,i[e].eproc)(t,r,n)}(e,n,s(n,r,o).keyhex,o);a="-----BEGIN "+t+" PRIVATE KEY-----\r\n";return a+="Proc-Type: 4,ENCRYPTED\r\n",a+="DEK-Info: "+n+","+o+"\r\n",a+="\r\n",a+=u.replace(/(.{64})/g,"$1\r\n"),a+="\r\n-----END "+t+" PRIVATE KEY-----\r\n"},parseHexOfEncryptedPKCS8:function(t){var e=gt,r=e.getChildIdx,n=e.getV,i={},o=r(t,0);if(2!=o.length)throw"malformed format: SEQUENCE(0).items != 2: "+o.length;i.ciphertext=n(t,o[1]);var s=r(t,o[0]);if(2!=s.length)throw"malformed format: SEQUENCE(0.0).items != 2: "+s.length;if("2a864886f70d01050d"!=n(t,s[0]))throw"this only supports pkcs5PBES2";var a=r(t,s[1]);if(2!=s.length)throw"malformed format: SEQUENCE(0.0.1).items != 2: "+a.length;var u=r(t,a[1]);if(2!=u.length)throw"malformed format: SEQUENCE(0.0.1.1).items != 2: "+u.length;if("2a864886f70d0307"!=n(t,u[0]))throw"this only supports TripleDES";i.encryptionSchemeAlg="TripleDES",i.encryptionSchemeIV=n(t,u[1]);var c=r(t,a[0]);if(2!=c.length)throw"malformed format: SEQUENCE(0.0.1.0).items != 2: "+c.length;if("2a864886f70d01050c"!=n(t,c[0]))throw"this only supports pkcs5PBKDF2";var h=r(t,c[1]);if(h.length<2)throw"malformed format: SEQUENCE(0.0.1.0.1).items < 2: "+h.length;i.pbkdf2Salt=n(t,h[0]);var l=n(t,h[1]);try{i.pbkdf2Iter=parseInt(l,16)}catch(t){throw"malformed format pbkdf2Iter: "+l}return i},getPBKDF2KeyHexFromParam:function(t,e){var r=y.enc.Hex.parse(t.pbkdf2Salt),n=t.pbkdf2Iter,i=y.PBKDF2(e,r,{keySize:6,iterations:n});return y.enc.Hex.stringify(i)},_getPlainPKCS8HexFromEncryptedPKCS8PEM:function(t,e){var r=Dt(t,"ENCRYPTED PRIVATE KEY"),n=this.parseHexOfEncryptedPKCS8(r),i=Kt.getPBKDF2KeyHexFromParam(n,e),o={};o.ciphertext=y.enc.Hex.parse(n.ciphertext);var s=y.enc.Hex.parse(i),a=y.enc.Hex.parse(n.encryptionSchemeIV),u=y.TripleDES.decrypt(o,s,{iv:a});return y.enc.Hex.stringify(u)},getKeyFromEncryptedPKCS8PEM:function(t,e){var r=this._getPlainPKCS8HexFromEncryptedPKCS8PEM(t,e);return this.getKeyFromPlainPrivatePKCS8Hex(r)},parsePlainPrivatePKCS8Hex:function(t){var e=gt,r=e.getChildIdx,n=e.getV,i={algparam:null};if("30"!=t.substr(0,2))throw"malformed plain PKCS8 private key(code:001)";var o=r(t,0);if(3!=o.length)throw"malformed plain PKCS8 private key(code:002)";if("30"!=t.substr(o[1],2))throw"malformed PKCS8 private key(code:003)";var s=r(t,o[1]);if(2!=s.length)throw"malformed PKCS8 private key(code:004)";if("06"!=t.substr(s[0],2))throw"malformed PKCS8 private key(code:005)";if(i.algoid=n(t,s[0]),"06"==t.substr(s[1],2)&&(i.algparam=n(t,s[1])),"04"!=t.substr(o[2],2))throw"malformed PKCS8 private key(code:006)";return i.keyidx=e.getVidx(t,o[2]),i},getKeyFromPlainPrivatePKCS8PEM:function(t){var e=Dt(t,"PRIVATE KEY");return this.getKeyFromPlainPrivatePKCS8Hex(e)},getKeyFromPlainPrivatePKCS8Hex:function(t){var e,r=this.parsePlainPrivatePKCS8Hex(t);if("2a864886f70d010101"==r.algoid)e=new at;else if("2a8648ce380401"==r.algoid)e=new ft.crypto.DSA;else{if("2a8648ce3d0201"!=r.algoid)throw"unsupported private key algorithm";e=new ft.crypto.ECDSA}return e.readPKCS8PrvKeyHex(t),e},_getKeyFromPublicPKCS8Hex:function(t){var e,r=gt.getVbyList(t,0,[0,0],"06");if("2a864886f70d010101"===r)e=new at;else if("2a8648ce380401"===r)e=new ft.crypto.DSA;else{if("2a8648ce3d0201"!==r)throw"unsupported PKCS#8 public key hex";e=new ft.crypto.ECDSA}return e.readPKCS8PubKeyHex(t),e},parsePublicRawRSAKeyHex:function(t){var e=gt,r=e.getChildIdx,n=e.getV,i={};if("30"!=t.substr(0,2))throw"malformed RSA key(code:001)";var o=r(t,0);if(2!=o.length)throw"malformed RSA key(code:002)";if("02"!=t.substr(o[0],2))throw"malformed RSA key(code:003)";if(i.n=n(t,o[0]),"02"!=t.substr(o[1],2))throw"malformed RSA key(code:004)";return i.e=n(t,o[1]),i},parsePublicPKCS8Hex:function(t){var e=gt,r=e.getChildIdx,n=e.getV,i={algparam:null},o=r(t,0);if(2!=o.length)throw"outer DERSequence shall have 2 elements: "+o.length;var s=o[0];if("30"!=t.substr(s,2))throw"malformed PKCS8 public key(code:001)";var a=r(t,s);if(2!=a.length)throw"malformed PKCS8 public key(code:002)";if("06"!=t.substr(a[0],2))throw"malformed PKCS8 public key(code:003)";if(i.algoid=n(t,a[0]),"06"==t.substr(a[1],2)?i.algparam=n(t,a[1]):"30"==t.substr(a[1],2)&&(i.algparam={},i.algparam.p=e.getVbyList(t,a[1],[0],"02"),i.algparam.q=e.getVbyList(t,a[1],[1],"02"),i.algparam.g=e.getVbyList(t,a[1],[2],"02")),"03"!=t.substr(o[1],2))throw"malformed PKCS8 public key(code:004)";return i.key=n(t,o[1]).substr(2),i}}}();Kt.getKey=function(t,e,r){var n=(v=gt).getChildIdx,i=(v.getV,v.getVbyList),o=ft.crypto,s=o.ECDSA,a=o.DSA,u=at,c=Dt,h=Kt;if(void 0!==u&&t instanceof u)return t;if(void 0!==s&&t instanceof s)return t;if(void 0!==a&&t instanceof a)return t;if(void 0!==t.curve&&void 0!==t.xy&&void 0===t.d)return new s({pub:t.xy,curve:t.curve});if(void 0!==t.curve&&void 0!==t.d)return new s({prv:t.d,curve:t.curve});if(void 0===t.kty&&void 0!==t.n&&void 0!==t.e&&void 0===t.d)return(C=new u).setPublic(t.n,t.e),C;if(void 0===t.kty&&void 0!==t.n&&void 0!==t.e&&void 0!==t.d&&void 0!==t.p&&void 0!==t.q&&void 0!==t.dp&&void 0!==t.dq&&void 0!==t.co&&void 0===t.qi)return(C=new u).setPrivateEx(t.n,t.e,t.d,t.p,t.q,t.dp,t.dq,t.co),C;if(void 0===t.kty&&void 0!==t.n&&void 0!==t.e&&void 0!==t.d&&void 0===t.p)return(C=new u).setPrivate(t.n,t.e,t.d),C;if(void 0!==t.p&&void 0!==t.q&&void 0!==t.g&&void 0!==t.y&&void 0===t.x)return(C=new a).setPublic(t.p,t.q,t.g,t.y),C;if(void 0!==t.p&&void 0!==t.q&&void 0!==t.g&&void 0!==t.y&&void 0!==t.x)return(C=new a).setPrivate(t.p,t.q,t.g,t.y,t.x),C;if("RSA"===t.kty&&void 0!==t.n&&void 0!==t.e&&void 0===t.d)return(C=new u).setPublic(_t(t.n),_t(t.e)),C;if("RSA"===t.kty&&void 0!==t.n&&void 0!==t.e&&void 0!==t.d&&void 0!==t.p&&void 0!==t.q&&void 0!==t.dp&&void 0!==t.dq&&void 0!==t.qi)return(C=new u).setPrivateEx(_t(t.n),_t(t.e),_t(t.d),_t(t.p),_t(t.q),_t(t.dp),_t(t.dq),_t(t.qi)),C;if("RSA"===t.kty&&void 0!==t.n&&void 0!==t.e&&void 0!==t.d)return(C=new u).setPrivate(_t(t.n),_t(t.e),_t(t.d)),C;if("EC"===t.kty&&void 0!==t.crv&&void 0!==t.x&&void 0!==t.y&&void 0===t.d){var l=(P=new s({curve:t.crv})).ecparams.keylen/4,f="04"+("0000000000"+_t(t.x)).slice(-l)+("0000000000"+_t(t.y)).slice(-l);return P.setPublicKeyHex(f),P}if("EC"===t.kty&&void 0!==t.crv&&void 0!==t.x&&void 0!==t.y&&void 0!==t.d){l=(P=new s({curve:t.crv})).ecparams.keylen/4,f="04"+("0000000000"+_t(t.x)).slice(-l)+("0000000000"+_t(t.y)).slice(-l);var d=("0000000000"+_t(t.d)).slice(-l);return P.setPublicKeyHex(f),P.setPrivateKeyHex(d),P}if("pkcs5prv"===r){var p,g=t,v=gt;if(9===(p=n(g,0)).length)(C=new u).readPKCS5PrvKeyHex(g);else if(6===p.length)(C=new a).readPKCS5PrvKeyHex(g);else{if(!(p.length>2&&"04"===g.substr(p[1],2)))throw"unsupported PKCS#1/5 hexadecimal key";(C=new s).readPKCS5PrvKeyHex(g)}return C}if("pkcs8prv"===r)return C=h.getKeyFromPlainPrivatePKCS8Hex(t);if("pkcs8pub"===r)return h._getKeyFromPublicPKCS8Hex(t);if("x509pub"===r)return zt.getPublicKeyFromCertHex(t);if(-1!=t.indexOf("-END CERTIFICATE-",0)||-1!=t.indexOf("-END X509 CERTIFICATE-",0)||-1!=t.indexOf("-END TRUSTED CERTIFICATE-",0))return zt.getPublicKeyFromCertPEM(t);if(-1!=t.indexOf("-END PUBLIC KEY-")){var y=Dt(t,"PUBLIC KEY");return h._getKeyFromPublicPKCS8Hex(y)}if(-1!=t.indexOf("-END RSA PRIVATE KEY-")&&-1==t.indexOf("4,ENCRYPTED")){var m=c(t,"RSA PRIVATE KEY");return h.getKey(m,null,"pkcs5prv")}if(-1!=t.indexOf("-END DSA PRIVATE KEY-")&&-1==t.indexOf("4,ENCRYPTED")){var S=i(k=c(t,"DSA PRIVATE KEY"),0,[1],"02"),b=i(k,0,[2],"02"),w=i(k,0,[3],"02"),F=i(k,0,[4],"02"),_=i(k,0,[5],"02");return(C=new a).setPrivate(new E(S,16),new E(b,16),new E(w,16),new E(F,16),new E(_,16)),C}if(-1!=t.indexOf("-END PRIVATE KEY-"))return h.getKeyFromPlainPrivatePKCS8PEM(t);if(-1!=t.indexOf("-END RSA PRIVATE KEY-")&&-1!=t.indexOf("4,ENCRYPTED")){var x=h.getDecryptedKeyHex(t,e),A=new at;return A.readPKCS5PrvKeyHex(x),A}if(-1!=t.indexOf("-END EC PRIVATE KEY-")&&-1!=t.indexOf("4,ENCRYPTED")){var P,C=i(k=h.getDecryptedKeyHex(t,e),0,[1],"04"),R=i(k,0,[2,0],"06"),T=i(k,0,[3,0],"03").substr(2);if(void 0===ft.crypto.OID.oidhex2name[R])throw"undefined OID(hex) in KJUR.crypto.OID: "+R;return(P=new s({curve:ft.crypto.OID.oidhex2name[R]})).setPublicKeyHex(T),P.setPrivateKeyHex(C),P.isPublic=!1,P}if(-1!=t.indexOf("-END DSA PRIVATE KEY-")&&-1!=t.indexOf("4,ENCRYPTED")){var k;S=i(k=h.getDecryptedKeyHex(t,e),0,[1],"02"),b=i(k,0,[2],"02"),w=i(k,0,[3],"02"),F=i(k,0,[4],"02"),_=i(k,0,[5],"02");return(C=new a).setPrivate(new E(S,16),new E(b,16),new E(w,16),new E(F,16),new E(_,16)),C}if(-1!=t.indexOf("-END ENCRYPTED PRIVATE KEY-"))return h.getKeyFromEncryptedPKCS8PEM(t,e);throw"not supported argument"},Kt.generateKeypair=function(t,e){if("RSA"==t){var r=e;(s=new at).generate(r,"10001"),s.isPrivate=!0,s.isPublic=!0;var n=new at,i=s.n.toString(16),o=s.e.toString(16);return n.setPublic(i,o),n.isPrivate=!1,n.isPublic=!0,(a={}).prvKeyObj=s,a.pubKeyObj=n,a}if("EC"==t){var s,a,u=e,c=new ft.crypto.ECDSA({curve:u}).generateKeyPairHex();return(s=new ft.crypto.ECDSA({curve:u})).setPublicKeyHex(c.ecpubhex),s.setPrivateKeyHex(c.ecprvhex),s.isPrivate=!0,s.isPublic=!1,(n=new ft.crypto.ECDSA({curve:u})).setPublicKeyHex(c.ecpubhex),n.isPrivate=!1,n.isPublic=!0,(a={}).prvKeyObj=s,a.pubKeyObj=n,a}throw"unknown algorithm: "+t},Kt.getPEM=function(t,e,r,n,i,o){var s=ft,a=s.asn1,u=a.DERObjectIdentifier,c=a.DERInteger,h=a.ASN1Util.newObject,l=a.x509.SubjectPublicKeyInfo,f=s.crypto,d=f.DSA,p=f.ECDSA,g=at;function v(t){return h({seq:[{int:0},{int:{bigint:t.n}},{int:t.e},{int:{bigint:t.d}},{int:{bigint:t.p}},{int:{bigint:t.q}},{int:{bigint:t.dmp1}},{int:{bigint:t.dmq1}},{int:{bigint:t.coeff}}]})}function m(t){return h({seq:[{int:1},{octstr:{hex:t.prvKeyHex}},{tag:["a0",!0,{oid:{name:t.curveName}}]},{tag:["a1",!0,{bitstr:{hex:"00"+t.pubKeyHex}}]}]})}function S(t){return h({seq:[{int:0},{int:{bigint:t.p}},{int:{bigint:t.q}},{int:{bigint:t.g}},{int:{bigint:t.y}},{int:{bigint:t.x}}]})}if((void 0!==g&&t instanceof g||void 0!==d&&t instanceof d||void 0!==p&&t instanceof p)&&1==t.isPublic&&(void 0===e||"PKCS8PUB"==e))return kt(_=new l(t).getEncodedHex(),"PUBLIC KEY");if("PKCS1PRV"==e&&void 0!==g&&t instanceof g&&(void 0===r||null==r)&&1==t.isPrivate)return kt(_=v(t).getEncodedHex(),"RSA PRIVATE KEY");if("PKCS1PRV"==e&&void 0!==p&&t instanceof p&&(void 0===r||null==r)&&1==t.isPrivate){var b=new u({name:t.curveName}).getEncodedHex(),w=m(t).getEncodedHex(),F="";return F+=kt(b,"EC PARAMETERS"),F+=kt(w,"EC PRIVATE KEY")}if("PKCS1PRV"==e&&void 0!==d&&t instanceof d&&(void 0===r||null==r)&&1==t.isPrivate)return kt(_=S(t).getEncodedHex(),"DSA PRIVATE KEY");if("PKCS5PRV"==e&&void 0!==g&&t instanceof g&&void 0!==r&&null!=r&&1==t.isPrivate){var _=v(t).getEncodedHex();return void 0===n&&(n="DES-EDE3-CBC"),this.getEncryptedPKCS5PEMFromPrvKeyHex("RSA",_,r,n,o)}if("PKCS5PRV"==e&&void 0!==p&&t instanceof p&&void 0!==r&&null!=r&&1==t.isPrivate){_=m(t).getEncodedHex();return void 0===n&&(n="DES-EDE3-CBC"),this.getEncryptedPKCS5PEMFromPrvKeyHex("EC",_,r,n,o)}if("PKCS5PRV"==e&&void 0!==d&&t instanceof d&&void 0!==r&&null!=r&&1==t.isPrivate){_=S(t).getEncodedHex();return void 0===n&&(n="DES-EDE3-CBC"),this.getEncryptedPKCS5PEMFromPrvKeyHex("DSA",_,r,n,o)}var E=function(t,e){var r=x(t,e);return new h({seq:[{seq:[{oid:{name:"pkcs5PBES2"}},{seq:[{seq:[{oid:{name:"pkcs5PBKDF2"}},{seq:[{octstr:{hex:r.pbkdf2Salt}},{int:r.pbkdf2Iter}]}]},{seq:[{oid:{name:"des-EDE3-CBC"}},{octstr:{hex:r.encryptionSchemeIV}}]}]}]},{octstr:{hex:r.ciphertext}}]}).getEncodedHex()},x=function(t,e){var r=y.lib.WordArray.random(8),n=y.lib.WordArray.random(8),i=y.PBKDF2(e,r,{keySize:6,iterations:100}),o=y.enc.Hex.parse(t),s=y.TripleDES.encrypt(o,i,{iv:n})+"",a={};return a.ciphertext=s,a.pbkdf2Salt=y.enc.Hex.stringify(r),a.pbkdf2Iter=100,a.encryptionSchemeAlg="DES-EDE3-CBC",a.encryptionSchemeIV=y.enc.Hex.stringify(n),a};if("PKCS8PRV"==e&&void 0!=g&&t instanceof g&&1==t.isPrivate){var A=v(t).getEncodedHex();_=h({seq:[{int:0},{seq:[{oid:{name:"rsaEncryption"}},{null:!0}]},{octstr:{hex:A}}]}).getEncodedHex();return void 0===r||null==r?kt(_,"PRIVATE KEY"):kt(w=E(_,r),"ENCRYPTED PRIVATE KEY")}if("PKCS8PRV"==e&&void 0!==p&&t instanceof p&&1==t.isPrivate){A=new h({seq:[{int:1},{octstr:{hex:t.prvKeyHex}},{tag:["a1",!0,{bitstr:{hex:"00"+t.pubKeyHex}}]}]}).getEncodedHex(),_=h({seq:[{int:0},{seq:[{oid:{name:"ecPublicKey"}},{oid:{name:t.curveName}}]},{octstr:{hex:A}}]}).getEncodedHex();return void 0===r||null==r?kt(_,"PRIVATE KEY"):kt(w=E(_,r),"ENCRYPTED PRIVATE KEY")}if("PKCS8PRV"==e&&void 0!==d&&t instanceof d&&1==t.isPrivate){A=new c({bigint:t.x}).getEncodedHex(),_=h({seq:[{int:0},{seq:[{oid:{name:"dsa"}},{seq:[{int:{bigint:t.p}},{int:{bigint:t.q}},{int:{bigint:t.g}}]}]},{octstr:{hex:A}}]}).getEncodedHex();return void 0===r||null==r?kt(_,"PRIVATE KEY"):kt(w=E(_,r),"ENCRYPTED PRIVATE KEY")}throw"unsupported object nor format"},Kt.getKeyFromCSRPEM=function(t){var e=Dt(t,"CERTIFICATE REQUEST");return Kt.getKeyFromCSRHex(e)},Kt.getKeyFromCSRHex=function(t){var e=Kt.parseCSRHex(t);return Kt.getKey(e.p8pubkeyhex,null,"pkcs8pub")},Kt.parseCSRHex=function(t){var e=gt,r=e.getChildIdx,n=e.getTLV,i={},o=t;if("30"!=o.substr(0,2))throw"malformed CSR(code:001)";var s=r(o,0);if(s.length<1)throw"malformed CSR(code:002)";if("30"!=o.substr(s[0],2))throw"malformed CSR(code:003)";var a=r(o,s[0]);if(a.length<3)throw"malformed CSR(code:004)";return i.p8pubkeyhex=n(o,a[2]),i},Kt.getJWKFromKey=function(t){var e={};if(t instanceof at&&t.isPrivate)return e.kty="RSA",e.n=Ft(t.n.toString(16)),e.e=Ft(t.e.toString(16)),e.d=Ft(t.d.toString(16)),e.p=Ft(t.p.toString(16)),e.q=Ft(t.q.toString(16)),e.dp=Ft(t.dmp1.toString(16)),e.dq=Ft(t.dmq1.toString(16)),e.qi=Ft(t.coeff.toString(16)),e;if(t instanceof at&&t.isPublic)return e.kty="RSA",e.n=Ft(t.n.toString(16)),e.e=Ft(t.e.toString(16)),e;if(t instanceof ft.crypto.ECDSA&&t.isPrivate){if("P-256"!==(n=t.getShortNISTPCurveName())&&"P-384"!==n)throw"unsupported curve name for JWT: "+n;var r=t.getPublicKeyXYHex();return e.kty="EC",e.crv=n,e.x=Ft(r.x),e.y=Ft(r.y),e.d=Ft(t.prvKeyHex),e}if(t instanceof ft.crypto.ECDSA&&t.isPublic){var n;if("P-256"!==(n=t.getShortNISTPCurveName())&&"P-384"!==n)throw"unsupported curve name for JWT: "+n;r=t.getPublicKeyXYHex();return e.kty="EC",e.crv=n,e.x=Ft(r.x),e.y=Ft(r.y),e}throw"not supported key object"},at.getPosArrayOfChildrenFromHex=function(t){return gt.getChildIdx(t,0)},at.getHexValueArrayOfChildrenFromHex=function(t){var e,r=gt.getV,n=r(t,(e=at.getPosArrayOfChildrenFromHex(t))[0]),i=r(t,e[1]),o=r(t,e[2]),s=r(t,e[3]),a=r(t,e[4]),u=r(t,e[5]),c=r(t,e[6]),h=r(t,e[7]),l=r(t,e[8]);return(e=new Array).push(n,i,o,s,a,u,c,h,l),e},at.prototype.readPrivateKeyFromPEMString=function(t){var e=Dt(t),r=at.getHexValueArrayOfChildrenFromHex(e);this.setPrivateEx(r[1],r[2],r[3],r[4],r[5],r[6],r[7],r[8])},at.prototype.readPKCS5PrvKeyHex=function(t){var e=at.getHexValueArrayOfChildrenFromHex(t);this.setPrivateEx(e[1],e[2],e[3],e[4],e[5],e[6],e[7],e[8])},at.prototype.readPKCS8PrvKeyHex=function(t){var e,r,n,i,o,s,a,u,c=gt,h=c.getVbyList;if(!1===c.isASN1HEX(t))throw"not ASN.1 hex string";try{e=h(t,0,[2,0,1],"02"),r=h(t,0,[2,0,2],"02"),n=h(t,0,[2,0,3],"02"),i=h(t,0,[2,0,4],"02"),o=h(t,0,[2,0,5],"02"),s=h(t,0,[2,0,6],"02"),a=h(t,0,[2,0,7],"02"),u=h(t,0,[2,0,8],"02")}catch(t){throw"malformed PKCS#8 plain RSA private key"}this.setPrivateEx(e,r,n,i,o,s,a,u)},at.prototype.readPKCS5PubKeyHex=function(t){var e=gt,r=e.getV;if(!1===e.isASN1HEX(t))throw"keyHex is not ASN.1 hex string";var n=e.getChildIdx(t,0);if(2!==n.length||"02"!==t.substr(n[0],2)||"02"!==t.substr(n[1],2))throw"wrong hex for PKCS#5 public key";var i=r(t,n[0]),o=r(t,n[1]);this.setPublic(i,o)},at.prototype.readPKCS8PubKeyHex=function(t){var e=gt;if(!1===e.isASN1HEX(t))throw"not ASN.1 hex string";if("06092a864886f70d010101"!==e.getTLVbyList(t,0,[0,0]))throw"not PKCS8 RSA public key";var r=e.getTLVbyList(t,0,[1,0]);this.readPKCS5PubKeyHex(r)},at.prototype.readCertPubKeyHex=function(t,e){var r,n;(r=new zt).readCertHex(t),n=r.getPublicKeyHex(),this.readPKCS8PubKeyHex(n)};var qt=new RegExp("");function Wt(t,e){for(var r="",n=e/4-t.length,i=0;i<n;i++)r+="0";return r+t}function Jt(t,e,r){for(var n="",i=0;n.length<e;)n+=At(r(Pt(t+String.fromCharCode.apply(String,[(4278190080&i)>>24,(16711680&i)>>16,(65280&i)>>8,255&i])))),i+=1;return n}function Yt(t){for(var e in ft.crypto.Util.DIGESTINFOHEAD){var r=ft.crypto.Util.DIGESTINFOHEAD[e],n=r.length;if(t.substring(0,n)==r)return[e,t.substring(n)]}return[]}function zt(){var t=gt,e=t.getChildIdx,r=t.getV,n=t.getTLV,i=t.getVbyList,o=t.getTLVbyList,s=t.getIdxbyList,a=t.getVidx,u=t.oidname,c=zt,h=Dt;this.hex=null,this.version=0,this.foffset=0,this.aExtInfo=null,this.getVersion=function(){return null===this.hex||0!==this.version?this.version:"a003020102"!==o(this.hex,0,[0,0])?(this.version=1,this.foffset=-1,1):(this.version=3,3)},this.getSerialNumberHex=function(){return i(this.hex,0,[0,1+this.foffset],"02")},this.getSignatureAlgorithmField=function(){return u(i(this.hex,0,[0,2+this.foffset,0],"06"))},this.getIssuerHex=function(){return o(this.hex,0,[0,3+this.foffset],"30")},this.getIssuerString=function(){return c.hex2dn(this.getIssuerHex())},this.getSubjectHex=function(){return o(this.hex,0,[0,5+this.foffset],"30")},this.getSubjectString=function(){return c.hex2dn(this.getSubjectHex())},this.getNotBefore=function(){var t=i(this.hex,0,[0,4+this.foffset,0]);return t=t.replace(/(..)/g,"%$1"),t=decodeURIComponent(t)},this.getNotAfter=function(){var t=i(this.hex,0,[0,4+this.foffset,1]);return t=t.replace(/(..)/g,"%$1"),t=decodeURIComponent(t)},this.getPublicKeyHex=function(){return t.getTLVbyList(this.hex,0,[0,6+this.foffset],"30")},this.getPublicKeyIdx=function(){return s(this.hex,0,[0,6+this.foffset],"30")},this.getPublicKeyContentIdx=function(){var t=this.getPublicKeyIdx();return s(this.hex,t,[1,0],"30")},this.getPublicKey=function(){return Kt.getKey(this.getPublicKeyHex(),null,"pkcs8pub")},this.getSignatureAlgorithmName=function(){return u(i(this.hex,0,[1,0],"06"))},this.getSignatureValueHex=function(){return i(this.hex,0,[2],"03",!0)},this.verifySignature=function(t){var e=this.getSignatureAlgorithmName(),r=this.getSignatureValueHex(),n=o(this.hex,0,[0],"30"),i=new ft.crypto.Signature({alg:e});return i.init(t),i.updateHex(n),i.verify(r)},this.parseExt=function(){if(3!==this.version)return-1;var r=s(this.hex,0,[0,7,0],"30"),n=e(this.hex,r);this.aExtInfo=new Array;for(var o=0;o<n.length;o++){var u={critical:!1},c=0;3===e(this.hex,n[o]).length&&(u.critical=!0,c=1),u.oid=t.hextooidstr(i(this.hex,n[o],[0],"06"));var h=s(this.hex,n[o],[1+c]);u.vidx=a(this.hex,h),this.aExtInfo.push(u)}},this.getExtInfo=function(t){var e=this.aExtInfo,r=t;if(t.match(/^[0-9.]+$/)||(r=ft.asn1.x509.OID.name2oid(t)),""!==r)for(var n=0;n<e.length;n++)if(e[n].oid===r)return e[n]},this.getExtBasicConstraints=function(){var t=this.getExtInfo("basicConstraints");if(void 0===t)return t;var e=r(this.hex,t.vidx);if(""===e)return{};if("0101ff"===e)return{cA:!0};if("0101ff02"===e.substr(0,8)){var n=r(e,6);return{cA:!0,pathLen:parseInt(n,16)}}throw"basicConstraints parse error"},this.getExtKeyUsageBin=function(){var t=this.getExtInfo("keyUsage");if(void 0===t)return"";var e=r(this.hex,t.vidx);if(e.length%2!=0||e.length<=2)throw"malformed key usage value";var n=parseInt(e.substr(0,2)),i=parseInt(e.substr(2),16).toString(2);return i.substr(0,i.length-n)},this.getExtKeyUsageString=function(){for(var t=this.getExtKeyUsageBin(),e=new Array,r=0;r<t.length;r++)"1"==t.substr(r,1)&&e.push(zt.KEYUSAGE_NAME[r]);return e.join(",")},this.getExtSubjectKeyIdentifier=function(){var t=this.getExtInfo("subjectKeyIdentifier");return void 0===t?t:r(this.hex,t.vidx)},this.getExtAuthorityKeyIdentifier=function(){var t=this.getExtInfo("authorityKeyIdentifier");if(void 0===t)return t;for(var i={},o=n(this.hex,t.vidx),s=e(o,0),a=0;a<s.length;a++)"80"===o.substr(s[a],2)&&(i.kid=r(o,s[a]));return i},this.getExtExtKeyUsageName=function(){var t=this.getExtInfo("extKeyUsage");if(void 0===t)return t;var i=new Array,o=n(this.hex,t.vidx);if(""===o)return i;for(var s=e(o,0),a=0;a<s.length;a++)i.push(u(r(o,s[a])));return i},this.getExtSubjectAltName=function(){for(var t=this.getExtSubjectAltName2(),e=new Array,r=0;r<t.length;r++)"DNS"===t[r][0]&&e.push(t[r][1]);return e},this.getExtSubjectAltName2=function(){var t,i,o,s=this.getExtInfo("subjectAltName");if(void 0===s)return s;for(var a=new Array,u=n(this.hex,s.vidx),c=e(u,0),h=0;h<c.length;h++)o=u.substr(c[h],2),t=r(u,c[h]),"81"===o&&(i=xt(t),a.push(["MAIL",i])),"82"===o&&(i=xt(t),a.push(["DNS",i])),"84"===o&&(i=zt.hex2dn(t,0),a.push(["DN",i])),"86"===o&&(i=xt(t),a.push(["URI",i])),"87"===o&&(i=Ht(t),a.push(["IP",i]));return a},this.getExtCRLDistributionPointsURI=function(){var t=this.getExtInfo("cRLDistributionPoints");if(void 0===t)return t;for(var r=new Array,n=e(this.hex,t.vidx),o=0;o<n.length;o++)try{var s=xt(i(this.hex,n[o],[0,0,0],"86"));r.push(s)}catch(t){}return r},this.getExtAIAInfo=function(){var t=this.getExtInfo("authorityInfoAccess");if(void 0===t)return t;for(var r={ocsp:[],caissuer:[]},n=e(this.hex,t.vidx),o=0;o<n.length;o++){var s=i(this.hex,n[o],[0],"06"),a=i(this.hex,n[o],[1],"86");"2b06010505073001"===s&&r.ocsp.push(xt(a)),"2b06010505073002"===s&&r.caissuer.push(xt(a))}return r},this.getExtCertificatePolicies=function(){var t=this.getExtInfo("certificatePolicies");if(void 0===t)return t;for(var o=n(this.hex,t.vidx),s=[],a=e(o,0),c=0;c<a.length;c++){var h={},l=e(o,a[c]);if(h.id=u(r(o,l[0])),2===l.length)for(var f=e(o,l[1]),d=0;d<f.length;d++){var p=i(o,f[d],[0],"06");"2b06010505070201"===p?h.cps=xt(i(o,f[d],[1])):"2b06010505070202"===p&&(h.unotice=xt(i(o,f[d],[1,0])))}s.push(h)}return s},this.readCertPEM=function(t){this.readCertHex(h(t))},this.readCertHex=function(t){this.hex=t,this.getVersion();try{s(this.hex,0,[0,7],"a3"),this.parseExt()}catch(t){}},this.getInfo=function(){var t,e,r;if(t="Basic Fields\n",t+="  serial number: "+this.getSerialNumberHex()+"\n",t+="  signature algorithm: "+this.getSignatureAlgorithmField()+"\n",t+="  issuer: "+this.getIssuerString()+"\n",t+="  notBefore: "+this.getNotBefore()+"\n",t+="  notAfter: "+this.getNotAfter()+"\n",t+="  subject: "+this.getSubjectString()+"\n",t+="  subject public key info: \n",t+="    key algorithm: "+(e=this.getPublicKey()).type+"\n","RSA"===e.type&&(t+="    n="+Mt(e.n.toString(16)).substr(0,16)+"...\n",t+="    e="+Mt(e.e.toString(16))+"\n"),void 0!==(r=this.aExtInfo)&&null!==r){t+="X509v3 Extensions:\n";for(var n=0;n<r.length;n++){var i=r[n],o=ft.asn1.x509.OID.oid2name(i.oid);""===o&&(o=i.oid);var s="";if(!0===i.critical&&(s="CRITICAL"),t+="  "+o+" "+s+":\n","basicConstraints"===o){var a=this.getExtBasicConstraints();void 0===a.cA?t+="    {}\n":(t+="    cA=true",void 0!==a.pathLen&&(t+=", pathLen="+a.pathLen),t+="\n")}else if("keyUsage"===o)t+="    "+this.getExtKeyUsageString()+"\n";else if("subjectKeyIdentifier"===o)t+="    "+this.getExtSubjectKeyIdentifier()+"\n";else if("authorityKeyIdentifier"===o){var u=this.getExtAuthorityKeyIdentifier();void 0!==u.kid&&(t+="    kid="+u.kid+"\n")}else{if("extKeyUsage"===o)t+="    "+this.getExtExtKeyUsageName().join(", ")+"\n";else if("subjectAltName"===o)t+="    "+this.getExtSubjectAltName2()+"\n";else if("cRLDistributionPoints"===o)t+="    "+this.getExtCRLDistributionPointsURI()+"\n";else if("authorityInfoAccess"===o){var c=this.getExtAIAInfo();void 0!==c.ocsp&&(t+="    ocsp: "+c.ocsp.join(",")+"\n"),void 0!==c.caissuer&&(t+="    caissuer: "+c.caissuer.join(",")+"\n")}else if("certificatePolicies"===o)for(var h=this.getExtCertificatePolicies(),l=0;l<h.length;l++)void 0!==h[l].id&&(t+="    policy oid: "+h[l].id+"\n"),void 0!==h[l].cps&&(t+="    cps: "+h[l].cps+"\n")}}}return t+="signature algorithm: "+this.getSignatureAlgorithmName()+"\n",t+="signature: "+this.getSignatureValueHex().substr(0,16)+"...\n"}}qt.compile("[^0-9a-f]","gi"),at.prototype.sign=function(t,e){var r,n=(r=t,ft.crypto.Util.hashString(r,e));return this.signWithMessageHash(n,e)},at.prototype.signWithMessageHash=function(t,e){var r=ot(ft.crypto.Util.getPaddedDigestInfoHex(t,e,this.n.bitLength()),16);return Wt(this.doPrivate(r).toString(16),this.n.bitLength())},at.prototype.signPSS=function(t,e,r){var n,i=(n=Pt(t),ft.crypto.Util.hashHex(n,e));return void 0===r&&(r=-1),this.signWithMessageHashPSS(i,e,r)},at.prototype.signWithMessageHashPSS=function(t,e,r){var n,i=At(t),o=i.length,s=this.n.bitLength()-1,a=Math.ceil(s/8),u=function(t){return ft.crypto.Util.hashHex(t,e)};if(-1===r||void 0===r)r=o;else if(-2===r)r=a-o-2;else if(r<-2)throw"invalid salt length";if(a<o+r+2)throw"data too long";var c="";r>0&&(c=new Array(r),(new it).nextBytes(c),c=String.fromCharCode.apply(String,c));var h=At(u(Pt("\0\0\0\0\0\0\0\0"+i+c))),l=[];for(n=0;n<a-r-o-2;n+=1)l[n]=0;var f=String.fromCharCode.apply(String,l)+""+c,d=Jt(h,f.length,u),p=[];for(n=0;n<f.length;n+=1)p[n]=f.charCodeAt(n)^d.charCodeAt(n);var g=65280>>8*a-s&255;for(p[0]&=~g,n=0;n<o;n++)p.push(h.charCodeAt(n));return p.push(188),Wt(this.doPrivate(new E(p)).toString(16),this.n.bitLength())},at.prototype.verify=function(t,e){var r=ot(e=(e=e.replace(qt,"")).replace(/[ \n]+/g,""),16);if(r.bitLength()>this.n.bitLength())return 0;var n=Yt(this.doPublic(r).toString(16).replace(/^1f+00/,""));if(0==n.length)return!1;var i,o=n[0];return n[1]==(i=t,ft.crypto.Util.hashString(i,o))},at.prototype.verifyWithMessageHash=function(t,e){var r=ot(e=(e=e.replace(qt,"")).replace(/[ \n]+/g,""),16);if(r.bitLength()>this.n.bitLength())return 0;var n=Yt(this.doPublic(r).toString(16).replace(/^1f+00/,""));if(0==n.length)return!1;n[0];return n[1]==t},at.prototype.verifyPSS=function(t,e,r,n){var i,o=(i=Pt(t),ft.crypto.Util.hashHex(i,r));return void 0===n&&(n=-1),this.verifyWithMessageHashPSS(o,e,r,n)},at.prototype.verifyWithMessageHashPSS=function(t,e,r,n){var i=new E(e,16);if(i.bitLength()>this.n.bitLength())return!1;var o,s=function(t){return ft.crypto.Util.hashHex(t,r)},a=At(t),u=a.length,c=this.n.bitLength()-1,h=Math.ceil(c/8);if(-1===n||void 0===n)n=u;else if(-2===n)n=h-u-2;else if(n<-2)throw"invalid salt length";if(h<u+n+2)throw"data too long";var l=this.doPublic(i).toByteArray();for(o=0;o<l.length;o+=1)l[o]&=255;for(;l.length<h;)l.unshift(0);if(188!==l[h-1])throw"encoded message does not end in 0xbc";var f=(l=String.fromCharCode.apply(String,l)).substr(0,h-u-1),d=l.substr(f.length,u),p=65280>>8*h-c&255;if(0!=(f.charCodeAt(0)&p))throw"bits beyond keysize not zero";var g=Jt(d,f.length,s),v=[];for(o=0;o<f.length;o+=1)v[o]=f.charCodeAt(o)^g.charCodeAt(o);v[0]&=~p;var y=h-u-n-2;for(o=0;o<y;o+=1)if(0!==v[o])throw"leftmost octets not zero";if(1!==v[y])throw"0x01 marker not found";return d===At(s(Pt("\0\0\0\0\0\0\0\0"+a+String.fromCharCode.apply(String,v.slice(-n)))))},at.SALT_LEN_HLEN=-1,at.SALT_LEN_MAX=-2,at.SALT_LEN_RECOVER=-2,zt.hex2dn=function(t,e){if(void 0===e&&(e=0),"30"!==t.substr(e,2))throw"malformed DN";for(var r=new Array,n=gt.getChildIdx(t,e),i=0;i<n.length;i++)r.push(zt.hex2rdn(t,n[i]));return"/"+(r=r.map(function(t){return t.replace("/","\\/")})).join("/")},zt.hex2rdn=function(t,e){if(void 0===e&&(e=0),"31"!==t.substr(e,2))throw"malformed RDN";for(var r=new Array,n=gt.getChildIdx(t,e),i=0;i<n.length;i++)r.push(zt.hex2attrTypeValue(t,n[i]));return(r=r.map(function(t){return t.replace("+","\\+")})).join("+")},zt.hex2attrTypeValue=function(t,e){var r=gt,n=r.getV;if(void 0===e&&(e=0),"30"!==t.substr(e,2))throw"malformed attribute type and value";var i=r.getChildIdx(t,e);2!==i.length||t.substr(i[0],2);var o=n(t,i[0]),s=ft.asn1.ASN1Util.oidHexToInt(o);return ft.asn1.x509.OID.oid2atype(s)+"="+At(n(t,i[1]))},zt.getPublicKeyFromCertHex=function(t){var e=new zt;return e.readCertHex(t),e.getPublicKey()},zt.getPublicKeyFromCertPEM=function(t){var e=new zt;return e.readCertPEM(t),e.getPublicKey()},zt.getPublicKeyInfoPropOfCertPEM=function(t){var e,r,n=gt.getVbyList,i={};return i.algparam=null,(e=new zt).readCertPEM(t),r=e.getPublicKeyHex(),i.keyhex=n(r,0,[1],"03").substr(2),i.algoid=n(r,0,[0,0],"06"),"2a8648ce3d0201"===i.algoid&&(i.algparam=n(r,0,[0,1],"06")),i},zt.KEYUSAGE_NAME=["digitalSignature","nonRepudiation","keyEncipherment","dataEncipherment","keyAgreement","keyCertSign","cRLSign","encipherOnly","decipherOnly"],void 0!==ft&&ft||(ft={}),void 0!==ft.jws&&ft.jws||(ft.jws={}),ft.jws.JWS=function(){var t=ft.jws.JWS.isSafeJSONString;this.parseJWS=function(e,r){if(void 0===this.parsedJWS||!r&&void 0===this.parsedJWS.sigvalH){var n=e.match(/^([^.]+)\.([^.]+)\.([^.]+)$/);if(null==n)throw"JWS signature is not a form of 'Head.Payload.SigValue'.";var i=n[1],o=n[2],s=n[3],a=i+"."+o;if(this.parsedJWS={},this.parsedJWS.headB64U=i,this.parsedJWS.payloadB64U=o,this.parsedJWS.sigvalB64U=s,this.parsedJWS.si=a,!r){var u=_t(s),c=ot(u,16);this.parsedJWS.sigvalH=u,this.parsedJWS.sigvalBI=c}var h=pt(i),l=pt(o);if(this.parsedJWS.headS=h,this.parsedJWS.payloadS=l,!t(h,this.parsedJWS,"headP"))throw"malformed JSON string for JWS Head: "+h}}},ft.jws.JWS.sign=function(t,e,n,i,o){var s,a,u,c=ft,h=c.jws.JWS,l=h.readSafeJSONString,f=h.isSafeJSONString,d=c.crypto,p=(d.ECDSA,d.Mac),g=d.Signature,v=JSON;if("string"!=typeof e&&"object"!=(void 0===e?"undefined":r(e)))throw"spHeader must be JSON string or object: "+e;if("object"==(void 0===e?"undefined":r(e))&&(a=e,s=v.stringify(a)),"string"==typeof e){if(!f(s=e))throw"JWS Head is not safe JSON string: "+s;a=l(s)}if(u=n,"object"==(void 0===n?"undefined":r(n))&&(u=v.stringify(n)),""!=t&&null!=t||void 0===a.alg||(t=a.alg),""!=t&&null!=t&&void 0===a.alg&&(a.alg=t,s=v.stringify(a)),t!==a.alg)throw"alg and sHeader.alg doesn't match: "+t+"!="+a.alg;var y=null;if(void 0===h.jwsalg2sigalg[t])throw"unsupported alg name: "+t;y=h.jwsalg2sigalg[t];var m=dt(s)+"."+dt(u),S="";if("Hmac"==y.substr(0,4)){if(void 0===i)throw"mac key shall be specified for HS* alg";var b=new p({alg:y,prov:"cryptojs",pass:i});b.updateString(m),S=b.doFinal()}else{var w;if(-1!=y.indexOf("withECDSA"))(w=new g({alg:y})).init(i,o),w.updateString(m),hASN1Sig=w.sign(),S=ft.crypto.ECDSA.asn1SigToConcatSig(hASN1Sig);else if("none"!=y)(w=new g({alg:y})).init(i,o),w.updateString(m),S=w.sign()}return m+"."+Ft(S)},ft.jws.JWS.verify=function(t,e,n){var i,o=ft,s=o.jws.JWS,a=s.readSafeJSONString,u=o.crypto,c=u.ECDSA,h=u.Mac,l=u.Signature;void 0!==r(at)&&(i=at);var f=t.split(".");if(3!==f.length)return!1;var d=f[0]+"."+f[1],p=_t(f[2]),g=a(pt(f[0])),v=null,y=null;if(void 0===g.alg)throw"algorithm not specified in header";if((y=(v=g.alg).substr(0,2),null!=n&&"[object Array]"===Object.prototype.toString.call(n)&&n.length>0)&&-1==(":"+n.join(":")+":").indexOf(":"+v+":"))throw"algorithm '"+v+"' not accepted in the list";if("none"!=v&&null===e)throw"key shall be specified to verify.";if("string"==typeof e&&-1!=e.indexOf("-----BEGIN ")&&(e=Kt.getKey(e)),!("RS"!=y&&"PS"!=y||e instanceof i))throw"key shall be a RSAKey obj for RS* and PS* algs";if("ES"==y&&!(e instanceof c))throw"key shall be a ECDSA obj for ES* algs";var m=null;if(void 0===s.jwsalg2sigalg[g.alg])throw"unsupported alg name: "+v;if("none"==(m=s.jwsalg2sigalg[v]))throw"not supported";if("Hmac"==m.substr(0,4)){if(void 0===e)throw"hexadecimal key shall be specified for HMAC";var S=new h({alg:m,pass:e});return S.updateString(d),p==S.doFinal()}if(-1!=m.indexOf("withECDSA")){var b,w=null;try{w=c.concatSigToASN1Sig(p)}catch(t){return!1}return(b=new l({alg:m})).init(e),b.updateString(d),b.verify(w)}return(b=new l({alg:m})).init(e),b.updateString(d),b.verify(p)},ft.jws.JWS.parse=function(t){var e,r,n,i=t.split("."),o={};if(2!=i.length&&3!=i.length)throw"malformed sJWS: wrong number of '.' splitted elements";return e=i[0],r=i[1],3==i.length&&(n=i[2]),o.headerObj=ft.jws.JWS.readSafeJSONString(pt(e)),o.payloadObj=ft.jws.JWS.readSafeJSONString(pt(r)),o.headerPP=JSON.stringify(o.headerObj,null,"  "),null==o.payloadObj?o.payloadPP=pt(r):o.payloadPP=JSON.stringify(o.payloadObj,null,"  "),void 0!==n&&(o.sigHex=_t(n)),o},ft.jws.JWS.verifyJWT=function(t,e,n){var i=ft.jws,o=i.JWS,s=o.readSafeJSONString,a=o.inArray,u=o.includedArray,c=t.split("."),h=c[0],l=c[1],f=(_t(c[2]),s(pt(h))),d=s(pt(l));if(void 0===f.alg)return!1;if(void 0===n.alg)throw"acceptField.alg shall be specified";if(!a(f.alg,n.alg))return!1;if(void 0!==d.iss&&"object"===r(n.iss)&&!a(d.iss,n.iss))return!1;if(void 0!==d.sub&&"object"===r(n.sub)&&!a(d.sub,n.sub))return!1;if(void 0!==d.aud&&"object"===r(n.aud))if("string"==typeof d.aud){if(!a(d.aud,n.aud))return!1}else if("object"==r(d.aud)&&!u(d.aud,n.aud))return!1;var p=i.IntDate.getNow();return void 0!==n.verifyAt&&"number"==typeof n.verifyAt&&(p=n.verifyAt),void 0!==n.gracePeriod&&"number"==typeof n.gracePeriod||(n.gracePeriod=0),!(void 0!==d.exp&&"number"==typeof d.exp&&d.exp+n.gracePeriod<p)&&(!(void 0!==d.nbf&&"number"==typeof d.nbf&&p<d.nbf-n.gracePeriod)&&(!(void 0!==d.iat&&"number"==typeof d.iat&&p<d.iat-n.gracePeriod)&&((void 0===d.jti||void 0===n.jti||d.jti===n.jti)&&!!o.verify(t,e,n.alg))))},ft.jws.JWS.includedArray=function(t,e){var n=ft.jws.JWS.inArray;if(null===t)return!1;if("object"!==(void 0===t?"undefined":r(t)))return!1;if("number"!=typeof t.length)return!1;for(var i=0;i<t.length;i++)if(!n(t[i],e))return!1;return!0},ft.jws.JWS.inArray=function(t,e){if(null===e)return!1;if("object"!==(void 0===e?"undefined":r(e)))return!1;if("number"!=typeof e.length)return!1;for(var n=0;n<e.length;n++)if(e[n]==t)return!0;return!1},ft.jws.JWS.jwsalg2sigalg={HS256:"HmacSHA256",HS384:"HmacSHA384",HS512:"HmacSHA512",RS256:"SHA256withRSA",RS384:"SHA384withRSA",RS512:"SHA512withRSA",ES256:"SHA256withECDSA",ES384:"SHA384withECDSA",PS256:"SHA256withRSAandMGF1",PS384:"SHA384withRSAandMGF1",PS512:"SHA512withRSAandMGF1",none:"none"},ft.jws.JWS.isSafeJSONString=function(t,e,n){var i=null;try{return"object"!=(void 0===(i=lt(t))?"undefined":r(i))?0:i.constructor===Array?0:(e&&(e[n]=i),1)}catch(t){return 0}},ft.jws.JWS.readSafeJSONString=function(t){var e=null;try{return"object"!=(void 0===(e=lt(t))?"undefined":r(e))?null:e.constructor===Array?null:e}catch(t){return null}},ft.jws.JWS.getEncodedSignatureValueFromJWS=function(t){var e=t.match(/^[^.]+\.[^.]+\.([^.]+)$/);if(null==e)throw"JWS signature is not a form of 'Head.Payload.SigValue'.";return e[1]},ft.jws.JWS.getJWKthumbprint=function(t){if("RSA"!==t.kty&&"EC"!==t.kty&&"oct"!==t.kty)throw"unsupported algorithm for JWK Thumprint";var e="{";if("RSA"===t.kty){if("string"!=typeof t.n||"string"!=typeof t.e)throw"wrong n and e value for RSA key";e+='"e":"'+t.e+'",',e+='"kty":"'+t.kty+'",',e+='"n":"'+t.n+'"}'}else if("EC"===t.kty){if("string"!=typeof t.crv||"string"!=typeof t.x||"string"!=typeof t.y)throw"wrong crv, x and y value for EC key";e+='"crv":"'+t.crv+'",',e+='"kty":"'+t.kty+'",',e+='"x":"'+t.x+'",',e+='"y":"'+t.y+'"}'}else if("oct"===t.kty){if("string"!=typeof t.k)throw"wrong k value for oct(symmetric) key";e+='"kty":"'+t.kty+'",',e+='"k":"'+t.k+'"}'}var r=Pt(e);return Ft(ft.crypto.Util.hashHex(r,"sha256"))},ft.jws.IntDate={},ft.jws.IntDate.get=function(t){var e=ft.jws.IntDate,r=e.getNow,n=e.getZulu;if("now"==t)return r();if("now + 1hour"==t)return r()+3600;if("now + 1day"==t)return r()+86400;if("now + 1month"==t)return r()+2592e3;if("now + 1year"==t)return r()+31536e3;if(t.match(/Z$/))return n(t);if(t.match(/^[0-9]+$/))return parseInt(t);throw"unsupported format: "+t},ft.jws.IntDate.getZulu=function(t){return Nt(t)},ft.jws.IntDate.getNow=function(){return~~(new Date/1e3)},ft.jws.IntDate.intDate2UTCString=function(t){return new Date(1e3*t).toUTCString()},ft.jws.IntDate.intDate2Zulu=function(t){var e=new Date(1e3*t);return("0000"+e.getUTCFullYear()).slice(-4)+("00"+(e.getUTCMonth()+1)).slice(-2)+("00"+e.getUTCDate()).slice(-2)+("00"+e.getUTCHours()).slice(-2)+("00"+e.getUTCMinutes()).slice(-2)+("00"+e.getUTCSeconds()).slice(-2)+"Z"},e.SecureRandom=it,e.rng_seed_time=Z,e.BigInteger=E,e.RSAKey=at,e.ECDSA=ft.crypto.ECDSA,e.DSA=ft.crypto.DSA,e.Signature=ft.crypto.Signature,e.MessageDigest=ft.crypto.MessageDigest,e.Mac=ft.crypto.Mac,e.Cipher=ft.crypto.Cipher,e.KEYUTIL=Kt,e.ASN1HEX=gt,e.X509=zt,e.CryptoJS=y,e.b64tohex=F,e.b64toBA=_,e.stoBA=vt,e.BAtos=yt,e.BAtohex=mt,e.stohex=St,e.stob64=function(t){return w(St(t))},e.stob64u=function(t){return bt(w(St(t)))},e.b64utos=function(t){return yt(_(wt(t)))},e.b64tob64u=bt,e.b64utob64=wt,e.hex2b64=w,e.hextob64u=Ft,e.b64utohex=_t,e.utf8tob64u=dt,e.b64utoutf8=pt,e.utf8tob64=function(t){return w(Bt(Ut(t)))},e.b64toutf8=function(t){return decodeURIComponent(jt(F(t)))},e.utf8tohex=Et,e.hextoutf8=xt,e.hextorstr=At,e.rstrtohex=Pt,e.hextob64=Ct,e.hextob64nl=Rt,e.b64nltohex=Tt,e.hextopem=kt,e.pemtohex=Dt,e.hextoArrayBuffer=function(t){if(t.length%2!=0)throw"input is not even length";if(null==t.match(/^[0-9A-Fa-f]+$/))throw"input is not hexadecimal";for(var e=new ArrayBuffer(t.length/2),r=new DataView(e),n=0;n<t.length/2;n++)r.setUint8(n,parseInt(t.substr(2*n,2),16));return e},e.ArrayBuffertohex=function(t){for(var e="",r=new DataView(t),n=0;n<t.byteLength;n++)e+=("00"+r.getUint8(n).toString(16)).slice(-2);return e},e.zulutomsec=It,e.zulutosec=Nt,e.zulutodate=function(t){return new Date(It(t))},e.datetozulu=function(t,e,r){var n,i=t.getUTCFullYear();if(e){if(i<1950||2049<i)throw"not proper year for UTCTime: "+i;n=(""+i).slice(-2)}else n=("000"+i).slice(-4);if(n+=("0"+(t.getUTCMonth()+1)).slice(-2),n+=("0"+t.getUTCDate()).slice(-2),n+=("0"+t.getUTCHours()).slice(-2),n+=("0"+t.getUTCMinutes()).slice(-2),n+=("0"+t.getUTCSeconds()).slice(-2),r){var o=t.getUTCMilliseconds();0!==o&&(n+="."+(o=(o=("00"+o).slice(-3)).replace(/0+$/g,"")))}return n+="Z"},e.uricmptohex=Bt,e.hextouricmp=jt,e.ipv6tohex=Lt,e.hextoipv6=Ot,e.hextoip=Ht,e.iptohex=function(t){var e="malformed IP address";if(!(t=t.toLowerCase(t)).match(/^[0-9.]+$/)){if(t.match(/^[0-9a-f:]+$/)&&-1!==t.indexOf(":"))return Lt(t);throw e}var r=t.split(".");if(4!==r.length)throw e;var n="";try{for(var i=0;i<4;i++)n+=("0"+parseInt(r[i]).toString(16)).slice(-2);return n}catch(t){throw e}},e.encodeURIComponentAll=Ut,e.newline_toUnix=function(t){return t=t.replace(/\r\n/gm,"\n")},e.newline_toDos=function(t){return t=(t=t.replace(/\r\n/gm,"\n")).replace(/\n/gm,"\r\n")},e.hextoposhex=Mt,e.intarystrtohex=Vt,e.strdiffidx=function(t,e){var r=t.length;t.length>e.length&&(r=e.length);for(var n=0;n<r;n++)if(t.charCodeAt(n)!=e.charCodeAt(n))return n;return t.length!=e.length?r:-1},e.KJUR=ft,e.crypto=ft.crypto,e.asn1=ft.asn1,e.jws=ft.jws,e.lang=ft.lang}).call(e,r(24).Buffer)},function(t,e,r){"use strict";(function(t){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
var n=r(26),i=r(27),o=r(28);function s(){return u.TYPED_ARRAY_SUPPORT?2147483647:1073741823}function a(t,e){if(s()<e)throw new RangeError("Invalid typed array length");return u.TYPED_ARRAY_SUPPORT?(t=new Uint8Array(e)).__proto__=u.prototype:(null===t&&(t=new u(e)),t.length=e),t}function u(t,e,r){if(!(u.TYPED_ARRAY_SUPPORT||this instanceof u))return new u(t,e,r);if("number"==typeof t){if("string"==typeof e)throw new Error("If encoding is specified then the first argument must be a string");return l(this,t)}return c(this,t,e,r)}function c(t,e,r,n){if("number"==typeof e)throw new TypeError('"value" argument must not be a number');return"undefined"!=typeof ArrayBuffer&&e instanceof ArrayBuffer?function(t,e,r,n){if(e.byteLength,r<0||e.byteLength<r)throw new RangeError("'offset' is out of bounds");if(e.byteLength<r+(n||0))throw new RangeError("'length' is out of bounds");e=void 0===r&&void 0===n?new Uint8Array(e):void 0===n?new Uint8Array(e,r):new Uint8Array(e,r,n);u.TYPED_ARRAY_SUPPORT?(t=e).__proto__=u.prototype:t=f(t,e);return t}(t,e,r,n):"string"==typeof e?function(t,e,r){"string"==typeof r&&""!==r||(r="utf8");if(!u.isEncoding(r))throw new TypeError('"encoding" must be a valid string encoding');var n=0|p(e,r),i=(t=a(t,n)).write(e,r);i!==n&&(t=t.slice(0,i));return t}(t,e,r):function(t,e){if(u.isBuffer(e)){var r=0|d(e.length);return 0===(t=a(t,r)).length?t:(e.copy(t,0,0,r),t)}if(e){if("undefined"!=typeof ArrayBuffer&&e.buffer instanceof ArrayBuffer||"length"in e)return"number"!=typeof e.length||(n=e.length)!=n?a(t,0):f(t,e);if("Buffer"===e.type&&o(e.data))return f(t,e.data)}var n;throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.")}(t,e)}function h(t){if("number"!=typeof t)throw new TypeError('"size" argument must be a number');if(t<0)throw new RangeError('"size" argument must not be negative')}function l(t,e){if(h(e),t=a(t,e<0?0:0|d(e)),!u.TYPED_ARRAY_SUPPORT)for(var r=0;r<e;++r)t[r]=0;return t}function f(t,e){var r=e.length<0?0:0|d(e.length);t=a(t,r);for(var n=0;n<r;n+=1)t[n]=255&e[n];return t}function d(t){if(t>=s())throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x"+s().toString(16)+" bytes");return 0|t}function p(t,e){if(u.isBuffer(t))return t.length;if("undefined"!=typeof ArrayBuffer&&"function"==typeof ArrayBuffer.isView&&(ArrayBuffer.isView(t)||t instanceof ArrayBuffer))return t.byteLength;"string"!=typeof t&&(t=""+t);var r=t.length;if(0===r)return 0;for(var n=!1;;)switch(e){case"ascii":case"latin1":case"binary":return r;case"utf8":case"utf-8":case void 0:return U(t).length;case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return 2*r;case"hex":return r>>>1;case"base64":return M(t).length;default:if(n)return U(t).length;e=(""+e).toLowerCase(),n=!0}}function g(t,e,r){var n=t[e];t[e]=t[r],t[r]=n}function v(t,e,r,n,i){if(0===t.length)return-1;if("string"==typeof r?(n=r,r=0):r>2147483647?r=2147483647:r<-2147483648&&(r=-2147483648),r=+r,isNaN(r)&&(r=i?0:t.length-1),r<0&&(r=t.length+r),r>=t.length){if(i)return-1;r=t.length-1}else if(r<0){if(!i)return-1;r=0}if("string"==typeof e&&(e=u.from(e,n)),u.isBuffer(e))return 0===e.length?-1:y(t,e,r,n,i);if("number"==typeof e)return e&=255,u.TYPED_ARRAY_SUPPORT&&"function"==typeof Uint8Array.prototype.indexOf?i?Uint8Array.prototype.indexOf.call(t,e,r):Uint8Array.prototype.lastIndexOf.call(t,e,r):y(t,[e],r,n,i);throw new TypeError("val must be string, number or Buffer")}function y(t,e,r,n,i){var o,s=1,a=t.length,u=e.length;if(void 0!==n&&("ucs2"===(n=String(n).toLowerCase())||"ucs-2"===n||"utf16le"===n||"utf-16le"===n)){if(t.length<2||e.length<2)return-1;s=2,a/=2,u/=2,r/=2}function c(t,e){return 1===s?t[e]:t.readUInt16BE(e*s)}if(i){var h=-1;for(o=r;o<a;o++)if(c(t,o)===c(e,-1===h?0:o-h)){if(-1===h&&(h=o),o-h+1===u)return h*s}else-1!==h&&(o-=o-h),h=-1}else for(r+u>a&&(r=a-u),o=r;o>=0;o--){for(var l=!0,f=0;f<u;f++)if(c(t,o+f)!==c(e,f)){l=!1;break}if(l)return o}return-1}function m(t,e,r,n){r=Number(r)||0;var i=t.length-r;n?(n=Number(n))>i&&(n=i):n=i;var o=e.length;if(o%2!=0)throw new TypeError("Invalid hex string");n>o/2&&(n=o/2);for(var s=0;s<n;++s){var a=parseInt(e.substr(2*s,2),16);if(isNaN(a))return s;t[r+s]=a}return s}function S(t,e,r,n){return V(U(e,t.length-r),t,r,n)}function b(t,e,r,n){return V(function(t){for(var e=[],r=0;r<t.length;++r)e.push(255&t.charCodeAt(r));return e}(e),t,r,n)}function w(t,e,r,n){return b(t,e,r,n)}function F(t,e,r,n){return V(M(e),t,r,n)}function _(t,e,r,n){return V(function(t,e){for(var r,n,i,o=[],s=0;s<t.length&&!((e-=2)<0);++s)r=t.charCodeAt(s),n=r>>8,i=r%256,o.push(i),o.push(n);return o}(e,t.length-r),t,r,n)}function E(t,e,r){return 0===e&&r===t.length?n.fromByteArray(t):n.fromByteArray(t.slice(e,r))}function x(t,e,r){r=Math.min(t.length,r);for(var n=[],i=e;i<r;){var o,s,a,u,c=t[i],h=null,l=c>239?4:c>223?3:c>191?2:1;if(i+l<=r)switch(l){case 1:c<128&&(h=c);break;case 2:128==(192&(o=t[i+1]))&&(u=(31&c)<<6|63&o)>127&&(h=u);break;case 3:o=t[i+1],s=t[i+2],128==(192&o)&&128==(192&s)&&(u=(15&c)<<12|(63&o)<<6|63&s)>2047&&(u<55296||u>57343)&&(h=u);break;case 4:o=t[i+1],s=t[i+2],a=t[i+3],128==(192&o)&&128==(192&s)&&128==(192&a)&&(u=(15&c)<<18|(63&o)<<12|(63&s)<<6|63&a)>65535&&u<1114112&&(h=u)}null===h?(h=65533,l=1):h>65535&&(h-=65536,n.push(h>>>10&1023|55296),h=56320|1023&h),n.push(h),i+=l}return function(t){var e=t.length;if(e<=A)return String.fromCharCode.apply(String,t);var r="",n=0;for(;n<e;)r+=String.fromCharCode.apply(String,t.slice(n,n+=A));return r}(n)}e.Buffer=u,e.SlowBuffer=function(t){+t!=t&&(t=0);return u.alloc(+t)},e.INSPECT_MAX_BYTES=50,u.TYPED_ARRAY_SUPPORT=void 0!==t.TYPED_ARRAY_SUPPORT?t.TYPED_ARRAY_SUPPORT:function(){try{var t=new Uint8Array(1);return t.__proto__={__proto__:Uint8Array.prototype,foo:function(){return 42}},42===t.foo()&&"function"==typeof t.subarray&&0===t.subarray(1,1).byteLength}catch(t){return!1}}(),e.kMaxLength=s(),u.poolSize=8192,u._augment=function(t){return t.__proto__=u.prototype,t},u.from=function(t,e,r){return c(null,t,e,r)},u.TYPED_ARRAY_SUPPORT&&(u.prototype.__proto__=Uint8Array.prototype,u.__proto__=Uint8Array,"undefined"!=typeof Symbol&&Symbol.species&&u[Symbol.species]===u&&Object.defineProperty(u,Symbol.species,{value:null,configurable:!0})),u.alloc=function(t,e,r){return function(t,e,r,n){return h(e),e<=0?a(t,e):void 0!==r?"string"==typeof n?a(t,e).fill(r,n):a(t,e).fill(r):a(t,e)}(null,t,e,r)},u.allocUnsafe=function(t){return l(null,t)},u.allocUnsafeSlow=function(t){return l(null,t)},u.isBuffer=function(t){return!(null==t||!t._isBuffer)},u.compare=function(t,e){if(!u.isBuffer(t)||!u.isBuffer(e))throw new TypeError("Arguments must be Buffers");if(t===e)return 0;for(var r=t.length,n=e.length,i=0,o=Math.min(r,n);i<o;++i)if(t[i]!==e[i]){r=t[i],n=e[i];break}return r<n?-1:n<r?1:0},u.isEncoding=function(t){switch(String(t).toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"latin1":case"binary":case"base64":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return!0;default:return!1}},u.concat=function(t,e){if(!o(t))throw new TypeError('"list" argument must be an Array of Buffers');if(0===t.length)return u.alloc(0);var r;if(void 0===e)for(e=0,r=0;r<t.length;++r)e+=t[r].length;var n=u.allocUnsafe(e),i=0;for(r=0;r<t.length;++r){var s=t[r];if(!u.isBuffer(s))throw new TypeError('"list" argument must be an Array of Buffers');s.copy(n,i),i+=s.length}return n},u.byteLength=p,u.prototype._isBuffer=!0,u.prototype.swap16=function(){var t=this.length;if(t%2!=0)throw new RangeError("Buffer size must be a multiple of 16-bits");for(var e=0;e<t;e+=2)g(this,e,e+1);return this},u.prototype.swap32=function(){var t=this.length;if(t%4!=0)throw new RangeError("Buffer size must be a multiple of 32-bits");for(var e=0;e<t;e+=4)g(this,e,e+3),g(this,e+1,e+2);return this},u.prototype.swap64=function(){var t=this.length;if(t%8!=0)throw new RangeError("Buffer size must be a multiple of 64-bits");for(var e=0;e<t;e+=8)g(this,e,e+7),g(this,e+1,e+6),g(this,e+2,e+5),g(this,e+3,e+4);return this},u.prototype.toString=function(){var t=0|this.length;return 0===t?"":0===arguments.length?x(this,0,t):function(t,e,r){var n=!1;if((void 0===e||e<0)&&(e=0),e>this.length)return"";if((void 0===r||r>this.length)&&(r=this.length),r<=0)return"";if((r>>>=0)<=(e>>>=0))return"";for(t||(t="utf8");;)switch(t){case"hex":return R(this,e,r);case"utf8":case"utf-8":return x(this,e,r);case"ascii":return P(this,e,r);case"latin1":case"binary":return C(this,e,r);case"base64":return E(this,e,r);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return T(this,e,r);default:if(n)throw new TypeError("Unknown encoding: "+t);t=(t+"").toLowerCase(),n=!0}}.apply(this,arguments)},u.prototype.equals=function(t){if(!u.isBuffer(t))throw new TypeError("Argument must be a Buffer");return this===t||0===u.compare(this,t)},u.prototype.inspect=function(){var t="",r=e.INSPECT_MAX_BYTES;return this.length>0&&(t=this.toString("hex",0,r).match(/.{2}/g).join(" "),this.length>r&&(t+=" ... ")),"<Buffer "+t+">"},u.prototype.compare=function(t,e,r,n,i){if(!u.isBuffer(t))throw new TypeError("Argument must be a Buffer");if(void 0===e&&(e=0),void 0===r&&(r=t?t.length:0),void 0===n&&(n=0),void 0===i&&(i=this.length),e<0||r>t.length||n<0||i>this.length)throw new RangeError("out of range index");if(n>=i&&e>=r)return 0;if(n>=i)return-1;if(e>=r)return 1;if(e>>>=0,r>>>=0,n>>>=0,i>>>=0,this===t)return 0;for(var o=i-n,s=r-e,a=Math.min(o,s),c=this.slice(n,i),h=t.slice(e,r),l=0;l<a;++l)if(c[l]!==h[l]){o=c[l],s=h[l];break}return o<s?-1:s<o?1:0},u.prototype.includes=function(t,e,r){return-1!==this.indexOf(t,e,r)},u.prototype.indexOf=function(t,e,r){return v(this,t,e,r,!0)},u.prototype.lastIndexOf=function(t,e,r){return v(this,t,e,r,!1)},u.prototype.write=function(t,e,r,n){if(void 0===e)n="utf8",r=this.length,e=0;else if(void 0===r&&"string"==typeof e)n=e,r=this.length,e=0;else{if(!isFinite(e))throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");e|=0,isFinite(r)?(r|=0,void 0===n&&(n="utf8")):(n=r,r=void 0)}var i=this.length-e;if((void 0===r||r>i)&&(r=i),t.length>0&&(r<0||e<0)||e>this.length)throw new RangeError("Attempt to write outside buffer bounds");n||(n="utf8");for(var o=!1;;)switch(n){case"hex":return m(this,t,e,r);case"utf8":case"utf-8":return S(this,t,e,r);case"ascii":return b(this,t,e,r);case"latin1":case"binary":return w(this,t,e,r);case"base64":return F(this,t,e,r);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return _(this,t,e,r);default:if(o)throw new TypeError("Unknown encoding: "+n);n=(""+n).toLowerCase(),o=!0}},u.prototype.toJSON=function(){return{type:"Buffer",data:Array.prototype.slice.call(this._arr||this,0)}};var A=4096;function P(t,e,r){var n="";r=Math.min(t.length,r);for(var i=e;i<r;++i)n+=String.fromCharCode(127&t[i]);return n}function C(t,e,r){var n="";r=Math.min(t.length,r);for(var i=e;i<r;++i)n+=String.fromCharCode(t[i]);return n}function R(t,e,r){var n=t.length;(!e||e<0)&&(e=0),(!r||r<0||r>n)&&(r=n);for(var i="",o=e;o<r;++o)i+=H(t[o]);return i}function T(t,e,r){for(var n=t.slice(e,r),i="",o=0;o<n.length;o+=2)i+=String.fromCharCode(n[o]+256*n[o+1]);return i}function k(t,e,r){if(t%1!=0||t<0)throw new RangeError("offset is not uint");if(t+e>r)throw new RangeError("Trying to access beyond buffer length")}function D(t,e,r,n,i,o){if(!u.isBuffer(t))throw new TypeError('"buffer" argument must be a Buffer instance');if(e>i||e<o)throw new RangeError('"value" argument is out of bounds');if(r+n>t.length)throw new RangeError("Index out of range")}function I(t,e,r,n){e<0&&(e=65535+e+1);for(var i=0,o=Math.min(t.length-r,2);i<o;++i)t[r+i]=(e&255<<8*(n?i:1-i))>>>8*(n?i:1-i)}function N(t,e,r,n){e<0&&(e=4294967295+e+1);for(var i=0,o=Math.min(t.length-r,4);i<o;++i)t[r+i]=e>>>8*(n?i:3-i)&255}function B(t,e,r,n,i,o){if(r+n>t.length)throw new RangeError("Index out of range");if(r<0)throw new RangeError("Index out of range")}function j(t,e,r,n,o){return o||B(t,0,r,4),i.write(t,e,r,n,23,4),r+4}function L(t,e,r,n,o){return o||B(t,0,r,8),i.write(t,e,r,n,52,8),r+8}u.prototype.slice=function(t,e){var r,n=this.length;if(t=~~t,e=void 0===e?n:~~e,t<0?(t+=n)<0&&(t=0):t>n&&(t=n),e<0?(e+=n)<0&&(e=0):e>n&&(e=n),e<t&&(e=t),u.TYPED_ARRAY_SUPPORT)(r=this.subarray(t,e)).__proto__=u.prototype;else{var i=e-t;r=new u(i,void 0);for(var o=0;o<i;++o)r[o]=this[o+t]}return r},u.prototype.readUIntLE=function(t,e,r){t|=0,e|=0,r||k(t,e,this.length);for(var n=this[t],i=1,o=0;++o<e&&(i*=256);)n+=this[t+o]*i;return n},u.prototype.readUIntBE=function(t,e,r){t|=0,e|=0,r||k(t,e,this.length);for(var n=this[t+--e],i=1;e>0&&(i*=256);)n+=this[t+--e]*i;return n},u.prototype.readUInt8=function(t,e){return e||k(t,1,this.length),this[t]},u.prototype.readUInt16LE=function(t,e){return e||k(t,2,this.length),this[t]|this[t+1]<<8},u.prototype.readUInt16BE=function(t,e){return e||k(t,2,this.length),this[t]<<8|this[t+1]},u.prototype.readUInt32LE=function(t,e){return e||k(t,4,this.length),(this[t]|this[t+1]<<8|this[t+2]<<16)+16777216*this[t+3]},u.prototype.readUInt32BE=function(t,e){return e||k(t,4,this.length),16777216*this[t]+(this[t+1]<<16|this[t+2]<<8|this[t+3])},u.prototype.readIntLE=function(t,e,r){t|=0,e|=0,r||k(t,e,this.length);for(var n=this[t],i=1,o=0;++o<e&&(i*=256);)n+=this[t+o]*i;return n>=(i*=128)&&(n-=Math.pow(2,8*e)),n},u.prototype.readIntBE=function(t,e,r){t|=0,e|=0,r||k(t,e,this.length);for(var n=e,i=1,o=this[t+--n];n>0&&(i*=256);)o+=this[t+--n]*i;return o>=(i*=128)&&(o-=Math.pow(2,8*e)),o},u.prototype.readInt8=function(t,e){return e||k(t,1,this.length),128&this[t]?-1*(255-this[t]+1):this[t]},u.prototype.readInt16LE=function(t,e){e||k(t,2,this.length);var r=this[t]|this[t+1]<<8;return 32768&r?4294901760|r:r},u.prototype.readInt16BE=function(t,e){e||k(t,2,this.length);var r=this[t+1]|this[t]<<8;return 32768&r?4294901760|r:r},u.prototype.readInt32LE=function(t,e){return e||k(t,4,this.length),this[t]|this[t+1]<<8|this[t+2]<<16|this[t+3]<<24},u.prototype.readInt32BE=function(t,e){return e||k(t,4,this.length),this[t]<<24|this[t+1]<<16|this[t+2]<<8|this[t+3]},u.prototype.readFloatLE=function(t,e){return e||k(t,4,this.length),i.read(this,t,!0,23,4)},u.prototype.readFloatBE=function(t,e){return e||k(t,4,this.length),i.read(this,t,!1,23,4)},u.prototype.readDoubleLE=function(t,e){return e||k(t,8,this.length),i.read(this,t,!0,52,8)},u.prototype.readDoubleBE=function(t,e){return e||k(t,8,this.length),i.read(this,t,!1,52,8)},u.prototype.writeUIntLE=function(t,e,r,n){(t=+t,e|=0,r|=0,n)||D(this,t,e,r,Math.pow(2,8*r)-1,0);var i=1,o=0;for(this[e]=255&t;++o<r&&(i*=256);)this[e+o]=t/i&255;return e+r},u.prototype.writeUIntBE=function(t,e,r,n){(t=+t,e|=0,r|=0,n)||D(this,t,e,r,Math.pow(2,8*r)-1,0);var i=r-1,o=1;for(this[e+i]=255&t;--i>=0&&(o*=256);)this[e+i]=t/o&255;return e+r},u.prototype.writeUInt8=function(t,e,r){return t=+t,e|=0,r||D(this,t,e,1,255,0),u.TYPED_ARRAY_SUPPORT||(t=Math.floor(t)),this[e]=255&t,e+1},u.prototype.writeUInt16LE=function(t,e,r){return t=+t,e|=0,r||D(this,t,e,2,65535,0),u.TYPED_ARRAY_SUPPORT?(this[e]=255&t,this[e+1]=t>>>8):I(this,t,e,!0),e+2},u.prototype.writeUInt16BE=function(t,e,r){return t=+t,e|=0,r||D(this,t,e,2,65535,0),u.TYPED_ARRAY_SUPPORT?(this[e]=t>>>8,this[e+1]=255&t):I(this,t,e,!1),e+2},u.prototype.writeUInt32LE=function(t,e,r){return t=+t,e|=0,r||D(this,t,e,4,4294967295,0),u.TYPED_ARRAY_SUPPORT?(this[e+3]=t>>>24,this[e+2]=t>>>16,this[e+1]=t>>>8,this[e]=255&t):N(this,t,e,!0),e+4},u.prototype.writeUInt32BE=function(t,e,r){return t=+t,e|=0,r||D(this,t,e,4,4294967295,0),u.TYPED_ARRAY_SUPPORT?(this[e]=t>>>24,this[e+1]=t>>>16,this[e+2]=t>>>8,this[e+3]=255&t):N(this,t,e,!1),e+4},u.prototype.writeIntLE=function(t,e,r,n){if(t=+t,e|=0,!n){var i=Math.pow(2,8*r-1);D(this,t,e,r,i-1,-i)}var o=0,s=1,a=0;for(this[e]=255&t;++o<r&&(s*=256);)t<0&&0===a&&0!==this[e+o-1]&&(a=1),this[e+o]=(t/s>>0)-a&255;return e+r},u.prototype.writeIntBE=function(t,e,r,n){if(t=+t,e|=0,!n){var i=Math.pow(2,8*r-1);D(this,t,e,r,i-1,-i)}var o=r-1,s=1,a=0;for(this[e+o]=255&t;--o>=0&&(s*=256);)t<0&&0===a&&0!==this[e+o+1]&&(a=1),this[e+o]=(t/s>>0)-a&255;return e+r},u.prototype.writeInt8=function(t,e,r){return t=+t,e|=0,r||D(this,t,e,1,127,-128),u.TYPED_ARRAY_SUPPORT||(t=Math.floor(t)),t<0&&(t=255+t+1),this[e]=255&t,e+1},u.prototype.writeInt16LE=function(t,e,r){return t=+t,e|=0,r||D(this,t,e,2,32767,-32768),u.TYPED_ARRAY_SUPPORT?(this[e]=255&t,this[e+1]=t>>>8):I(this,t,e,!0),e+2},u.prototype.writeInt16BE=function(t,e,r){return t=+t,e|=0,r||D(this,t,e,2,32767,-32768),u.TYPED_ARRAY_SUPPORT?(this[e]=t>>>8,this[e+1]=255&t):I(this,t,e,!1),e+2},u.prototype.writeInt32LE=function(t,e,r){return t=+t,e|=0,r||D(this,t,e,4,2147483647,-2147483648),u.TYPED_ARRAY_SUPPORT?(this[e]=255&t,this[e+1]=t>>>8,this[e+2]=t>>>16,this[e+3]=t>>>24):N(this,t,e,!0),e+4},u.prototype.writeInt32BE=function(t,e,r){return t=+t,e|=0,r||D(this,t,e,4,2147483647,-2147483648),t<0&&(t=4294967295+t+1),u.TYPED_ARRAY_SUPPORT?(this[e]=t>>>24,this[e+1]=t>>>16,this[e+2]=t>>>8,this[e+3]=255&t):N(this,t,e,!1),e+4},u.prototype.writeFloatLE=function(t,e,r){return j(this,t,e,!0,r)},u.prototype.writeFloatBE=function(t,e,r){return j(this,t,e,!1,r)},u.prototype.writeDoubleLE=function(t,e,r){return L(this,t,e,!0,r)},u.prototype.writeDoubleBE=function(t,e,r){return L(this,t,e,!1,r)},u.prototype.copy=function(t,e,r,n){if(r||(r=0),n||0===n||(n=this.length),e>=t.length&&(e=t.length),e||(e=0),n>0&&n<r&&(n=r),n===r)return 0;if(0===t.length||0===this.length)return 0;if(e<0)throw new RangeError("targetStart out of bounds");if(r<0||r>=this.length)throw new RangeError("sourceStart out of bounds");if(n<0)throw new RangeError("sourceEnd out of bounds");n>this.length&&(n=this.length),t.length-e<n-r&&(n=t.length-e+r);var i,o=n-r;if(this===t&&r<e&&e<n)for(i=o-1;i>=0;--i)t[i+e]=this[i+r];else if(o<1e3||!u.TYPED_ARRAY_SUPPORT)for(i=0;i<o;++i)t[i+e]=this[i+r];else Uint8Array.prototype.set.call(t,this.subarray(r,r+o),e);return o},u.prototype.fill=function(t,e,r,n){if("string"==typeof t){if("string"==typeof e?(n=e,e=0,r=this.length):"string"==typeof r&&(n=r,r=this.length),1===t.length){var i=t.charCodeAt(0);i<256&&(t=i)}if(void 0!==n&&"string"!=typeof n)throw new TypeError("encoding must be a string");if("string"==typeof n&&!u.isEncoding(n))throw new TypeError("Unknown encoding: "+n)}else"number"==typeof t&&(t&=255);if(e<0||this.length<e||this.length<r)throw new RangeError("Out of range index");if(r<=e)return this;var o;if(e>>>=0,r=void 0===r?this.length:r>>>0,t||(t=0),"number"==typeof t)for(o=e;o<r;++o)this[o]=t;else{var s=u.isBuffer(t)?t:U(new u(t,n).toString()),a=s.length;for(o=0;o<r-e;++o)this[o+e]=s[o%a]}return this};var O=/[^+\/0-9A-Za-z-_]/g;function H(t){return t<16?"0"+t.toString(16):t.toString(16)}function U(t,e){var r;e=e||1/0;for(var n=t.length,i=null,o=[],s=0;s<n;++s){if((r=t.charCodeAt(s))>55295&&r<57344){if(!i){if(r>56319){(e-=3)>-1&&o.push(239,191,189);continue}if(s+1===n){(e-=3)>-1&&o.push(239,191,189);continue}i=r;continue}if(r<56320){(e-=3)>-1&&o.push(239,191,189),i=r;continue}r=65536+(i-55296<<10|r-56320)}else i&&(e-=3)>-1&&o.push(239,191,189);if(i=null,r<128){if((e-=1)<0)break;o.push(r)}else if(r<2048){if((e-=2)<0)break;o.push(r>>6|192,63&r|128)}else if(r<65536){if((e-=3)<0)break;o.push(r>>12|224,r>>6&63|128,63&r|128)}else{if(!(r<1114112))throw new Error("Invalid code point");if((e-=4)<0)break;o.push(r>>18|240,r>>12&63|128,r>>6&63|128,63&r|128)}}return o}function M(t){return n.toByteArray(function(t){if((t=function(t){return t.trim?t.trim():t.replace(/^\s+|\s+$/g,"")}(t).replace(O,"")).length<2)return"";for(;t.length%4!=0;)t+="=";return t}(t))}function V(t,e,r,n){for(var i=0;i<n&&!(i+r>=e.length||i>=t.length);++i)e[i+r]=t[i];return i}}).call(e,r(25))},function(t,e){var r;r=function(){return this}();try{r=r||Function("return this")()||(0,eval)("this")}catch(t){"object"==typeof window&&(r=window)}t.exports=r},function(t,e,r){"use strict";e.byteLength=function(t){var e=c(t),r=e[0],n=e[1];return 3*(r+n)/4-n},e.toByteArray=function(t){for(var e,r=c(t),n=r[0],s=r[1],a=new o(function(t,e,r){return 3*(e+r)/4-r}(0,n,s)),u=0,h=s>0?n-4:n,l=0;l<h;l+=4)e=i[t.charCodeAt(l)]<<18|i[t.charCodeAt(l+1)]<<12|i[t.charCodeAt(l+2)]<<6|i[t.charCodeAt(l+3)],a[u++]=e>>16&255,a[u++]=e>>8&255,a[u++]=255&e;2===s&&(e=i[t.charCodeAt(l)]<<2|i[t.charCodeAt(l+1)]>>4,a[u++]=255&e);1===s&&(e=i[t.charCodeAt(l)]<<10|i[t.charCodeAt(l+1)]<<4|i[t.charCodeAt(l+2)]>>2,a[u++]=e>>8&255,a[u++]=255&e);return a},e.fromByteArray=function(t){for(var e,r=t.length,i=r%3,o=[],s=0,a=r-i;s<a;s+=16383)o.push(h(t,s,s+16383>a?a:s+16383));1===i?(e=t[r-1],o.push(n[e>>2]+n[e<<4&63]+"==")):2===i&&(e=(t[r-2]<<8)+t[r-1],o.push(n[e>>10]+n[e>>4&63]+n[e<<2&63]+"="));return o.join("")};for(var n=[],i=[],o="undefined"!=typeof Uint8Array?Uint8Array:Array,s="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",a=0,u=s.length;a<u;++a)n[a]=s[a],i[s.charCodeAt(a)]=a;function c(t){var e=t.length;if(e%4>0)throw new Error("Invalid string. Length must be a multiple of 4");var r=t.indexOf("=");return-1===r&&(r=e),[r,r===e?0:4-r%4]}function h(t,e,r){for(var i,o,s=[],a=e;a<r;a+=3)i=(t[a]<<16&16711680)+(t[a+1]<<8&65280)+(255&t[a+2]),s.push(n[(o=i)>>18&63]+n[o>>12&63]+n[o>>6&63]+n[63&o]);return s.join("")}i["-".charCodeAt(0)]=62,i["_".charCodeAt(0)]=63},function(t,e){e.read=function(t,e,r,n,i){var o,s,a=8*i-n-1,u=(1<<a)-1,c=u>>1,h=-7,l=r?i-1:0,f=r?-1:1,d=t[e+l];for(l+=f,o=d&(1<<-h)-1,d>>=-h,h+=a;h>0;o=256*o+t[e+l],l+=f,h-=8);for(s=o&(1<<-h)-1,o>>=-h,h+=n;h>0;s=256*s+t[e+l],l+=f,h-=8);if(0===o)o=1-c;else{if(o===u)return s?NaN:1/0*(d?-1:1);s+=Math.pow(2,n),o-=c}return(d?-1:1)*s*Math.pow(2,o-n)},e.write=function(t,e,r,n,i,o){var s,a,u,c=8*o-i-1,h=(1<<c)-1,l=h>>1,f=23===i?Math.pow(2,-24)-Math.pow(2,-77):0,d=n?0:o-1,p=n?1:-1,g=e<0||0===e&&1/e<0?1:0;for(e=Math.abs(e),isNaN(e)||e===1/0?(a=isNaN(e)?1:0,s=h):(s=Math.floor(Math.log(e)/Math.LN2),e*(u=Math.pow(2,-s))<1&&(s--,u*=2),(e+=s+l>=1?f/u:f*Math.pow(2,1-l))*u>=2&&(s++,u/=2),s+l>=h?(a=0,s=h):s+l>=1?(a=(e*u-1)*Math.pow(2,i),s+=l):(a=e*Math.pow(2,l-1)*Math.pow(2,i),s=0));i>=8;t[r+d]=255&a,d+=p,a/=256,i-=8);for(s=s<<i|a,c+=i;c>0;t[r+d]=255&s,d+=p,s/=256,c-=8);t[r+d-p]|=128*g}},function(t,e){var r={}.toString;t.exports=Array.isArray||function(t){return"[object Array]"==r.call(t)}},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.SigninRequest=void 0;var n=r(0),i=r(3),o=r(10);e.SigninRequest=function(){function t(e){var r=e.url,s=e.client_id,a=e.redirect_uri,u=e.response_type,c=e.scope,h=e.authority,l=e.data,f=e.prompt,d=e.display,p=e.max_age,g=e.ui_locales,v=e.id_token_hint,y=e.login_hint,m=e.acr_values,S=e.resource,b=e.request,w=e.request_uri,F=e.extraQueryParams;if(function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),!r)throw n.Log.error("SigninRequest.ctor: No url passed"),new Error("url");if(!s)throw n.Log.error("SigninRequest.ctor: No client_id passed"),new Error("client_id");if(!a)throw n.Log.error("SigninRequest.ctor: No redirect_uri passed"),new Error("redirect_uri");if(!u)throw n.Log.error("SigninRequest.ctor: No response_type passed"),new Error("response_type");if(!c)throw n.Log.error("SigninRequest.ctor: No scope passed"),new Error("scope");if(!h)throw n.Log.error("SigninRequest.ctor: No authority passed"),new Error("authority");var _=t.isOidc(u);this.state=new o.SigninState({nonce:_,data:l,client_id:s,authority:h}),r=i.UrlUtility.addQueryParam(r,"client_id",s),r=i.UrlUtility.addQueryParam(r,"redirect_uri",a),r=i.UrlUtility.addQueryParam(r,"response_type",u),r=i.UrlUtility.addQueryParam(r,"scope",c),r=i.UrlUtility.addQueryParam(r,"state",this.state.id),_&&(r=i.UrlUtility.addQueryParam(r,"nonce",this.state.nonce));var E={prompt:f,display:d,max_age:p,ui_locales:g,id_token_hint:v,login_hint:y,acr_values:m,resource:S,request:b,request_uri:w};for(var x in E)E[x]&&(r=i.UrlUtility.addQueryParam(r,x,E[x]));for(var A in F)r=i.UrlUtility.addQueryParam(r,A,F[A]);this.url=r}return t.isOidc=function(t){return!!t.split(/\s+/g).filter(function(t){return"id_token"===t})[0]},t.isOAuth=function(t){return!!t.split(/\s+/g).filter(function(t){return"token"===t})[0]},t}()},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.SigninResponse=void 0;var n=function(){function t(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}}(),i=r(3);e.SigninResponse=function(){function t(e){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t);var r=i.UrlUtility.parseUrlFragment(e,"#");this.error=r.error,this.error_description=r.error_description,this.error_uri=r.error_uri,this.state=r.state,this.id_token=r.id_token,this.session_state=r.session_state,this.access_token=r.access_token,this.token_type=r.token_type,this.scope=r.scope,this.profile=void 0;var n=parseInt(r.expires_in);if("number"==typeof n&&n>0){var o=parseInt(Date.now()/1e3);this.expires_at=o+n}}return n(t,[{key:"expires_in",get:function(){if(this.expires_at){var t=parseInt(Date.now()/1e3);return this.expires_at-t}}},{key:"expired",get:function(){var t=this.expires_in;if(void 0!==t)return t<=0}},{key:"scopes",get:function(){return(this.scope||"").split(" ")}},{key:"isOpenIdConnect",get:function(){return this.scopes.indexOf("openid")>=0||!!this.id_token}}]),t}()},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.SignoutRequest=void 0;var n=r(0),i=r(3),o=r(6);e.SignoutRequest=function t(e){var r=e.url,s=e.id_token_hint,a=e.post_logout_redirect_uri,u=e.data;if(function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),!r)throw n.Log.error("SignoutRequest.ctor: No url passed"),new Error("url");s&&(r=i.UrlUtility.addQueryParam(r,"id_token_hint",s)),a&&(r=i.UrlUtility.addQueryParam(r,"post_logout_redirect_uri",a),u&&(this.state=new o.State({data:u}),r=i.UrlUtility.addQueryParam(r,"state",this.state.id))),this.url=r}},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.SignoutResponse=void 0;var n=r(3);e.SignoutResponse=function t(e){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t);var r=n.UrlUtility.parseUrlFragment(e,"?");this.error=r.error,this.error_description=r.error_description,this.error_uri=r.error_uri,this.state=r.state}},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.InMemoryWebStorage=void 0;var n=function(){function t(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}}(),i=r(0);e.InMemoryWebStorage=function(){function t(){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this._data={}}return t.prototype.getItem=function(t){return i.Log.debug("InMemoryWebStorage.getItem",t),this._data[t]},t.prototype.setItem=function(t,e){i.Log.debug("InMemoryWebStorage.setItem",t),this._data[t]=e},t.prototype.removeItem=function(t){i.Log.debug("InMemoryWebStorage.removeItem",t),delete this._data[t]},t.prototype.key=function(t){return Object.getOwnPropertyNames(this._data)[t]},n(t,[{key:"length",get:function(){return Object.getOwnPropertyNames(this._data).length}}]),t}()},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.UserManager=void 0;var n=function(){function t(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}}(),i=r(0),o=r(7),s=r(35),a=r(12),u=r(41),c=r(43),h=r(15),l=r(17);e.UserManager=function(t){function e(){var r=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:c.SilentRenewService,o=arguments.length>2&&void 0!==arguments[2]?arguments[2]:h.SessionMonitor,a=arguments.length>3&&void 0!==arguments[3]?arguments[3]:l.TokenRevocationClient;!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,e),r instanceof s.UserManagerSettings||(r=new s.UserManagerSettings(r));var f=function(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}(this,t.call(this,r));return f._events=new u.UserManagerEvents(r),f._silentRenewService=new n(f),f.settings.automaticSilentRenew&&(i.Log.debug("UserManager.ctor: automaticSilentRenew is configured, setting up silent renew"),f.startSilentRenew()),f.settings.monitorSession&&(i.Log.debug("UserManager.ctor: monitorSession is configured, setting up session monitor"),f._sessionMonitor=new o(f)),f._tokenRevocationClient=new a(f._settings),f}return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}(e,t),e.prototype.getUser=function(){var t=this;return this._loadUser().then(function(e){return e?(i.Log.info("UserManager.getUser: user loaded"),t._events.load(e,!1),e):(i.Log.info("UserManager.getUser: user not found in storage"),null)})},e.prototype.removeUser=function(){var t=this;return this.storeUser(null).then(function(){i.Log.info("UserManager.removeUser: user removed from storage"),t._events.unload()})},e.prototype.signinRedirect=function(t){return this._signinStart(t,this._redirectNavigator).then(function(){i.Log.info("UserManager.signinRedirect: successful")})},e.prototype.signinRedirectCallback=function(t){return this._signinEnd(t||this._redirectNavigator.url).then(function(t){return t&&(t.profile&&t.profile.sub?i.Log.info("UserManager.signinRedirectCallback: successful, signed in sub: ",t.profile.sub):i.Log.info("UserManager.signinRedirectCallback: no sub")),t})},e.prototype.signinPopup=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},e=t.redirect_uri||this.settings.popup_redirect_uri||this.settings.redirect_uri;return e?(t.redirect_uri=e,t.display="popup",this._signin(t,this._popupNavigator,{startUrl:e,popupWindowFeatures:t.popupWindowFeatures||this.settings.popupWindowFeatures,popupWindowTarget:t.popupWindowTarget||this.settings.popupWindowTarget}).then(function(t){return t&&(t.profile&&t.profile.sub?i.Log.info("UserManager.signinPopup: signinPopup successful, signed in sub: ",t.profile.sub):i.Log.info("UserManager.signinPopup: no sub")),t})):(i.Log.error("UserManager.signinPopup: No popup_redirect_uri or redirect_uri configured"),Promise.reject(new Error("No popup_redirect_uri or redirect_uri configured")))},e.prototype.signinPopupCallback=function(t){return this._signinCallback(t,this._popupNavigator).then(function(t){return t&&(t.profile&&t.profile.sub?i.Log.info("UserManager.signinPopupCallback: successful, signed in sub: ",t.profile.sub):i.Log.info("UserManager.signinPopupCallback: no sub")),t}).catch(function(t){i.Log.error("UserManager.signinPopupCallback error: "+t&&t.message)})},e.prototype.signinSilent=function(){var t=this,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},r=e.redirect_uri||this.settings.silent_redirect_uri;if(!r)return i.Log.error("UserManager.signinSilent: No silent_redirect_uri configured"),Promise.reject(new Error("No silent_redirect_uri configured"));e.redirect_uri=r,e.prompt="none";return(e.id_token_hint||!this.settings.includeIdTokenInSilentRenew?Promise.resolve():this._loadUser().then(function(t){e.id_token_hint=t&&t.id_token})).then(function(){return t._signin(e,t._iframeNavigator,{startUrl:r,silentRequestTimeout:e.silentRequestTimeout||t.settings.silentRequestTimeout})}).then(function(t){return t&&(t.profile&&t.profile.sub?i.Log.info("UserManager.signinSilent: successful, signed in sub: ",t.profile.sub):i.Log.info("UserManager.signinSilent: no sub")),t})},e.prototype.signinSilentCallback=function(t){return this._signinCallback(t,this._iframeNavigator).then(function(t){return t&&(t.profile&&t.profile.sub?i.Log.info("UserManager.signinSilentCallback: successful, signed in sub: ",t.profile.sub):i.Log.info("UserManager.signinSilentCallback: no sub")),t})},e.prototype.querySessionStatus=function(){var t=this,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},r=e.redirect_uri||this.settings.silent_redirect_uri;return r?(e.redirect_uri=r,e.prompt="none",e.response_type="id_token",e.scope="openid",this._signinStart(e,this._iframeNavigator,{startUrl:r,silentRequestTimeout:e.silentRequestTimeout||this.settings.silentRequestTimeout}).then(function(e){return t.processSigninResponse(e.url).then(function(t){if(i.Log.debug("UserManager.querySessionStatus: got signin response"),t.session_state&&t.profile.sub&&t.profile.sid)return i.Log.info("UserManager.querySessionStatus: querySessionStatus success for sub: ",t.profile.sub),{session_state:t.session_state,sub:t.profile.sub,sid:t.profile.sid};i.Log.info("querySessionStatus successful, user not authenticated")})})):(i.Log.error("UserManager.querySessionStatus: No silent_redirect_uri configured"),Promise.reject(new Error("No silent_redirect_uri configured")))},e.prototype._signin=function(t,e){var r=this,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};return this._signinStart(t,e,n).then(function(t){return r._signinEnd(t.url)})},e.prototype._signinStart=function(t,e){var r=this,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};return e.prepare(n).then(function(e){return i.Log.debug("UserManager._signinStart: got navigator window handle"),r.createSigninRequest(t).then(function(t){return i.Log.debug("UserManager._signinStart: got signin request"),n.url=t.url,n.id=t.state.id,e.navigate(n)}).catch(function(t){throw e.close&&(i.Log.debug("UserManager._signinStart: Error after preparing navigator, closing navigator window"),e.close()),t})})},e.prototype._signinEnd=function(t){var e=this;return this.processSigninResponse(t).then(function(t){i.Log.debug("UserManager._signinEnd: got signin response");var r=new a.User(t);return e.storeUser(r).then(function(){return i.Log.debug("UserManager._signinEnd: user stored"),e._events.load(r),r})})},e.prototype._signinCallback=function(t,e){return i.Log.debug("UserManager._signinCallback"),e.callback(t)},e.prototype.signoutRedirect=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},e=t.post_logout_redirect_uri||this.settings.post_logout_redirect_uri;return e&&(t.post_logout_redirect_uri=e),this._signoutStart(t,this._redirectNavigator).then(function(){i.Log.info("UserManager.signoutRedirect: successful")})},e.prototype.signoutRedirectCallback=function(t){return this._signoutEnd(t||this._redirectNavigator.url).then(function(t){return i.Log.info("UserManager.signoutRedirectCallback: successful"),t})},e.prototype.signoutPopup=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},e=t.post_logout_redirect_uri||this.settings.popup_post_logout_redirect_uri||this.settings.post_logout_redirect_uri;return t.post_logout_redirect_uri=e,t.display="popup",t.post_logout_redirect_uri&&(t.state=t.state||{}),this._signout(t,this._popupNavigator,{startUrl:e,popupWindowFeatures:t.popupWindowFeatures||this.settings.popupWindowFeatures,popupWindowTarget:t.popupWindowTarget||this.settings.popupWindowTarget}).then(function(){i.Log.info("UserManager.signinPopup: successful")})},e.prototype.signoutPopupCallback=function(t,e){void 0===e&&"boolean"==typeof t&&(t=null,e=!0);return this._popupNavigator.callback(t,e,"?").then(function(){i.Log.info("UserManager.signoutPopupCallback: successful")})},e.prototype._signout=function(t,e){var r=this,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};return this._signoutStart(t,e,n).then(function(t){return r._signoutEnd(t.url)})},e.prototype._signoutStart=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},e=this,r=arguments[1],n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};return r.prepare(n).then(function(r){return i.Log.debug("UserManager._signoutStart: got navigator window handle"),e._loadUser().then(function(o){return i.Log.debug("UserManager._signoutStart: loaded current user from storage"),(e._settings.revokeAccessTokenOnSignout?e._revokeInternal(o):Promise.resolve()).then(function(){var s=t.id_token_hint||o&&o.id_token;return s&&(i.Log.debug("UserManager._signoutStart: Setting id_token into signout request"),t.id_token_hint=s),e.removeUser().then(function(){return i.Log.debug("UserManager._signoutStart: user removed, creating signout request"),e.createSignoutRequest(t).then(function(t){return i.Log.debug("UserManager._signoutStart: got signout request"),n.url=t.url,t.state&&(n.id=t.state.id),r.navigate(n)})})})}).catch(function(t){throw r.close&&(i.Log.debug("UserManager._signoutStart: Error after preparing navigator, closing navigator window"),r.close()),t})})},e.prototype._signoutEnd=function(t){return this.processSignoutResponse(t).then(function(t){return i.Log.debug("UserManager._signoutEnd: got signout response"),t})},e.prototype.revokeAccessToken=function(){var t=this;return this._loadUser().then(function(e){return t._revokeInternal(e,!0).then(function(r){if(r)return i.Log.debug("UserManager.revokeAccessToken: removing token properties from user and re-storing"),e.access_token=null,e.expires_at=null,e.token_type=null,t.storeUser(e).then(function(){i.Log.debug("UserManager.revokeAccessToken: user stored"),t._events.load(e)})})}).then(function(){i.Log.info("UserManager.revokeAccessToken: access token revoked successfully")})},e.prototype._revokeInternal=function(t,e){var r=t&&t.access_token;return!r||r.indexOf(".")>=0?(i.Log.debug("UserManager.revokeAccessToken: no need to revoke due to no user, token, or JWT format"),Promise.resolve(!1)):this._tokenRevocationClient.revoke(r,e).then(function(){return!0})},e.prototype.startSilentRenew=function(){this._silentRenewService.start()},e.prototype.stopSilentRenew=function(){this._silentRenewService.stop()},e.prototype._loadUser=function(){return this._userStore.get(this._userStoreKey).then(function(t){return t?(i.Log.debug("UserManager._loadUser: user storageString loaded"),a.User.fromStorageString(t)):(i.Log.debug("UserManager._loadUser: no user storageString"),null)})},e.prototype.storeUser=function(t){if(t){i.Log.debug("UserManager.storeUser: storing user");var e=t.toStorageString();return this._userStore.set(this._userStoreKey,e)}return i.Log.debug("storeUser.storeUser: removing user"),this._userStore.remove(this._userStoreKey)},n(e,[{key:"_redirectNavigator",get:function(){return this.settings.redirectNavigator}},{key:"_popupNavigator",get:function(){return this.settings.popupNavigator}},{key:"_iframeNavigator",get:function(){return this.settings.iframeNavigator}},{key:"_userStore",get:function(){return this.settings.userStore}},{key:"events",get:function(){return this._events}},{key:"_userStoreKey",get:function(){return"user:"+this.settings.authority+":"+this.settings.client_id}}]),e}(o.OidcClient)},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.UserManagerSettings=void 0;var n=function(){function t(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}}(),i=(r(0),r(4)),o=r(36),s=r(37),a=r(39),u=r(5),c=r(1);var h=60,l=2e3;e.UserManagerSettings=function(t){function e(){var r=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},n=r.popup_redirect_uri,i=r.popup_post_logout_redirect_uri,f=r.popupWindowFeatures,d=r.popupWindowTarget,p=r.silent_redirect_uri,g=r.silentRequestTimeout,v=r.automaticSilentRenew,y=void 0!==v&&v,m=r.includeIdTokenInSilentRenew,S=void 0===m||m,b=r.monitorSession,w=void 0===b||b,F=r.checkSessionInterval,_=void 0===F?l:F,E=r.stopCheckSessionOnError,x=void 0===E||E,A=r.revokeAccessTokenOnSignout,P=void 0!==A&&A,C=r.accessTokenExpiringNotificationTime,R=void 0===C?h:C,T=r.redirectNavigator,k=void 0===T?new o.RedirectNavigator:T,D=r.popupNavigator,I=void 0===D?new s.PopupNavigator:D,N=r.iframeNavigator,B=void 0===N?new a.IFrameNavigator:N,j=r.userStore,L=void 0===j?new u.WebStorageStateStore({store:c.Global.sessionStorage}):j;!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,e);var O=function(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}(this,t.call(this,arguments[0]));return O._popup_redirect_uri=n,O._popup_post_logout_redirect_uri=i,O._popupWindowFeatures=f,O._popupWindowTarget=d,O._silent_redirect_uri=p,O._silentRequestTimeout=g,O._automaticSilentRenew=!!y,O._includeIdTokenInSilentRenew=S,O._accessTokenExpiringNotificationTime=R,O._monitorSession=w,O._checkSessionInterval=_,O._stopCheckSessionOnError=x,O._revokeAccessTokenOnSignout=P,O._redirectNavigator=k,O._popupNavigator=I,O._iframeNavigator=B,O._userStore=L,O}return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}(e,t),n(e,[{key:"popup_redirect_uri",get:function(){return this._popup_redirect_uri}},{key:"popup_post_logout_redirect_uri",get:function(){return this._popup_post_logout_redirect_uri}},{key:"popupWindowFeatures",get:function(){return this._popupWindowFeatures}},{key:"popupWindowTarget",get:function(){return this._popupWindowTarget}},{key:"silent_redirect_uri",get:function(){return this._silent_redirect_uri}},{key:"silentRequestTimeout",get:function(){return this._silentRequestTimeout}},{key:"automaticSilentRenew",get:function(){return!(!this.silent_redirect_uri||!this._automaticSilentRenew)}},{key:"includeIdTokenInSilentRenew",get:function(){return this._includeIdTokenInSilentRenew}},{key:"accessTokenExpiringNotificationTime",get:function(){return this._accessTokenExpiringNotificationTime}},{key:"monitorSession",get:function(){return this._monitorSession}},{key:"checkSessionInterval",get:function(){return this._checkSessionInterval}},{key:"stopCheckSessionOnError",get:function(){return this._stopCheckSessionOnError}},{key:"revokeAccessTokenOnSignout",get:function(){return this._revokeAccessTokenOnSignout}},{key:"redirectNavigator",get:function(){return this._redirectNavigator}},{key:"popupNavigator",get:function(){return this._popupNavigator}},{key:"iframeNavigator",get:function(){return this._iframeNavigator}},{key:"userStore",get:function(){return this._userStore}}]),e}(i.OidcClientSettings)},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.RedirectNavigator=void 0;var n=function(){function t(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}}(),i=r(0);e.RedirectNavigator=function(){function t(){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t)}return t.prototype.prepare=function(){return Promise.resolve(this)},t.prototype.navigate=function(t){return t&&t.url?(window.location=t.url,Promise.resolve()):(i.Log.error("RedirectNavigator.navigate: No url provided"),Promise.reject(new Error("No url provided")))},n(t,[{key:"url",get:function(){return window.location.href}}]),t}()},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.PopupNavigator=void 0;var n=r(0),i=r(38);e.PopupNavigator=function(){function t(){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t)}return t.prototype.prepare=function(t){var e=new i.PopupWindow(t);return Promise.resolve(e)},t.prototype.callback=function(t,e,r){n.Log.debug("PopupNavigator.callback");try{return i.PopupWindow.notifyOpener(t,e,r),Promise.resolve()}catch(t){return Promise.reject(t)}},t}()},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.PopupWindow=void 0;var n=function(){function t(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}}(),i=r(0),o=r(3);var s=500,a="location=no,toolbar=no,width=500,height=500,left=100,top=100;",u="_blank";e.PopupWindow=function(){function t(e){var r=this;!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this._promise=new Promise(function(t,e){r._resolve=t,r._reject=e});var n=e.popupWindowTarget||u,o=e.popupWindowFeatures||a;this._popup=window.open("",n,o),this._popup&&(i.Log.debug("PopupWindow.ctor: popup successfully created"),this._checkForPopupClosedTimer=window.setInterval(this._checkForPopupClosed.bind(this),s))}return t.prototype.navigate=function(t){return this._popup?t&&t.url?(i.Log.debug("PopupWindow.navigate: Setting URL in popup"),this._id=t.id,this._id&&(window["popupCallback_"+t.id]=this._callback.bind(this)),this._popup.focus(),this._popup.window.location=t.url):(this._error("PopupWindow.navigate: no url provided"),this._error("No url provided")):this._error("PopupWindow.navigate: Error opening popup window"),this.promise},t.prototype._success=function(t){i.Log.debug("PopupWindow.callback: Successful response from popup window"),this._cleanup(),this._resolve(t)},t.prototype._error=function(t){i.Log.error("PopupWindow.error: ",t),this._cleanup(),this._reject(new Error(t))},t.prototype.close=function(){this._cleanup(!1)},t.prototype._cleanup=function(t){i.Log.debug("PopupWindow.cleanup"),window.clearInterval(this._checkForPopupClosedTimer),this._checkForPopupClosedTimer=null,delete window["popupCallback_"+this._id],this._popup&&!t&&this._popup.close(),this._popup=null},t.prototype._checkForPopupClosed=function(){this._popup&&!this._popup.closed||this._error("Popup window closed")},t.prototype._callback=function(t,e){this._cleanup(e),t?(i.Log.debug("PopupWindow.callback success"),this._success({url:t})):(i.Log.debug("PopupWindow.callback: Invalid response from popup"),this._error("Invalid response from popup"))},t.notifyOpener=function(t,e,r){if(window.opener){if(t=t||window.location.href){var n=o.UrlUtility.parseUrlFragment(t,r);if(n.state){var s="popupCallback_"+n.state,a=window.opener[s];a?(i.Log.debug("PopupWindow.notifyOpener: passing url message to opener"),a(t,e)):i.Log.warn("PopupWindow.notifyOpener: no matching callback found on opener")}else i.Log.warn("PopupWindow.notifyOpener: no state found in response url")}}else i.Log.warn("PopupWindow.notifyOpener: no window.opener. Can't complete notification.")},n(t,[{key:"promise",get:function(){return this._promise}}]),t}()},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.IFrameNavigator=void 0;var n=r(0),i=r(40);e.IFrameNavigator=function(){function t(){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t)}return t.prototype.prepare=function(t){var e=new i.IFrameWindow(t);return Promise.resolve(e)},t.prototype.callback=function(t){n.Log.debug("IFrameNavigator.callback");try{return i.IFrameWindow.notifyParent(t),Promise.resolve()}catch(t){return Promise.reject(t)}},t}()},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.IFrameWindow=void 0;var n=function(){function t(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}}(),i=r(0);e.IFrameWindow=function(){function t(e){var r=this;!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this._promise=new Promise(function(t,e){r._resolve=t,r._reject=e}),this._boundMessageEvent=this._message.bind(this),window.addEventListener("message",this._boundMessageEvent,!1),this._frame=window.document.createElement("iframe"),this._frame.style.visibility="hidden",this._frame.style.position="absolute",this._frame.style.display="none",this._frame.style.width=0,this._frame.style.height=0,window.document.body.appendChild(this._frame)}return t.prototype.navigate=function(t){if(t&&t.url){var e=t.silentRequestTimeout||1e4;i.Log.debug("IFrameWindow.navigate: Using timeout of:",e),this._timer=window.setTimeout(this._timeout.bind(this),e),this._frame.src=t.url}else this._error("No url provided");return this.promise},t.prototype._success=function(t){this._cleanup(),i.Log.debug("IFrameWindow: Successful response from frame window"),this._resolve(t)},t.prototype._error=function(t){this._cleanup(),i.Log.error(t),this._reject(new Error(t))},t.prototype.close=function(){this._cleanup()},t.prototype._cleanup=function(){this._frame&&(i.Log.debug("IFrameWindow: cleanup"),window.removeEventListener("message",this._boundMessageEvent,!1),window.clearTimeout(this._timer),window.document.body.removeChild(this._frame),this._timer=null,this._frame=null,this._boundMessageEvent=null)},t.prototype._timeout=function(){i.Log.debug("IFrameWindow.timeout"),this._error("Frame window timed out")},t.prototype._message=function(t){if(i.Log.debug("IFrameWindow.message"),this._timer&&t.origin===this._origin&&t.source===this._frame.contentWindow){var e=t.data;e?this._success({url:e}):this._error("Invalid response from frame")}},t.notifyParent=function(t){i.Log.debug("IFrameWindow.notifyParent"),window.parent&&window!==window.parent&&(t=t||window.location.href)&&(i.Log.debug("IFrameWindow.notifyParent: posting url message to parent"),window.parent.postMessage(t,location.protocol+"//"+location.host))},n(t,[{key:"promise",get:function(){return this._promise}},{key:"_origin",get:function(){return location.protocol+"//"+location.host}}]),t}()},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.UserManagerEvents=void 0;var n=r(0),i=r(13),o=r(14);e.UserManagerEvents=function(t){function e(r){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,e);var n=function(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}(this,t.call(this,r));return n._userLoaded=new o.Event("User loaded"),n._userUnloaded=new o.Event("User unloaded"),n._silentRenewError=new o.Event("Silent renew error"),n._userSignedOut=new o.Event("User signed out"),n._userSessionChanged=new o.Event("User session changed"),n}return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}(e,t),e.prototype.load=function(e){var r=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];n.Log.debug("UserManagerEvents.load"),t.prototype.load.call(this,e),r&&this._userLoaded.raise(e)},e.prototype.unload=function(){n.Log.debug("UserManagerEvents.unload"),t.prototype.unload.call(this),this._userUnloaded.raise()},e.prototype.addUserLoaded=function(t){this._userLoaded.addHandler(t)},e.prototype.removeUserLoaded=function(t){this._userLoaded.removeHandler(t)},e.prototype.addUserUnloaded=function(t){this._userUnloaded.addHandler(t)},e.prototype.removeUserUnloaded=function(t){this._userUnloaded.removeHandler(t)},e.prototype.addSilentRenewError=function(t){this._silentRenewError.addHandler(t)},e.prototype.removeSilentRenewError=function(t){this._silentRenewError.removeHandler(t)},e.prototype._raiseSilentRenewError=function(t){n.Log.debug("UserManagerEvents._raiseSilentRenewError",t.message),this._silentRenewError.raise(t)},e.prototype.addUserSignedOut=function(t){this._userSignedOut.addHandler(t)},e.prototype.removeUserSignedOut=function(t){this._userSignedOut.removeHandler(t)},e.prototype._raiseUserSignedOut=function(t){n.Log.debug("UserManagerEvents._raiseUserSignedOut"),this._userSignedOut.raise(t)},e.prototype.addUserSessionChanged=function(t){this._userSessionChanged.addHandler(t)},e.prototype.removeUserSessionChanged=function(t){this._userSessionChanged.removeHandler(t)},e.prototype._raiseUserSessionChanged=function(t){n.Log.debug("UserManagerEvents._raiseUserSessionChanged"),this._userSessionChanged.raise(t)},e}(i.AccessTokenEvents)},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.Timer=void 0;var n=function(){function t(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}}(),i=r(0),o=r(1),s=r(14);e.Timer=function(t){function e(r){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:o.Global.timer,i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:void 0;!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,e);var s=function(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}(this,t.call(this,r));return s._timer=n,s._nowFunc=i||function(){return Date.now()/1e3},s}return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}(e,t),e.prototype.init=function(t){t<=0&&(t=1),t=parseInt(t);var e=this.now+t;if(this.expiration===e&&this._timerHandle)i.Log.debug("Timer.init timer "+this._name+" skipping initialization since already initialized for expiration:",this.expiration);else{this.cancel(),i.Log.debug("Timer.init timer "+this._name+" for duration:",t),this._expiration=e;var r=5;t<r&&(r=t),this._timerHandle=this._timer.setInterval(this._callback.bind(this),1e3*r)}},e.prototype.cancel=function(){this._timerHandle&&(i.Log.debug("Timer.cancel: ",this._name),this._timer.clearInterval(this._timerHandle),this._timerHandle=null)},e.prototype._callback=function(){var e=this._expiration-this.now;i.Log.debug("Timer.callback; "+this._name+" timer expires in:",e),this._expiration<=this.now&&(this.cancel(),t.prototype.raise.call(this))},n(e,[{key:"now",get:function(){return parseInt(this._nowFunc())}},{key:"expiration",get:function(){return this._expiration}}]),e}(s.Event)},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.SilentRenewService=void 0;var n=r(0);e.SilentRenewService=function(){function t(e){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this._userManager=e}return t.prototype.start=function(){this._callback||(this._callback=this._tokenExpiring.bind(this),this._userManager.events.addAccessTokenExpiring(this._callback),this._userManager.getUser().then(function(t){}).catch(function(t){n.Log.error("SilentRenewService.start: Error from getUser:",t.message)}))},t.prototype.stop=function(){this._callback&&(this._userManager.events.removeAccessTokenExpiring(this._callback),delete this._callback)},t.prototype._tokenExpiring=function(){var t=this;this._userManager.signinSilent().then(function(t){n.Log.debug("SilentRenewService._tokenExpiring: Silent token renewal successful")},function(e){n.Log.error("SilentRenewService._tokenExpiring: Error from signinSilent:",e.message),t._userManager.events._raiseSilentRenewError(e)})},t}()},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.CordovaPopupNavigator=void 0;var n=r(18);e.CordovaPopupNavigator=function(){function t(){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t)}return t.prototype.prepare=function(t){var e=new n.CordovaPopupWindow(t);return Promise.resolve(e)},t}()},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.CordovaIFrameNavigator=void 0;var n=r(18);e.CordovaIFrameNavigator=function(){function t(){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t)}return t.prototype.prepare=function(t){t.popupWindowFeatures="hidden=yes";var e=new n.CordovaPopupWindow(t);return Promise.resolve(e)},t}()}])});

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.decode = exports.parse = __webpack_require__(36);
exports.encode = exports.stringify = __webpack_require__(37);


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process, global) {/*! *****************************************************************************
Copyright (C) Microsoft. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
var Reflect;
(function (Reflect) {
    "use strict";
    var hasOwn = Object.prototype.hasOwnProperty;
    // feature test for Symbol support
    var supportsSymbol = typeof Symbol === "function";
    var toPrimitiveSymbol = supportsSymbol && typeof Symbol.toPrimitive !== "undefined" ? Symbol.toPrimitive : "@@toPrimitive";
    var iteratorSymbol = supportsSymbol && typeof Symbol.iterator !== "undefined" ? Symbol.iterator : "@@iterator";
    var HashMap;
    (function (HashMap) {
        var supportsCreate = typeof Object.create === "function"; // feature test for Object.create support
        var supportsProto = { __proto__: [] } instanceof Array; // feature test for __proto__ support
        var downLevel = !supportsCreate && !supportsProto;
        // create an object in dictionary mode (a.k.a. "slow" mode in v8)
        HashMap.create = supportsCreate
            ? function () { return MakeDictionary(Object.create(null)); }
            : supportsProto
                ? function () { return MakeDictionary({ __proto__: null }); }
                : function () { return MakeDictionary({}); };
        HashMap.has = downLevel
            ? function (map, key) { return hasOwn.call(map, key); }
            : function (map, key) { return key in map; };
        HashMap.get = downLevel
            ? function (map, key) { return hasOwn.call(map, key) ? map[key] : undefined; }
            : function (map, key) { return map[key]; };
    })(HashMap || (HashMap = {}));
    // Load global or shim versions of Map, Set, and WeakMap
    var functionPrototype = Object.getPrototypeOf(Function);
    var usePolyfill = typeof process === "object" && process.env && process.env["REFLECT_METADATA_USE_MAP_POLYFILL"] === "true";
    var _Map = !usePolyfill && typeof Map === "function" && typeof Map.prototype.entries === "function" ? Map : CreateMapPolyfill();
    var _Set = !usePolyfill && typeof Set === "function" && typeof Set.prototype.entries === "function" ? Set : CreateSetPolyfill();
    var _WeakMap = !usePolyfill && typeof WeakMap === "function" ? WeakMap : CreateWeakMapPolyfill();
    // [[Metadata]] internal slot
    // https://rbuckton.github.io/reflect-metadata/#ordinary-object-internal-methods-and-internal-slots
    var Metadata = new _WeakMap();
    /**
      * Applies a set of decorators to a property of a target object.
      * @param decorators An array of decorators.
      * @param target The target object.
      * @param propertyKey (Optional) The property key to decorate.
      * @param attributes (Optional) The property descriptor for the target key.
      * @remarks Decorators are applied in reverse order.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     Example = Reflect.decorate(decoratorsArray, Example);
      *
      *     // property (on constructor)
      *     Reflect.decorate(decoratorsArray, Example, "staticProperty");
      *
      *     // property (on prototype)
      *     Reflect.decorate(decoratorsArray, Example.prototype, "property");
      *
      *     // method (on constructor)
      *     Object.defineProperty(Example, "staticMethod",
      *         Reflect.decorate(decoratorsArray, Example, "staticMethod",
      *             Object.getOwnPropertyDescriptor(Example, "staticMethod")));
      *
      *     // method (on prototype)
      *     Object.defineProperty(Example.prototype, "method",
      *         Reflect.decorate(decoratorsArray, Example.prototype, "method",
      *             Object.getOwnPropertyDescriptor(Example.prototype, "method")));
      *
      */
    function decorate(decorators, target, propertyKey, attributes) {
        if (!IsUndefined(propertyKey)) {
            if (!IsArray(decorators))
                throw new TypeError();
            if (!IsObject(target))
                throw new TypeError();
            if (!IsObject(attributes) && !IsUndefined(attributes) && !IsNull(attributes))
                throw new TypeError();
            if (IsNull(attributes))
                attributes = undefined;
            propertyKey = ToPropertyKey(propertyKey);
            return DecorateProperty(decorators, target, propertyKey, attributes);
        }
        else {
            if (!IsArray(decorators))
                throw new TypeError();
            if (!IsConstructor(target))
                throw new TypeError();
            return DecorateConstructor(decorators, target);
        }
    }
    Reflect.decorate = decorate;
    // 4.1.2 Reflect.metadata(metadataKey, metadataValue)
    // https://rbuckton.github.io/reflect-metadata/#reflect.metadata
    /**
      * A default metadata decorator factory that can be used on a class, class member, or parameter.
      * @param metadataKey The key for the metadata entry.
      * @param metadataValue The value for the metadata entry.
      * @returns A decorator function.
      * @remarks
      * If `metadataKey` is already defined for the target and target key, the
      * metadataValue for that key will be overwritten.
      * @example
      *
      *     // constructor
      *     @Reflect.metadata(key, value)
      *     class Example {
      *     }
      *
      *     // property (on constructor, TypeScript only)
      *     class Example {
      *         @Reflect.metadata(key, value)
      *         static staticProperty;
      *     }
      *
      *     // property (on prototype, TypeScript only)
      *     class Example {
      *         @Reflect.metadata(key, value)
      *         property;
      *     }
      *
      *     // method (on constructor)
      *     class Example {
      *         @Reflect.metadata(key, value)
      *         static staticMethod() { }
      *     }
      *
      *     // method (on prototype)
      *     class Example {
      *         @Reflect.metadata(key, value)
      *         method() { }
      *     }
      *
      */
    function metadata(metadataKey, metadataValue) {
        function decorator(target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey) && !IsPropertyKey(propertyKey))
                throw new TypeError();
            OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
        }
        return decorator;
    }
    Reflect.metadata = metadata;
    /**
      * Define a unique metadata entry on the target.
      * @param metadataKey A key used to store and retrieve metadata.
      * @param metadataValue A value that contains attached metadata.
      * @param target The target object on which to define metadata.
      * @param propertyKey (Optional) The property key for the target.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     Reflect.defineMetadata("custom:annotation", options, Example);
      *
      *     // property (on constructor)
      *     Reflect.defineMetadata("custom:annotation", options, Example, "staticProperty");
      *
      *     // property (on prototype)
      *     Reflect.defineMetadata("custom:annotation", options, Example.prototype, "property");
      *
      *     // method (on constructor)
      *     Reflect.defineMetadata("custom:annotation", options, Example, "staticMethod");
      *
      *     // method (on prototype)
      *     Reflect.defineMetadata("custom:annotation", options, Example.prototype, "method");
      *
      *     // decorator factory as metadata-producing annotation.
      *     function MyAnnotation(options): Decorator {
      *         return (target, key?) => Reflect.defineMetadata("custom:annotation", options, target, key);
      *     }
      *
      */
    function defineMetadata(metadataKey, metadataValue, target, propertyKey) {
        if (!IsObject(target))
            throw new TypeError();
        if (!IsUndefined(propertyKey))
            propertyKey = ToPropertyKey(propertyKey);
        return OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
    }
    Reflect.defineMetadata = defineMetadata;
    /**
      * Gets a value indicating whether the target object or its prototype chain has the provided metadata key defined.
      * @param metadataKey A key used to store and retrieve metadata.
      * @param target The target object on which the metadata is defined.
      * @param propertyKey (Optional) The property key for the target.
      * @returns `true` if the metadata key was defined on the target object or its prototype chain; otherwise, `false`.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     result = Reflect.hasMetadata("custom:annotation", Example);
      *
      *     // property (on constructor)
      *     result = Reflect.hasMetadata("custom:annotation", Example, "staticProperty");
      *
      *     // property (on prototype)
      *     result = Reflect.hasMetadata("custom:annotation", Example.prototype, "property");
      *
      *     // method (on constructor)
      *     result = Reflect.hasMetadata("custom:annotation", Example, "staticMethod");
      *
      *     // method (on prototype)
      *     result = Reflect.hasMetadata("custom:annotation", Example.prototype, "method");
      *
      */
    function hasMetadata(metadataKey, target, propertyKey) {
        if (!IsObject(target))
            throw new TypeError();
        if (!IsUndefined(propertyKey))
            propertyKey = ToPropertyKey(propertyKey);
        return OrdinaryHasMetadata(metadataKey, target, propertyKey);
    }
    Reflect.hasMetadata = hasMetadata;
    /**
      * Gets a value indicating whether the target object has the provided metadata key defined.
      * @param metadataKey A key used to store and retrieve metadata.
      * @param target The target object on which the metadata is defined.
      * @param propertyKey (Optional) The property key for the target.
      * @returns `true` if the metadata key was defined on the target object; otherwise, `false`.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     result = Reflect.hasOwnMetadata("custom:annotation", Example);
      *
      *     // property (on constructor)
      *     result = Reflect.hasOwnMetadata("custom:annotation", Example, "staticProperty");
      *
      *     // property (on prototype)
      *     result = Reflect.hasOwnMetadata("custom:annotation", Example.prototype, "property");
      *
      *     // method (on constructor)
      *     result = Reflect.hasOwnMetadata("custom:annotation", Example, "staticMethod");
      *
      *     // method (on prototype)
      *     result = Reflect.hasOwnMetadata("custom:annotation", Example.prototype, "method");
      *
      */
    function hasOwnMetadata(metadataKey, target, propertyKey) {
        if (!IsObject(target))
            throw new TypeError();
        if (!IsUndefined(propertyKey))
            propertyKey = ToPropertyKey(propertyKey);
        return OrdinaryHasOwnMetadata(metadataKey, target, propertyKey);
    }
    Reflect.hasOwnMetadata = hasOwnMetadata;
    /**
      * Gets the metadata value for the provided metadata key on the target object or its prototype chain.
      * @param metadataKey A key used to store and retrieve metadata.
      * @param target The target object on which the metadata is defined.
      * @param propertyKey (Optional) The property key for the target.
      * @returns The metadata value for the metadata key if found; otherwise, `undefined`.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     result = Reflect.getMetadata("custom:annotation", Example);
      *
      *     // property (on constructor)
      *     result = Reflect.getMetadata("custom:annotation", Example, "staticProperty");
      *
      *     // property (on prototype)
      *     result = Reflect.getMetadata("custom:annotation", Example.prototype, "property");
      *
      *     // method (on constructor)
      *     result = Reflect.getMetadata("custom:annotation", Example, "staticMethod");
      *
      *     // method (on prototype)
      *     result = Reflect.getMetadata("custom:annotation", Example.prototype, "method");
      *
      */
    function getMetadata(metadataKey, target, propertyKey) {
        if (!IsObject(target))
            throw new TypeError();
        if (!IsUndefined(propertyKey))
            propertyKey = ToPropertyKey(propertyKey);
        return OrdinaryGetMetadata(metadataKey, target, propertyKey);
    }
    Reflect.getMetadata = getMetadata;
    /**
      * Gets the metadata value for the provided metadata key on the target object.
      * @param metadataKey A key used to store and retrieve metadata.
      * @param target The target object on which the metadata is defined.
      * @param propertyKey (Optional) The property key for the target.
      * @returns The metadata value for the metadata key if found; otherwise, `undefined`.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     result = Reflect.getOwnMetadata("custom:annotation", Example);
      *
      *     // property (on constructor)
      *     result = Reflect.getOwnMetadata("custom:annotation", Example, "staticProperty");
      *
      *     // property (on prototype)
      *     result = Reflect.getOwnMetadata("custom:annotation", Example.prototype, "property");
      *
      *     // method (on constructor)
      *     result = Reflect.getOwnMetadata("custom:annotation", Example, "staticMethod");
      *
      *     // method (on prototype)
      *     result = Reflect.getOwnMetadata("custom:annotation", Example.prototype, "method");
      *
      */
    function getOwnMetadata(metadataKey, target, propertyKey) {
        if (!IsObject(target))
            throw new TypeError();
        if (!IsUndefined(propertyKey))
            propertyKey = ToPropertyKey(propertyKey);
        return OrdinaryGetOwnMetadata(metadataKey, target, propertyKey);
    }
    Reflect.getOwnMetadata = getOwnMetadata;
    /**
      * Gets the metadata keys defined on the target object or its prototype chain.
      * @param target The target object on which the metadata is defined.
      * @param propertyKey (Optional) The property key for the target.
      * @returns An array of unique metadata keys.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     result = Reflect.getMetadataKeys(Example);
      *
      *     // property (on constructor)
      *     result = Reflect.getMetadataKeys(Example, "staticProperty");
      *
      *     // property (on prototype)
      *     result = Reflect.getMetadataKeys(Example.prototype, "property");
      *
      *     // method (on constructor)
      *     result = Reflect.getMetadataKeys(Example, "staticMethod");
      *
      *     // method (on prototype)
      *     result = Reflect.getMetadataKeys(Example.prototype, "method");
      *
      */
    function getMetadataKeys(target, propertyKey) {
        if (!IsObject(target))
            throw new TypeError();
        if (!IsUndefined(propertyKey))
            propertyKey = ToPropertyKey(propertyKey);
        return OrdinaryMetadataKeys(target, propertyKey);
    }
    Reflect.getMetadataKeys = getMetadataKeys;
    /**
      * Gets the unique metadata keys defined on the target object.
      * @param target The target object on which the metadata is defined.
      * @param propertyKey (Optional) The property key for the target.
      * @returns An array of unique metadata keys.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     result = Reflect.getOwnMetadataKeys(Example);
      *
      *     // property (on constructor)
      *     result = Reflect.getOwnMetadataKeys(Example, "staticProperty");
      *
      *     // property (on prototype)
      *     result = Reflect.getOwnMetadataKeys(Example.prototype, "property");
      *
      *     // method (on constructor)
      *     result = Reflect.getOwnMetadataKeys(Example, "staticMethod");
      *
      *     // method (on prototype)
      *     result = Reflect.getOwnMetadataKeys(Example.prototype, "method");
      *
      */
    function getOwnMetadataKeys(target, propertyKey) {
        if (!IsObject(target))
            throw new TypeError();
        if (!IsUndefined(propertyKey))
            propertyKey = ToPropertyKey(propertyKey);
        return OrdinaryOwnMetadataKeys(target, propertyKey);
    }
    Reflect.getOwnMetadataKeys = getOwnMetadataKeys;
    /**
      * Deletes the metadata entry from the target object with the provided key.
      * @param metadataKey A key used to store and retrieve metadata.
      * @param target The target object on which the metadata is defined.
      * @param propertyKey (Optional) The property key for the target.
      * @returns `true` if the metadata entry was found and deleted; otherwise, false.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     result = Reflect.deleteMetadata("custom:annotation", Example);
      *
      *     // property (on constructor)
      *     result = Reflect.deleteMetadata("custom:annotation", Example, "staticProperty");
      *
      *     // property (on prototype)
      *     result = Reflect.deleteMetadata("custom:annotation", Example.prototype, "property");
      *
      *     // method (on constructor)
      *     result = Reflect.deleteMetadata("custom:annotation", Example, "staticMethod");
      *
      *     // method (on prototype)
      *     result = Reflect.deleteMetadata("custom:annotation", Example.prototype, "method");
      *
      */
    function deleteMetadata(metadataKey, target, propertyKey) {
        if (!IsObject(target))
            throw new TypeError();
        if (!IsUndefined(propertyKey))
            propertyKey = ToPropertyKey(propertyKey);
        var metadataMap = GetOrCreateMetadataMap(target, propertyKey, /*Create*/ false);
        if (IsUndefined(metadataMap))
            return false;
        if (!metadataMap.delete(metadataKey))
            return false;
        if (metadataMap.size > 0)
            return true;
        var targetMetadata = Metadata.get(target);
        targetMetadata.delete(propertyKey);
        if (targetMetadata.size > 0)
            return true;
        Metadata.delete(target);
        return true;
    }
    Reflect.deleteMetadata = deleteMetadata;
    function DecorateConstructor(decorators, target) {
        for (var i = decorators.length - 1; i >= 0; --i) {
            var decorator = decorators[i];
            var decorated = decorator(target);
            if (!IsUndefined(decorated) && !IsNull(decorated)) {
                if (!IsConstructor(decorated))
                    throw new TypeError();
                target = decorated;
            }
        }
        return target;
    }
    function DecorateProperty(decorators, target, propertyKey, descriptor) {
        for (var i = decorators.length - 1; i >= 0; --i) {
            var decorator = decorators[i];
            var decorated = decorator(target, propertyKey, descriptor);
            if (!IsUndefined(decorated) && !IsNull(decorated)) {
                if (!IsObject(decorated))
                    throw new TypeError();
                descriptor = decorated;
            }
        }
        return descriptor;
    }
    function GetOrCreateMetadataMap(O, P, Create) {
        var targetMetadata = Metadata.get(O);
        if (IsUndefined(targetMetadata)) {
            if (!Create)
                return undefined;
            targetMetadata = new _Map();
            Metadata.set(O, targetMetadata);
        }
        var metadataMap = targetMetadata.get(P);
        if (IsUndefined(metadataMap)) {
            if (!Create)
                return undefined;
            metadataMap = new _Map();
            targetMetadata.set(P, metadataMap);
        }
        return metadataMap;
    }
    // 3.1.1.1 OrdinaryHasMetadata(MetadataKey, O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinaryhasmetadata
    function OrdinaryHasMetadata(MetadataKey, O, P) {
        var hasOwn = OrdinaryHasOwnMetadata(MetadataKey, O, P);
        if (hasOwn)
            return true;
        var parent = OrdinaryGetPrototypeOf(O);
        if (!IsNull(parent))
            return OrdinaryHasMetadata(MetadataKey, parent, P);
        return false;
    }
    // 3.1.2.1 OrdinaryHasOwnMetadata(MetadataKey, O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinaryhasownmetadata
    function OrdinaryHasOwnMetadata(MetadataKey, O, P) {
        var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
        if (IsUndefined(metadataMap))
            return false;
        return ToBoolean(metadataMap.has(MetadataKey));
    }
    // 3.1.3.1 OrdinaryGetMetadata(MetadataKey, O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinarygetmetadata
    function OrdinaryGetMetadata(MetadataKey, O, P) {
        var hasOwn = OrdinaryHasOwnMetadata(MetadataKey, O, P);
        if (hasOwn)
            return OrdinaryGetOwnMetadata(MetadataKey, O, P);
        var parent = OrdinaryGetPrototypeOf(O);
        if (!IsNull(parent))
            return OrdinaryGetMetadata(MetadataKey, parent, P);
        return undefined;
    }
    // 3.1.4.1 OrdinaryGetOwnMetadata(MetadataKey, O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinarygetownmetadata
    function OrdinaryGetOwnMetadata(MetadataKey, O, P) {
        var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
        if (IsUndefined(metadataMap))
            return undefined;
        return metadataMap.get(MetadataKey);
    }
    // 3.1.5.1 OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinarydefineownmetadata
    function OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P) {
        var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ true);
        metadataMap.set(MetadataKey, MetadataValue);
    }
    // 3.1.6.1 OrdinaryMetadataKeys(O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinarymetadatakeys
    function OrdinaryMetadataKeys(O, P) {
        var ownKeys = OrdinaryOwnMetadataKeys(O, P);
        var parent = OrdinaryGetPrototypeOf(O);
        if (parent === null)
            return ownKeys;
        var parentKeys = OrdinaryMetadataKeys(parent, P);
        if (parentKeys.length <= 0)
            return ownKeys;
        if (ownKeys.length <= 0)
            return parentKeys;
        var set = new _Set();
        var keys = [];
        for (var _i = 0, ownKeys_1 = ownKeys; _i < ownKeys_1.length; _i++) {
            var key = ownKeys_1[_i];
            var hasKey = set.has(key);
            if (!hasKey) {
                set.add(key);
                keys.push(key);
            }
        }
        for (var _a = 0, parentKeys_1 = parentKeys; _a < parentKeys_1.length; _a++) {
            var key = parentKeys_1[_a];
            var hasKey = set.has(key);
            if (!hasKey) {
                set.add(key);
                keys.push(key);
            }
        }
        return keys;
    }
    // 3.1.7.1 OrdinaryOwnMetadataKeys(O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinaryownmetadatakeys
    function OrdinaryOwnMetadataKeys(O, P) {
        var keys = [];
        var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
        if (IsUndefined(metadataMap))
            return keys;
        var keysObj = metadataMap.keys();
        var iterator = GetIterator(keysObj);
        var k = 0;
        while (true) {
            var next = IteratorStep(iterator);
            if (!next) {
                keys.length = k;
                return keys;
            }
            var nextValue = IteratorValue(next);
            try {
                keys[k] = nextValue;
            }
            catch (e) {
                try {
                    IteratorClose(iterator);
                }
                finally {
                    throw e;
                }
            }
            k++;
        }
    }
    // 6 ECMAScript Data Typ0es and Values
    // https://tc39.github.io/ecma262/#sec-ecmascript-data-types-and-values
    function Type(x) {
        if (x === null)
            return 1 /* Null */;
        switch (typeof x) {
            case "undefined": return 0 /* Undefined */;
            case "boolean": return 2 /* Boolean */;
            case "string": return 3 /* String */;
            case "symbol": return 4 /* Symbol */;
            case "number": return 5 /* Number */;
            case "object": return x === null ? 1 /* Null */ : 6 /* Object */;
            default: return 6 /* Object */;
        }
    }
    // 6.1.1 The Undefined Type
    // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-undefined-type
    function IsUndefined(x) {
        return x === undefined;
    }
    // 6.1.2 The Null Type
    // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-null-type
    function IsNull(x) {
        return x === null;
    }
    // 6.1.5 The Symbol Type
    // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-symbol-type
    function IsSymbol(x) {
        return typeof x === "symbol";
    }
    // 6.1.7 The Object Type
    // https://tc39.github.io/ecma262/#sec-object-type
    function IsObject(x) {
        return typeof x === "object" ? x !== null : typeof x === "function";
    }
    // 7.1 Type Conversion
    // https://tc39.github.io/ecma262/#sec-type-conversion
    // 7.1.1 ToPrimitive(input [, PreferredType])
    // https://tc39.github.io/ecma262/#sec-toprimitive
    function ToPrimitive(input, PreferredType) {
        switch (Type(input)) {
            case 0 /* Undefined */: return input;
            case 1 /* Null */: return input;
            case 2 /* Boolean */: return input;
            case 3 /* String */: return input;
            case 4 /* Symbol */: return input;
            case 5 /* Number */: return input;
        }
        var hint = PreferredType === 3 /* String */ ? "string" : PreferredType === 5 /* Number */ ? "number" : "default";
        var exoticToPrim = GetMethod(input, toPrimitiveSymbol);
        if (exoticToPrim !== undefined) {
            var result = exoticToPrim.call(input, hint);
            if (IsObject(result))
                throw new TypeError();
            return result;
        }
        return OrdinaryToPrimitive(input, hint === "default" ? "number" : hint);
    }
    // 7.1.1.1 OrdinaryToPrimitive(O, hint)
    // https://tc39.github.io/ecma262/#sec-ordinarytoprimitive
    function OrdinaryToPrimitive(O, hint) {
        if (hint === "string") {
            var toString_1 = O.toString;
            if (IsCallable(toString_1)) {
                var result = toString_1.call(O);
                if (!IsObject(result))
                    return result;
            }
            var valueOf = O.valueOf;
            if (IsCallable(valueOf)) {
                var result = valueOf.call(O);
                if (!IsObject(result))
                    return result;
            }
        }
        else {
            var valueOf = O.valueOf;
            if (IsCallable(valueOf)) {
                var result = valueOf.call(O);
                if (!IsObject(result))
                    return result;
            }
            var toString_2 = O.toString;
            if (IsCallable(toString_2)) {
                var result = toString_2.call(O);
                if (!IsObject(result))
                    return result;
            }
        }
        throw new TypeError();
    }
    // 7.1.2 ToBoolean(argument)
    // https://tc39.github.io/ecma262/2016/#sec-toboolean
    function ToBoolean(argument) {
        return !!argument;
    }
    // 7.1.12 ToString(argument)
    // https://tc39.github.io/ecma262/#sec-tostring
    function ToString(argument) {
        return "" + argument;
    }
    // 7.1.14 ToPropertyKey(argument)
    // https://tc39.github.io/ecma262/#sec-topropertykey
    function ToPropertyKey(argument) {
        var key = ToPrimitive(argument, 3 /* String */);
        if (IsSymbol(key))
            return key;
        return ToString(key);
    }
    // 7.2 Testing and Comparison Operations
    // https://tc39.github.io/ecma262/#sec-testing-and-comparison-operations
    // 7.2.2 IsArray(argument)
    // https://tc39.github.io/ecma262/#sec-isarray
    function IsArray(argument) {
        return Array.isArray
            ? Array.isArray(argument)
            : argument instanceof Object
                ? argument instanceof Array
                : Object.prototype.toString.call(argument) === "[object Array]";
    }
    // 7.2.3 IsCallable(argument)
    // https://tc39.github.io/ecma262/#sec-iscallable
    function IsCallable(argument) {
        // NOTE: This is an approximation as we cannot check for [[Call]] internal method.
        return typeof argument === "function";
    }
    // 7.2.4 IsConstructor(argument)
    // https://tc39.github.io/ecma262/#sec-isconstructor
    function IsConstructor(argument) {
        // NOTE: This is an approximation as we cannot check for [[Construct]] internal method.
        return typeof argument === "function";
    }
    // 7.2.7 IsPropertyKey(argument)
    // https://tc39.github.io/ecma262/#sec-ispropertykey
    function IsPropertyKey(argument) {
        switch (Type(argument)) {
            case 3 /* String */: return true;
            case 4 /* Symbol */: return true;
            default: return false;
        }
    }
    // 7.3 Operations on Objects
    // https://tc39.github.io/ecma262/#sec-operations-on-objects
    // 7.3.9 GetMethod(V, P)
    // https://tc39.github.io/ecma262/#sec-getmethod
    function GetMethod(V, P) {
        var func = V[P];
        if (func === undefined || func === null)
            return undefined;
        if (!IsCallable(func))
            throw new TypeError();
        return func;
    }
    // 7.4 Operations on Iterator Objects
    // https://tc39.github.io/ecma262/#sec-operations-on-iterator-objects
    function GetIterator(obj) {
        var method = GetMethod(obj, iteratorSymbol);
        if (!IsCallable(method))
            throw new TypeError(); // from Call
        var iterator = method.call(obj);
        if (!IsObject(iterator))
            throw new TypeError();
        return iterator;
    }
    // 7.4.4 IteratorValue(iterResult)
    // https://tc39.github.io/ecma262/2016/#sec-iteratorvalue
    function IteratorValue(iterResult) {
        return iterResult.value;
    }
    // 7.4.5 IteratorStep(iterator)
    // https://tc39.github.io/ecma262/#sec-iteratorstep
    function IteratorStep(iterator) {
        var result = iterator.next();
        return result.done ? false : result;
    }
    // 7.4.6 IteratorClose(iterator, completion)
    // https://tc39.github.io/ecma262/#sec-iteratorclose
    function IteratorClose(iterator) {
        var f = iterator["return"];
        if (f)
            f.call(iterator);
    }
    // 9.1 Ordinary Object Internal Methods and Internal Slots
    // https://tc39.github.io/ecma262/#sec-ordinary-object-internal-methods-and-internal-slots
    // 9.1.1.1 OrdinaryGetPrototypeOf(O)
    // https://tc39.github.io/ecma262/#sec-ordinarygetprototypeof
    function OrdinaryGetPrototypeOf(O) {
        var proto = Object.getPrototypeOf(O);
        if (typeof O !== "function" || O === functionPrototype)
            return proto;
        // TypeScript doesn't set __proto__ in ES5, as it's non-standard.
        // Try to determine the superclass constructor. Compatible implementations
        // must either set __proto__ on a subclass constructor to the superclass constructor,
        // or ensure each class has a valid `constructor` property on its prototype that
        // points back to the constructor.
        // If this is not the same as Function.[[Prototype]], then this is definately inherited.
        // This is the case when in ES6 or when using __proto__ in a compatible browser.
        if (proto !== functionPrototype)
            return proto;
        // If the super prototype is Object.prototype, null, or undefined, then we cannot determine the heritage.
        var prototype = O.prototype;
        var prototypeProto = prototype && Object.getPrototypeOf(prototype);
        if (prototypeProto == null || prototypeProto === Object.prototype)
            return proto;
        // If the constructor was not a function, then we cannot determine the heritage.
        var constructor = prototypeProto.constructor;
        if (typeof constructor !== "function")
            return proto;
        // If we have some kind of self-reference, then we cannot determine the heritage.
        if (constructor === O)
            return proto;
        // we have a pretty good guess at the heritage.
        return constructor;
    }
    // naive Map shim
    function CreateMapPolyfill() {
        var cacheSentinel = {};
        var arraySentinel = [];
        var MapIterator = (function () {
            function MapIterator(keys, values, selector) {
                this._index = 0;
                this._keys = keys;
                this._values = values;
                this._selector = selector;
            }
            MapIterator.prototype["@@iterator"] = function () { return this; };
            MapIterator.prototype[iteratorSymbol] = function () { return this; };
            MapIterator.prototype.next = function () {
                var index = this._index;
                if (index >= 0 && index < this._keys.length) {
                    var result = this._selector(this._keys[index], this._values[index]);
                    if (index + 1 >= this._keys.length) {
                        this._index = -1;
                        this._keys = arraySentinel;
                        this._values = arraySentinel;
                    }
                    else {
                        this._index++;
                    }
                    return { value: result, done: false };
                }
                return { value: undefined, done: true };
            };
            MapIterator.prototype.throw = function (error) {
                if (this._index >= 0) {
                    this._index = -1;
                    this._keys = arraySentinel;
                    this._values = arraySentinel;
                }
                throw error;
            };
            MapIterator.prototype.return = function (value) {
                if (this._index >= 0) {
                    this._index = -1;
                    this._keys = arraySentinel;
                    this._values = arraySentinel;
                }
                return { value: value, done: true };
            };
            return MapIterator;
        }());
        return (function () {
            function Map() {
                this._keys = [];
                this._values = [];
                this._cacheKey = cacheSentinel;
                this._cacheIndex = -2;
            }
            Object.defineProperty(Map.prototype, "size", {
                get: function () { return this._keys.length; },
                enumerable: true,
                configurable: true
            });
            Map.prototype.has = function (key) { return this._find(key, /*insert*/ false) >= 0; };
            Map.prototype.get = function (key) {
                var index = this._find(key, /*insert*/ false);
                return index >= 0 ? this._values[index] : undefined;
            };
            Map.prototype.set = function (key, value) {
                var index = this._find(key, /*insert*/ true);
                this._values[index] = value;
                return this;
            };
            Map.prototype.delete = function (key) {
                var index = this._find(key, /*insert*/ false);
                if (index >= 0) {
                    var size = this._keys.length;
                    for (var i = index + 1; i < size; i++) {
                        this._keys[i - 1] = this._keys[i];
                        this._values[i - 1] = this._values[i];
                    }
                    this._keys.length--;
                    this._values.length--;
                    if (key === this._cacheKey) {
                        this._cacheKey = cacheSentinel;
                        this._cacheIndex = -2;
                    }
                    return true;
                }
                return false;
            };
            Map.prototype.clear = function () {
                this._keys.length = 0;
                this._values.length = 0;
                this._cacheKey = cacheSentinel;
                this._cacheIndex = -2;
            };
            Map.prototype.keys = function () { return new MapIterator(this._keys, this._values, getKey); };
            Map.prototype.values = function () { return new MapIterator(this._keys, this._values, getValue); };
            Map.prototype.entries = function () { return new MapIterator(this._keys, this._values, getEntry); };
            Map.prototype["@@iterator"] = function () { return this.entries(); };
            Map.prototype[iteratorSymbol] = function () { return this.entries(); };
            Map.prototype._find = function (key, insert) {
                if (this._cacheKey !== key) {
                    this._cacheIndex = this._keys.indexOf(this._cacheKey = key);
                }
                if (this._cacheIndex < 0 && insert) {
                    this._cacheIndex = this._keys.length;
                    this._keys.push(key);
                    this._values.push(undefined);
                }
                return this._cacheIndex;
            };
            return Map;
        }());
        function getKey(key, _) {
            return key;
        }
        function getValue(_, value) {
            return value;
        }
        function getEntry(key, value) {
            return [key, value];
        }
    }
    // naive Set shim
    function CreateSetPolyfill() {
        return (function () {
            function Set() {
                this._map = new _Map();
            }
            Object.defineProperty(Set.prototype, "size", {
                get: function () { return this._map.size; },
                enumerable: true,
                configurable: true
            });
            Set.prototype.has = function (value) { return this._map.has(value); };
            Set.prototype.add = function (value) { return this._map.set(value, value), this; };
            Set.prototype.delete = function (value) { return this._map.delete(value); };
            Set.prototype.clear = function () { this._map.clear(); };
            Set.prototype.keys = function () { return this._map.keys(); };
            Set.prototype.values = function () { return this._map.values(); };
            Set.prototype.entries = function () { return this._map.entries(); };
            Set.prototype["@@iterator"] = function () { return this.keys(); };
            Set.prototype[iteratorSymbol] = function () { return this.keys(); };
            return Set;
        }());
    }
    // naive WeakMap shim
    function CreateWeakMapPolyfill() {
        var UUID_SIZE = 16;
        var keys = HashMap.create();
        var rootKey = CreateUniqueKey();
        return (function () {
            function WeakMap() {
                this._key = CreateUniqueKey();
            }
            WeakMap.prototype.has = function (target) {
                var table = GetOrCreateWeakMapTable(target, /*create*/ false);
                return table !== undefined ? HashMap.has(table, this._key) : false;
            };
            WeakMap.prototype.get = function (target) {
                var table = GetOrCreateWeakMapTable(target, /*create*/ false);
                return table !== undefined ? HashMap.get(table, this._key) : undefined;
            };
            WeakMap.prototype.set = function (target, value) {
                var table = GetOrCreateWeakMapTable(target, /*create*/ true);
                table[this._key] = value;
                return this;
            };
            WeakMap.prototype.delete = function (target) {
                var table = GetOrCreateWeakMapTable(target, /*create*/ false);
                return table !== undefined ? delete table[this._key] : false;
            };
            WeakMap.prototype.clear = function () {
                // NOTE: not a real clear, just makes the previous data unreachable
                this._key = CreateUniqueKey();
            };
            return WeakMap;
        }());
        function CreateUniqueKey() {
            var key;
            do
                key = "@@WeakMap@@" + CreateUUID();
            while (HashMap.has(keys, key));
            keys[key] = true;
            return key;
        }
        function GetOrCreateWeakMapTable(target, create) {
            if (!hasOwn.call(target, rootKey)) {
                if (!create)
                    return undefined;
                Object.defineProperty(target, rootKey, { value: HashMap.create() });
            }
            return target[rootKey];
        }
        function FillRandomBytes(buffer, size) {
            for (var i = 0; i < size; ++i)
                buffer[i] = Math.random() * 0xff | 0;
            return buffer;
        }
        function GenRandomBytes(size) {
            if (typeof Uint8Array === "function") {
                if (typeof crypto !== "undefined")
                    return crypto.getRandomValues(new Uint8Array(size));
                if (typeof msCrypto !== "undefined")
                    return msCrypto.getRandomValues(new Uint8Array(size));
                return FillRandomBytes(new Uint8Array(size), size);
            }
            return FillRandomBytes(new Array(size), size);
        }
        function CreateUUID() {
            var data = GenRandomBytes(UUID_SIZE);
            // mark as random - RFC 4122 § 4.4
            data[6] = data[6] & 0x4f | 0x40;
            data[8] = data[8] & 0xbf | 0x80;
            var result = "";
            for (var offset = 0; offset < UUID_SIZE; ++offset) {
                var byte = data[offset];
                if (offset === 4 || offset === 6 || offset === 8)
                    result += "-";
                if (byte < 16)
                    result += "0";
                result += byte.toString(16).toLowerCase();
            }
            return result;
        }
    }
    // uses a heuristic used by v8 and chakra to force an object into dictionary mode.
    function MakeDictionary(obj) {
        obj.__ = undefined;
        delete obj.__;
        return obj;
    }
    // patch global Reflect
    (function (__global) {
        if (typeof __global.Reflect !== "undefined") {
            if (__global.Reflect !== Reflect) {
                for (var p in Reflect) {
                    if (hasOwn.call(Reflect, p)) {
                        __global.Reflect[p] = Reflect[p];
                    }
                }
            }
        }
        else {
            __global.Reflect = Reflect;
        }
    })(typeof global !== "undefined" ? global :
        typeof self !== "undefined" ? self :
            Function("return this;")());
})(Reflect || (Reflect = {}));
//# sourceMappingURL=Reflect.js.map
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(51), __webpack_require__(59)))

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var Observable_1 = __webpack_require__(3);
var throw_1 = __webpack_require__(44);
Observable_1.Observable.throw = throw_1._throw;
//# sourceMappingURL=throw.js.map

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var Observable_1 = __webpack_require__(3);
var catch_1 = __webpack_require__(58);
Observable_1.Observable.prototype.catch = catch_1._catch;
Observable_1.Observable.prototype._catch = catch_1._catch;
//# sourceMappingURL=catch.js.map

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var Observable_1 = __webpack_require__(3);
var map_1 = __webpack_require__(52);
Observable_1.Observable.prototype.map = map_1.map;
//# sourceMappingURL=map.js.map

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Observable_1 = __webpack_require__(3);
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @extends {Ignored}
 * @hide true
 */
var ErrorObservable = (function (_super) {
    __extends(ErrorObservable, _super);
    function ErrorObservable(error, scheduler) {
        _super.call(this);
        this.error = error;
        this.scheduler = scheduler;
    }
    /**
     * Creates an Observable that emits no items to the Observer and immediately
     * emits an error notification.
     *
     * <span class="informal">Just emits 'error', and nothing else.
     * </span>
     *
     * <img src="./img/throw.png" width="100%">
     *
     * This static operator is useful for creating a simple Observable that only
     * emits the error notification. It can be used for composing with other
     * Observables, such as in a {@link mergeMap}.
     *
     * @example <caption>Emit the number 7, then emit an error.</caption>
     * var result = Rx.Observable.throw(new Error('oops!')).startWith(7);
     * result.subscribe(x => console.log(x), e => console.error(e));
     *
     * @example <caption>Map and flatten numbers to the sequence 'a', 'b', 'c', but throw an error for 13</caption>
     * var interval = Rx.Observable.interval(1000);
     * var result = interval.mergeMap(x =>
     *   x === 13 ?
     *     Rx.Observable.throw('Thirteens are bad') :
     *     Rx.Observable.of('a', 'b', 'c')
     * );
     * result.subscribe(x => console.log(x), e => console.error(e));
     *
     * @see {@link create}
     * @see {@link empty}
     * @see {@link never}
     * @see {@link of}
     *
     * @param {any} error The particular Error to pass to the error notification.
     * @param {Scheduler} [scheduler] A {@link IScheduler} to use for scheduling
     * the emission of the error notification.
     * @return {Observable} An error Observable: emits only the error notification
     * using the given error argument.
     * @static true
     * @name throw
     * @owner Observable
     */
    ErrorObservable.create = function (error, scheduler) {
        return new ErrorObservable(error, scheduler);
    };
    ErrorObservable.dispatch = function (arg) {
        var error = arg.error, subscriber = arg.subscriber;
        subscriber.error(error);
    };
    ErrorObservable.prototype._subscribe = function (subscriber) {
        var error = this.error;
        var scheduler = this.scheduler;
        subscriber.syncErrorThrowable = true;
        if (scheduler) {
            return scheduler.schedule(ErrorObservable.dispatch, 0, {
                error: error, subscriber: subscriber
            });
        }
        else {
            subscriber.error(error);
        }
    };
    return ErrorObservable;
}(Observable_1.Observable));
exports.ErrorObservable = ErrorObservable;
//# sourceMappingURL=ErrorObservable.js.map

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ErrorObservable_1 = __webpack_require__(43);
exports._throw = ErrorObservable_1.ErrorObservable.create;
//# sourceMappingURL=throw.js.map

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ansiRegex = __webpack_require__(13)();

module.exports = function (str) {
	return typeof str === 'string' ? str.replace(ansiRegex, '') : str;
};


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {


        var result = __webpack_require__(23);

        if (typeof result === "string") {
            module.exports = result;
        } else {
            module.exports = result.toString();
        }
    

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {


        var result = __webpack_require__(24);

        if (typeof result === "string") {
            module.exports = result;
        } else {
            module.exports = result.toString();
        }
    

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

/*eslint-env browser*/

var clientOverlay = document.createElement('div');
clientOverlay.id = 'webpack-hot-middleware-clientOverlay';
var styles = {
  background: 'rgba(0,0,0,0.85)',
  color: '#E8E8E8',
  lineHeight: '1.2',
  whiteSpace: 'pre',
  fontFamily: 'Menlo, Consolas, monospace',
  fontSize: '13px',
  position: 'fixed',
  zIndex: 9999,
  padding: '10px',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  overflow: 'auto',
  dir: 'ltr',
  textAlign: 'left'
};
for (var key in styles) {
  clientOverlay.style[key] = styles[key];
}

var ansiHTML = __webpack_require__(12);
var colors = {
  reset: ['transparent', 'transparent'],
  black: '181818',
  red: 'E36049',
  green: 'B3CB74',
  yellow: 'FFD080',
  blue: '7CAFC2',
  magenta: '7FACCA',
  cyan: 'C3C2EF',
  lightgrey: 'EBE7E3',
  darkgrey: '6D7891'
};
ansiHTML.setColors(colors);

var Entities = __webpack_require__(25).AllHtmlEntities;
var entities = new Entities();

exports.showProblems =
function showProblems(type, lines) {
  clientOverlay.innerHTML = '';
  lines.forEach(function(msg) {
    msg = ansiHTML(entities.encode(msg));
    var div = document.createElement('div');
    div.style.marginBottom = '26px';
    div.innerHTML = problemType(type) + ' in ' + msg;
    clientOverlay.appendChild(div);
  });
  if (document.body) {
    document.body.appendChild(clientOverlay);
  }
};

exports.clear =
function clear() {
  if (document.body && clientOverlay.parentNode) {
    document.body.removeChild(clientOverlay);
  }
};

var problemColors = {
  errors: colors.red,
  warnings: colors.yellow
};

function problemType (type) {
  var color = problemColors[type] || colors.red;
  return (
    '<span style="background-color:#' + color + '; color:#fff; padding:2px 4px; border-radius: 2px">' +
      type.slice(0, -1).toUpperCase() +
    '</span>'
  );
}


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Based heavily on https://github.com/webpack/webpack/blob/
 *  c0afdf9c6abc1dd70707c594e473802a566f7b6e/hot/only-dev-server.js
 * Original copyright Tobias Koppers @sokra (MIT license)
 */

/* global window __webpack_hash__ */

if (false) {
  throw new Error("[HMR] Hot Module Replacement is disabled.");
}

var hmrDocsUrl = "http://webpack.github.io/docs/hot-module-replacement-with-webpack.html"; // eslint-disable-line max-len

var lastHash;
var failureStatuses = { abort: 1, fail: 1 };
var applyOptions = { ignoreUnaccepted: true };

function upToDate(hash) {
  if (hash) lastHash = hash;
  return lastHash == __webpack_require__.h();
}

module.exports = function(hash, moduleMap, options) {
  var reload = options.reload;
  if (!upToDate(hash) && module.hot.status() == "idle") {
    if (options.log) console.log("[HMR] Checking for updates on the server...");
    check();
  }

  function check() {
    var cb = function(err, updatedModules) {
      if (err) return handleError(err);

      if(!updatedModules) {
        if (options.warn) {
          console.warn("[HMR] Cannot find update (Full reload needed)");
          console.warn("[HMR] (Probably because of restarting the server)");
        }
        performReload();
        return null;
      }

      var applyCallback = function(applyErr, renewedModules) {
        if (applyErr) return handleError(applyErr);

        if (!upToDate()) check();

        logUpdates(updatedModules, renewedModules);
      };

      var applyResult = module.hot.apply(applyOptions, applyCallback);
      // webpack 2 promise
      if (applyResult && applyResult.then) {
        // HotModuleReplacement.runtime.js refers to the result as `outdatedModules`
        applyResult.then(function(outdatedModules) {
          applyCallback(null, outdatedModules);
        });
        applyResult.catch(applyCallback);
      }

    };

    var result = module.hot.check(false, cb);
    // webpack 2 promise
    if (result && result.then) {
        result.then(function(updatedModules) {
            cb(null, updatedModules);
        });
        result.catch(cb);
    }
  }

  function logUpdates(updatedModules, renewedModules) {
    var unacceptedModules = updatedModules.filter(function(moduleId) {
      return renewedModules && renewedModules.indexOf(moduleId) < 0;
    });

    if(unacceptedModules.length > 0) {
      if (options.warn) {
        console.warn(
          "[HMR] The following modules couldn't be hot updated: " +
          "(Full reload needed)\n" +
          "This is usually because the modules which have changed " +
          "(and their parents) do not know how to hot reload themselves. " +
          "See " + hmrDocsUrl + " for more details."
        );
        unacceptedModules.forEach(function(moduleId) {
          console.warn("[HMR]  - " + moduleMap[moduleId]);
        });
      }
      performReload();
      return;
    }

    if (options.log) {
      if(!renewedModules || renewedModules.length === 0) {
        console.log("[HMR] Nothing hot updated.");
      } else {
        console.log("[HMR] Updated modules:");
        renewedModules.forEach(function(moduleId) {
          console.log("[HMR]  - " + moduleMap[moduleId]);
        });
      }

      if (upToDate()) {
        console.log("[HMR] App is up to date.");
      }
    }
  }

  function handleError(err) {
    if (module.hot.status() in failureStatuses) {
      if (options.warn) {
        console.warn("[HMR] Cannot check for update (Full reload needed)");
        console.warn("[HMR] " + err.stack || err.message);
      }
      performReload();
      return;
    }
    if (options.warn) {
      console.warn("[HMR] Update check failed: " + err.stack || err.message);
    }
  }

  function performReload() {
    if (reload) {
      if (options.warn) console.warn("[HMR] Reloading page");
      window.location.reload();
    }
  }
};


/***/ }),
/* 50 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(23);

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(28);

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(38);

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(40);

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(42);

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(47);

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(6);

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(73);

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(8);

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(9);

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(11);
__webpack_require__(10);
module.exports = __webpack_require__(9);


/***/ })
/******/ ]);
//# sourceMappingURL=main-client.js.map