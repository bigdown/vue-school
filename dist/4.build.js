webpackJsonp([4],[
/* 0 */,
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
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


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 14 */,
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _vue = __webpack_require__(1);

	var _vue2 = _interopRequireDefault(_vue);

	var _vuex = __webpack_require__(16);

	var _vuex2 = _interopRequireDefault(_vuex);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	_vue2.default.use(_vuex2.default);

	var state = {
	  title: '首页'
	};

	var mutations = {
	  MODIFYTITLE: function MODIFYTITLE(state, strTitle) {
	    state.title = strTitle;
	  }
	};

	exports.default = new _vuex2.default.Store({
	  state: state,
	  mutations: mutations
	});

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	/*!
	 * Vuex v1.0.0-rc.2
	 * (c) 2016 Evan You
	 * Released under the MIT License.
	 */
	(function (global, factory) {
	   true ? module.exports = factory() :
	  typeof define === 'function' && define.amd ? define(factory) :
	  (global.Vuex = factory());
	}(this, function () { 'use strict';

	  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
	    return typeof obj;
	  } : function (obj) {
	    return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
	  };

	  var classCallCheck = function (instance, Constructor) {
	    if (!(instance instanceof Constructor)) {
	      throw new TypeError("Cannot call a class as a function");
	    }
	  };

	  var createClass = function () {
	    function defineProperties(target, props) {
	      for (var i = 0; i < props.length; i++) {
	        var descriptor = props[i];
	        descriptor.enumerable = descriptor.enumerable || false;
	        descriptor.configurable = true;
	        if ("value" in descriptor) descriptor.writable = true;
	        Object.defineProperty(target, descriptor.key, descriptor);
	      }
	    }

	    return function (Constructor, protoProps, staticProps) {
	      if (protoProps) defineProperties(Constructor.prototype, protoProps);
	      if (staticProps) defineProperties(Constructor, staticProps);
	      return Constructor;
	    };
	  }();

	  var toConsumableArray = function (arr) {
	    if (Array.isArray(arr)) {
	      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

	      return arr2;
	    } else {
	      return Array.from(arr);
	    }
	  };

	  /**
	   * Merge an array of objects into one.
	   *
	   * @param {Array<Object>} arr
	   * @return {Object}
	   */

	  function mergeObjects(arr) {
	    return arr.reduce(function (prev, obj) {
	      Object.keys(obj).forEach(function (key) {
	        var existing = prev[key];
	        if (existing) {
	          // allow multiple mutation objects to contain duplicate
	          // handlers for the same mutation type
	          if (Array.isArray(existing)) {
	            prev[key] = existing.concat(obj[key]);
	          } else {
	            prev[key] = [existing].concat(obj[key]);
	          }
	        } else {
	          prev[key] = obj[key];
	        }
	      });
	      return prev;
	    }, {});
	  }

	  /**
	   * Check whether the given value is Object or not
	   *
	   * @param {*} obj
	   * @return {Boolean}
	   */

	  function isObject(obj) {
	    return obj !== null && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object';
	  }

	  /**
	   * Get state sub tree by given keys.
	   *
	   * @param {Object} state
	   * @param {Array<String>} nestedKeys
	   * @return {Object}
	   */
	  function getNestedState(state, nestedKeys) {
	    return nestedKeys.reduce(function (state, key) {
	      return state[key];
	    }, state);
	  }

	  /**
	   * Hacks to get access to Vue internals.
	   * Maybe we should expose these...
	   */

	  var Watcher = void 0;
	  function getWatcher(vm) {
	    if (!Watcher) {
	      var noop = function noop() {};
	      var unwatch = vm.$watch(noop, noop);
	      Watcher = vm._watchers[0].constructor;
	      unwatch();
	    }
	    return Watcher;
	  }

	  var Dep = void 0;
	  function getDep(vm) {
	    if (!Dep) {
	      Dep = vm._data.__ob__.dep.constructor;
	    }
	    return Dep;
	  }

	  var hook = typeof window !== 'undefined' && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

	  function devtoolPlugin(store) {
	    if (!hook) return;

	    hook.emit('vuex:init', store);

	    hook.on('vuex:travel-to-state', function (targetState) {
	      store.replaceState(targetState);
	    });

	    store.subscribe(function (mutation, state) {
	      hook.emit('vuex:mutation', mutation, state);
	    });
	  }

	  function override (Vue) {
	    var version = Number(Vue.version.split('.')[0]);

	    if (version >= 2) {
	      var usesInit = Vue.config._lifecycleHooks.indexOf('init') > -1;
	      Vue.mixin(usesInit ? { init: vuexInit } : { beforeCreate: vuexInit });
	    } else {
	      (function () {
	        // override init and inject vuex init procedure
	        // for 1.x backwards compatibility.
	        var _init = Vue.prototype._init;
	        Vue.prototype._init = function () {
	          var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	          options.init = options.init ? [vuexInit].concat(options.init) : vuexInit;
	          _init.call(this, options);
	        };
	      })();
	    }

	    /**
	     * Vuex init hook, injected into each instances init hooks list.
	     */

	    function vuexInit() {
	      var options = this.$options;
	      var store = options.store;
	      var vuex = options.vuex;
	      // store injection

	      if (store) {
	        this.$store = store;
	      } else if (options.parent && options.parent.$store) {
	        this.$store = options.parent.$store;
	      }
	      // vuex option handling
	      if (vuex) {
	        if (!this.$store) {
	          console.warn('[vuex] store not injected. make sure to ' + 'provide the store option in your root component.');
	        }
	        var state = vuex.state;
	        var actions = vuex.actions;
	        var getters = vuex.getters;
	        // handle deprecated state option

	        if (state && !getters) {
	          console.warn('[vuex] vuex.state option will been deprecated in 1.0. ' + 'Use vuex.getters instead.');
	          getters = state;
	        }
	        // getters
	        if (getters) {
	          options.computed = options.computed || {};
	          for (var key in getters) {
	            defineVuexGetter(this, key, getters[key]);
	          }
	        }
	        // actions
	        if (actions) {
	          options.methods = options.methods || {};
	          for (var _key in actions) {
	            options.methods[_key] = makeBoundAction(this.$store, actions[_key], _key);
	          }
	        }
	      }
	    }

	    /**
	     * Setter for all getter properties.
	     */

	    function setter() {
	      throw new Error('vuex getter properties are read-only.');
	    }

	    /**
	     * Define a Vuex getter on an instance.
	     *
	     * @param {Vue} vm
	     * @param {String} key
	     * @param {Function} getter
	     */

	    function defineVuexGetter(vm, key, getter) {
	      if (typeof getter !== 'function') {
	        console.warn('[vuex] Getter bound to key \'vuex.getters.' + key + '\' is not a function.');
	      } else {
	        Object.defineProperty(vm, key, {
	          enumerable: true,
	          configurable: true,
	          get: makeComputedGetter(vm.$store, getter),
	          set: setter
	        });
	      }
	    }

	    /**
	     * Make a computed getter, using the same caching mechanism of computed
	     * properties. In addition, it is cached on the raw getter function using
	     * the store's unique cache id. This makes the same getter shared
	     * across all components use the same underlying watcher, and makes
	     * the getter evaluated only once during every flush.
	     *
	     * @param {Store} store
	     * @param {Function} getter
	     */

	    function makeComputedGetter(store, getter) {
	      var id = store._getterCacheId;

	      // cached
	      if (getter[id]) {
	        return getter[id];
	      }
	      var vm = store._vm;
	      var Watcher = getWatcher(vm);
	      var Dep = getDep(vm);
	      var watcher = new Watcher(vm, function (vm) {
	        return getter(vm.state);
	      }, null, { lazy: true });
	      var computedGetter = function computedGetter() {
	        if (watcher.dirty) {
	          watcher.evaluate();
	        }
	        if (Dep.target) {
	          watcher.depend();
	        }
	        return watcher.value;
	      };
	      getter[id] = computedGetter;
	      return computedGetter;
	    }

	    /**
	     * Make a bound-to-store version of a raw action function.
	     *
	     * @param {Store} store
	     * @param {Function} action
	     * @param {String} key
	     */

	    function makeBoundAction(store, action, key) {
	      if (typeof action !== 'function') {
	        console.warn('[vuex] Action bound to key \'vuex.actions.' + key + '\' is not a function.');
	      }
	      return function vuexBoundAction() {
	        for (var _len = arguments.length, args = Array(_len), _key2 = 0; _key2 < _len; _key2++) {
	          args[_key2] = arguments[_key2];
	        }

	        return action.call.apply(action, [this, store].concat(args));
	      };
	    }

	    // option merging
	    var merge = Vue.config.optionMergeStrategies.computed;
	    Vue.config.optionMergeStrategies.vuex = function (toVal, fromVal) {
	      if (!toVal) return fromVal;
	      if (!fromVal) return toVal;
	      return {
	        getters: merge(toVal.getters, fromVal.getters),
	        state: merge(toVal.state, fromVal.state),
	        actions: merge(toVal.actions, fromVal.actions)
	      };
	    };
	  }

	  var Vue = void 0;
	  var uid = 0;

	  var Store = function () {

	    /**
	     * @param {Object} options
	     *        - {Object} state
	     *        - {Object} actions
	     *        - {Object} mutations
	     *        - {Array} plugins
	     *        - {Boolean} strict
	     */

	    function Store() {
	      var _this = this;

	      var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	      var _ref$state = _ref.state;
	      var state = _ref$state === undefined ? {} : _ref$state;
	      var _ref$mutations = _ref.mutations;
	      var mutations = _ref$mutations === undefined ? {} : _ref$mutations;
	      var _ref$modules = _ref.modules;
	      var modules = _ref$modules === undefined ? {} : _ref$modules;
	      var _ref$plugins = _ref.plugins;
	      var plugins = _ref$plugins === undefined ? [] : _ref$plugins;
	      var _ref$strict = _ref.strict;
	      var strict = _ref$strict === undefined ? false : _ref$strict;
	      classCallCheck(this, Store);

	      this._getterCacheId = 'vuex_store_' + uid++;
	      this._dispatching = false;
	      this._rootMutations = this._mutations = mutations;
	      this._modules = modules;
	      this._subscribers = [];
	      // bind dispatch to self
	      var dispatch = this.dispatch;
	      this.dispatch = function () {
	        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	          args[_key] = arguments[_key];
	        }

	        dispatch.apply(_this, args);
	      };
	      // use a Vue instance to store the state tree
	      // suppress warnings just in case the user has added
	      // some funky global mixins
	      if (!Vue) {
	        throw new Error('[vuex] must call Vue.use(Vuex) before creating a store instance.');
	      }
	      var silent = Vue.config.silent;
	      Vue.config.silent = true;
	      this._vm = new Vue({
	        data: {
	          state: state
	        }
	      });
	      Vue.config.silent = silent;
	      this._setupModuleState(state, modules);
	      this._setupModuleMutations(modules);
	      // add extra warnings in strict mode
	      if (strict) {
	        this._setupMutationCheck();
	      }
	      // apply plugins
	      devtoolPlugin(this);
	      plugins.forEach(function (plugin) {
	        return plugin(_this);
	      });
	    }

	    /**
	     * Getter for the entire state tree.
	     * Read only.
	     *
	     * @return {Object}
	     */

	    createClass(Store, [{
	      key: 'replaceState',


	      /**
	       * Replace root state.
	       *
	       * @param {Object} state
	       */

	      value: function replaceState(state) {
	        this._dispatching = true;
	        this._vm.state = state;
	        this._dispatching = false;
	      }

	      /**
	       * Dispatch an action.
	       *
	       * @param {String} type
	       */

	    }, {
	      key: 'dispatch',
	      value: function dispatch(type) {
	        var _this2 = this;

	        for (var _len2 = arguments.length, payload = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
	          payload[_key2 - 1] = arguments[_key2];
	        }

	        var silent = false;
	        var isObjectStyleDispatch = false;
	        // compatibility for object actions, e.g. FSA
	        if ((typeof type === 'undefined' ? 'undefined' : _typeof(type)) === 'object' && type.type && arguments.length === 1) {
	          isObjectStyleDispatch = true;
	          payload = type;
	          if (type.silent) silent = true;
	          type = type.type;
	        }
	        var handler = this._mutations[type];
	        var state = this.state;
	        if (handler) {
	          this._dispatching = true;
	          // apply the mutation
	          if (Array.isArray(handler)) {
	            handler.forEach(function (h) {
	              isObjectStyleDispatch ? h(state, payload) : h.apply(undefined, [state].concat(toConsumableArray(payload)));
	            });
	          } else {
	            isObjectStyleDispatch ? handler(state, payload) : handler.apply(undefined, [state].concat(toConsumableArray(payload)));
	          }
	          this._dispatching = false;
	          if (!silent) {
	            (function () {
	              var mutation = isObjectStyleDispatch ? payload : { type: type, payload: payload };
	              _this2._subscribers.forEach(function (sub) {
	                return sub(mutation, state);
	              });
	            })();
	          }
	        } else {
	          console.warn('[vuex] Unknown mutation: ' + type);
	        }
	      }

	      /**
	       * Watch state changes on the store.
	       * Same API as Vue's $watch, except when watching a function,
	       * the function gets the state as the first argument.
	       *
	       * @param {Function} fn
	       * @param {Function} cb
	       * @param {Object} [options]
	       */

	    }, {
	      key: 'watch',
	      value: function watch(fn, cb, options) {
	        var _this3 = this;

	        if (typeof fn !== 'function') {
	          console.error('Vuex store.watch only accepts function.');
	          return;
	        }
	        return this._vm.$watch(function () {
	          return fn(_this3.state);
	        }, cb, options);
	      }

	      /**
	       * Subscribe to state changes. Fires after every mutation.
	       */

	    }, {
	      key: 'subscribe',
	      value: function subscribe(fn) {
	        var subs = this._subscribers;
	        if (subs.indexOf(fn) < 0) {
	          subs.push(fn);
	        }
	        return function () {
	          var i = subs.indexOf(fn);
	          if (i > -1) {
	            subs.splice(i, 1);
	          }
	        };
	      }

	      /**
	       * Hot update mutations & modules.
	       *
	       * @param {Object} options
	       *        - {Object} [mutations]
	       *        - {Object} [modules]
	       */

	    }, {
	      key: 'hotUpdate',
	      value: function hotUpdate() {
	        var _ref2 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	        var mutations = _ref2.mutations;
	        var modules = _ref2.modules;

	        this._rootMutations = this._mutations = mutations || this._rootMutations;
	        this._setupModuleMutations(modules || this._modules);
	      }

	      /**
	       * Attach sub state tree of each module to the root tree.
	       *
	       * @param {Object} state
	       * @param {Object} modules
	       */

	    }, {
	      key: '_setupModuleState',
	      value: function _setupModuleState(state, modules) {
	        var _this4 = this;

	        if (!isObject(modules)) return;

	        Object.keys(modules).forEach(function (key) {
	          var module = modules[key];

	          // set this module's state
	          Vue.set(state, key, module.state || {});

	          // retrieve nested modules
	          _this4._setupModuleState(state[key], module.modules);
	        });
	      }

	      /**
	       * Bind mutations for each module to its sub tree and
	       * merge them all into one final mutations map.
	       *
	       * @param {Object} updatedModules
	       */

	    }, {
	      key: '_setupModuleMutations',
	      value: function _setupModuleMutations(updatedModules) {
	        var modules = this._modules;
	        Object.keys(updatedModules).forEach(function (key) {
	          modules[key] = updatedModules[key];
	        });
	        var updatedMutations = this._createModuleMutations(modules, []);
	        this._mutations = mergeObjects([this._rootMutations].concat(toConsumableArray(updatedMutations)));
	      }

	      /**
	       * Helper method for _setupModuleMutations.
	       * The method retrieve nested sub modules and
	       * bind each mutations to its sub tree recursively.
	       *
	       * @param {Object} modules
	       * @param {Array<String>} nestedKeys
	       * @return {Array<Object>}
	       */

	    }, {
	      key: '_createModuleMutations',
	      value: function _createModuleMutations(modules, nestedKeys) {
	        var _this5 = this;

	        if (!isObject(modules)) return [];

	        return Object.keys(modules).map(function (key) {
	          var module = modules[key];
	          var newNestedKeys = nestedKeys.concat(key);

	          // retrieve nested modules
	          var nestedMutations = _this5._createModuleMutations(module.modules, newNestedKeys);

	          if (!module || !module.mutations) {
	            return mergeObjects(nestedMutations);
	          }

	          // bind mutations to sub state tree
	          var mutations = {};
	          Object.keys(module.mutations).forEach(function (name) {
	            var original = module.mutations[name];
	            mutations[name] = function (state) {
	              for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
	                args[_key3 - 1] = arguments[_key3];
	              }

	              original.apply(undefined, [getNestedState(state, newNestedKeys)].concat(args));
	            };
	          });

	          // merge mutations of this module and nested modules
	          return mergeObjects([mutations].concat(toConsumableArray(nestedMutations)));
	        });
	      }

	      /**
	       * Setup mutation check: if the vuex instance's state is mutated
	       * outside of a mutation handler, we throw en error. This effectively
	       * enforces all mutations to the state to be trackable and hot-reloadble.
	       * However, this comes at a run time cost since we are doing a deep
	       * watch on the entire state tree, so it is only enalbed with the
	       * strict option is set to true.
	       */

	    }, {
	      key: '_setupMutationCheck',
	      value: function _setupMutationCheck() {
	        var _this6 = this;

	        var Watcher = getWatcher(this._vm);
	        /* eslint-disable no-new */
	        new Watcher(this._vm, 'state', function () {
	          if (!_this6._dispatching) {
	            throw new Error('[vuex] Do not mutate vuex store state outside mutation handlers.');
	          }
	        }, { deep: true, sync: true });
	        /* eslint-enable no-new */
	      }
	    }, {
	      key: 'state',
	      get: function get() {
	        return this._vm.state;
	      },
	      set: function set(v) {
	        throw new Error('[vuex] Use store.replaceState() to explicit replace store state.');
	      }
	    }]);
	    return Store;
	  }();

	  function install(_Vue) {
	    if (Vue) {
	      console.warn('[vuex] already installed. Vue.use(Vuex) should be called only once.');
	      return;
	    }
	    Vue = _Vue;
	    override(Vue);
	  }

	  // auto install in dist mode
	  if (typeof window !== 'undefined' && window.Vue) {
	    install(window.Vue);
	  }

	  var index = {
	    Store: Store,
	    install: install
	  };

	  return index;

	}));

/***/ },
/* 17 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var modifyTitle = exports.modifyTitle = function modifyTitle(_ref, title) {
		var dispatch = _ref.dispatch;

		dispatch('MODIFYTITLE', title);
	};

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_script__, __vue_template__
	__webpack_require__(19)
	__vue_script__ = __webpack_require__(21)
	__vue_template__ = __webpack_require__(22)
	module.exports = __vue_script__ || {}
	if (module.exports.__esModule) module.exports = module.exports.default
	if (__vue_template__) { (typeof module.exports === "function" ? module.exports.options : module.exports).template = __vue_template__ }
	if (false) {(function () {  module.hot.accept()
	  var hotAPI = require("vue-hot-reload-api")
	  hotAPI.install(require("vue"), true)
	  if (!hotAPI.compatible) return
	  var id = "E:\\nodejs\\vue-school\\src\\components\\sheader.vue"
	  if (!module.hot.data) {
	    hotAPI.createRecord(id, module.exports)
	  } else {
	    hotAPI.update(id, module.exports, __vue_template__)
	  }
	})()}

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(20);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(13)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/vue-loader/lib/style-rewriter.js?id=_v-235d544b&file=sheader.vue&scoped=true!./../../node_modules/vue-loader/lib/selector.js?type=style&index=0!./sheader.vue", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/vue-loader/lib/style-rewriter.js?id=_v-235d544b&file=sheader.vue&scoped=true!./../../node_modules/vue-loader/lib/selector.js?type=style&index=0!./sheader.vue");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(12)();
	// imports


	// module
	exports.push([module.id, "\r\n\theader[_v-235d544b]{\r\n\t\tposition: fixed;\r\n\t\theight: 50px;\r\n\t\tline-height: 50px;\r\n\t\ttop: 0;\r\n\t\tleft: 0;\r\n\t\tright: 0;\r\n\t\tbackground: #828282;\r\n\t\t/*opacity: 0.5;*/\r\n\t\ttext-align: center;\r\n\t\tcolor: #FFF;\r\n\t\tborder-bottom: 1px solid #DDD;\r\n\t\tz-index: 10;\r\n\t}\r\n\theader > div[_v-235d544b]{\r\n\t\tfloat: left;\r\n\t\tdisplay: block;\r\n\t\theight: 50px;\r\n\t\tline-height: 50px;\r\n\t}\r\n\t.wid20[_v-235d544b]{\r\n\t\twidth: 20%;\r\n\t\tbox-sizing: border-box;\r\n\t}\r\n\t.wid60[_v-235d544b]{\r\n\t\twidth: 60%;\r\n\t}\r\n\t.left[_v-235d544b]{\r\n\t\ttext-align: left;\r\n\t\tpadding-left: 10px;\r\n\t}\r\n\t.right[_v-235d544b]{\r\n\t\ttext-align: right;\r\n\t\tpadding-right: 10px;\r\n\t}\r\n", ""]);

	// exports


/***/ },
/* 21 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	// <template>
	// 	<header>
	// 		<div class="wid20 left">{{{ laction }}}</div>
	// 		<div class="wid60">{{ title }}</div>
	// 		<div class="wid20 right">{{{ raction }}}</div>
	// 	</header>
	// </template>
	//
	// <script>
	exports.default = {
		props: {
			title: String,
			laction: String,
			raction: String
		}
	};

	// </script>
	//
	// <style scoped>
	// 	header{
	// 		position: fixed;
	// 		height: 50px;
	// 		line-height: 50px;
	// 		top: 0;
	// 		left: 0;
	// 		right: 0;
	// 		background: #828282;
	// 		/*opacity: 0.5;*/
	// 		text-align: center;
	// 		color: #FFF;
	// 		border-bottom: 1px solid #DDD;
	// 		z-index: 10;
	// 	}
	// 	header > div{
	// 		float: left;
	// 		display: block;
	// 		height: 50px;
	// 		line-height: 50px;
	// 	}
	// 	.wid20{
	// 		width: 20%;
	// 		box-sizing: border-box;
	// 	}
	// 	.wid60{
	// 		width: 60%;
	// 	}
	// 	.left{
	// 		text-align: left;
	// 		padding-left: 10px;
	// 	}
	// 	.right{
	// 		text-align: right;
	// 		padding-right: 10px;
	// 	}
	// </style>

/***/ },
/* 22 */
/***/ function(module, exports) {

	module.exports = "\n\t<header _v-235d544b=\"\">\n\t\t<div class=\"wid20 left\" _v-235d544b=\"\">{{{ laction }}}</div>\n\t\t<div class=\"wid60\" _v-235d544b=\"\">{{ title }}</div>\n\t\t<div class=\"wid20 right\" _v-235d544b=\"\">{{{ raction }}}</div>\n\t</header>\n";

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_script__, __vue_template__
	__webpack_require__(24)
	__vue_script__ = __webpack_require__(30)
	__vue_template__ = __webpack_require__(31)
	module.exports = __vue_script__ || {}
	if (module.exports.__esModule) module.exports = module.exports.default
	if (__vue_template__) { (typeof module.exports === "function" ? module.exports.options : module.exports).template = __vue_template__ }
	if (false) {(function () {  module.hot.accept()
	  var hotAPI = require("vue-hot-reload-api")
	  hotAPI.install(require("vue"), true)
	  if (!hotAPI.compatible) return
	  var id = "E:\\nodejs\\vue-school\\src\\components\\sfooter.vue"
	  if (!module.hot.data) {
	    hotAPI.createRecord(id, module.exports)
	  } else {
	    hotAPI.update(id, module.exports, __vue_template__)
	  }
	})()}

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(25);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(13)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/vue-loader/lib/style-rewriter.js?id=_v-022af059&file=sfooter.vue&scoped=true!./../../node_modules/vue-loader/lib/selector.js?type=style&index=0!./sfooter.vue", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/vue-loader/lib/style-rewriter.js?id=_v-022af059&file=sfooter.vue&scoped=true!./../../node_modules/vue-loader/lib/selector.js?type=style&index=0!./sfooter.vue");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(12)();
	// imports


	// module
	exports.push([module.id, "\r\n\tfooter[_v-022af059]{\r\n\t\tposition: fixed;\r\n\t\theight: 50px;\r\n\t\tline-height: 50px;\r\n\t\tbottom: 0;\r\n\t\tleft: 0;\r\n\t\tright: 0;\r\n\t\tbackground: #FFF;\r\n\t\t/*opacity: 0.5;*/\r\n\t\ttext-align: center;\r\n\t\tcolor: #FFF;\r\n\t\tborder-top: 1px solid #DDD;\r\n\t\tz-index: 10;\r\n\t}\r\n\tfooter div[_v-022af059]{\r\n\t\twidth: 25%;\r\n\t\tfloat: left;\r\n\t\tborder: none;\r\n\t\tdisplay: inline-block;\r\n\t\theight: 50px;\r\n\t\tline-height: 50px;\r\n\t\ttext-align: center;\r\n\t\tcursor: pointer;\r\n\t}\r\n\t.home[_v-022af059]{\r\n\t\tbackground: url(" + __webpack_require__(26) + ") center center no-repeat; \r\n\t\t-webkit-filter:grayscale(1);\r\n\t}\r\n\t.clame[_v-022af059]{\r\n\t\tbackground: url(" + __webpack_require__(27) + ") center center no-repeat;\r\n\t\t-webkit-filter:grayscale(1);\r\n\t}\r\n\t.message[_v-022af059]{\r\n\t\tbackground: url(" + __webpack_require__(28) + ") center center no-repeat;\r\n\t\t-webkit-filter:grayscale(1);\r\n\t}\r\n\t.line[_v-022af059]{\r\n\t\tbackground: url(" + __webpack_require__(29) + ") center center no-repeat;\r\n\t\t-webkit-filter:grayscale(1);\r\n\t}\r\n\t.v-link-active[_v-022af059]{\r\n\t\t-webkit-filter:grayscale(0);\r\n\t}\r\n", ""]);

	// exports


/***/ },
/* 26 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,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"

/***/ },
/* 27 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEEAAABBCAYAAACO98lFAAAIcElEQVR4nO1a22scVRj/nTO7SXbbbRpL6wVtqogoeEdRiz5KQVQUBJWCf4Pvgn9DfRZBEAT1QX2qNlZ8qNUKYqu0qWms1vSWi9ndZDezl5lz/M5lLrs7tcnsZBNwv3Y3M2fOnDnf77t/s0wS4X9OfKs3sB1oCAKGIGgagoAhCJqGIGAIgqYhCNgiEG6Wncl1zFnvWuuhbawJg0tk+wNB9hysi1jCMmlZ7l4r1RqpaweZtIOAnTi2Ina8HswTF95USq8JLI5d/LibAd41jz7brGbL9b+E1P8M8+wmMrTMq0mSxY4RHXcNdFzqOMmO0ptDIiWZgxry6UNmwZ2OWcGD1eyQL2kBZRw9pvFfCtcHZaAJ6NprktuzTJH0fcZQp5Gf5lzMV13sHHHw1N3j2JMH8iE0g/UJGWuCoV6tNSMejazR36/PLeLIt8u4sgqM5yXeeLyIt57bj30kkjz5GrUjxgYHRF8hMim0CRox3qFznkefqidxetnDhycXcWElhwor4XKriM/OuDg2S5rRkmgjchfh/VpOIuFp2VBfmnAzP6WukzdAhfZ/bqGJ49MVfH9hDdNlhpocpWtcbQAjxPqBHU0cPLADhx4q4dE7d2KfMg+6FmmEAHrgzYYyNAdpUWH6v1rWIwaWCYWvz5fx8Q+LOL3A0eAFmpbTvkGrvbqDTIBLDyOigckdPl5+eBcOP70XdxUc8hPQzlLNMSrCtk90iNxXcCSi+E8MKikvkg28/1MFn528ioVWAS4fg2CODYJmbic/goDwMM7W8Ow9Rbzz4m2YLOZJU9Q80QlChv4z29qBmbguaHdl2vPnZ8r44Pgc2f0uuA5pAEUIZj1JsmJztHkeS7KEqZk1vHf0b1xai+WcLEi2oju2vICK2ImIEaM+jZ2+1sAnp+axwkvweL5n3o3XVGGUE2g7MTXr4ZvpMurxJDPIVFl2bjIDTejciqDTMnn5qd+Wcb6cR1trwMb0VgHZJr+x7I/h2C8LuFhpah9iHsfDx2blJvsEIVDUCAiVC1yquPj5jwo5wTF6QrpHMG6AOHe9jrNLDR06e8JRRqqQGgSGZEkIUtcrjTbmll2dJQokTLrZpmyhIOj+VVnAr3NMh9pwoahUyYQyModIJIrpi0sMDWmSYBPnN7ZbIY1JKM1vOyO4cK1mQbjhY/uizDtLal/XyqTKbIScGTMebaNRWEa1aZsC5PVyPW3/Zl2UHoRwM4GkzYAKj/OVBiVKeR0yeRqdDZdT2YGD5VVX+5owR8g4WeqjqRK/PdJNZQ7zlTXy5jl9XWnDRouhYL4GkBxkg2xBuRg/vgzLTiUyNAfTFVBbU+qrNSElhb0VwCZfHAtUgPgIoJaZmkUGILAwdqtEp0axrNb0acOOrh9YColJq1nqfvUxILgmTAYtpu0QHTpYY1G5fLUqdd2g5zBj1UGTjMvu1mQU8ANHaJezRZOtTsgkLpdX9PoyKNK2Q3QIqoT4btQm58l4A7bDJE/27rhbiCz2V0q7go0sShOul2t6/XCW1oRsegwpQYgzZVUXBoSllTW9acbibdJeYhIxDWFgtknLwqWtc+Rcr7dEESL0CbL3+f1QShACg7RpszRNUWWzl5dVTOeRKoeskmGQ5KS1B6E0mhlt0uOIxlXKrO8P13BQbjtY1arQ3Vzp3zn0kSfY3NVKRUlrhUR1YclFi3L+qE0R32S8r8xi551MBA5RH9PHo3C74I6RXzDPQXzt7l5cCurDMTItcVX2tmkfVTo/9beL6SXTE5A3Wl5GHYVgjTgQuoHUMU7P4DlcqjKcmKlggYBuceNutUFlECH6aq8pxVS1/txqE0dnG/j0xzIurubQVL0gZvMGa/u6M2QTAKmBkJoRFUKdji4J16W3uk+Zhi7ByFE6zMc+VseLj+zF60+M4t5dY5jIsUwiZSoQgjuULZ9ZauPI0Vl895eHWm43Sa1omQjaKEHrzbhP01O0sYWZsBnkBVqstnhSE4Wda0KNQM5voeDXcV+pgbcPTeKF+3crw7NApIcilTkYL262/tfiGs5ea6HGd+r6XwhydELqMCelbz8i5vaViE1o4zoEGklLO6bf0UDdQ15QeHpcy8mX8KR6bzGGP6hAm7lahS+yyZnSvYGKhINH9u/G8w8U8OX5NhZbKgL4YbRgKt4b0RvVt/aujo2xmLpChJrggWvJexoYdV0o8whDqcBE3sPBSY6D9+5BTucJvO+ea/pus+2XN+mrSudTZ2uYvfKPlpZiWvsBbRLMenjAJcwb1pnGg0tQKzjE5DhlG3npa9aY8SQ2bWBQbzLv3FPCoccnsIfmFxE3uYGDYNWYhS4vVtwEm4p1hum0RV9Tsyv46tR5NNkowqY7Y2EqXRQu3n3zGUw4Rosia2Vhvq1WduwVMwehE05LKV/Iqk05HZtykubEqE7nR744h4tuCZ5TsJkvMy5BQUiymBBNHL68iqcnS6TqLCg+EtczQ71PTUPZvJW+IQVMCP2gA5P78ftMHXVyouYdhMkOpVAm0ERhtIDJ20tWjzgG9U52QD/ckvot0iuPjeOeYgNFCnM50QYXpAEU9kZ8F7eIMl49eCsmRkzeMCD+NW3Kq/lektpvrNDX8ZkqPjpxFdMro6g1OUYp4ZksuHjp4Vvw2pP7cEeBbbZ69tCAQDA+Xsm3Tso3S+Hk5z+rundYHB3Bg3ftwoO35SgykH2yfgPexmlAIASxwwQ+dRb2HGBSYw7bU8z6pcI6aGDm0PH6yHr9SOab99uD9dCAHGPUhwxOe65ryrBntgEasA/q5D7sN3b8GiV57mbSgMyhkwbv+v6bts0PvLfGEAwNDIQ4gyw+KKMxhq0BYmA+IVH9k8qBzd5IAm0bc9hKGoKAIQiahiBgCIKmIQgYgqDpX7ZS2uaXdJX5AAAAAElFTkSuQmCC"

/***/ },
/* 28 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,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"

/***/ },
/* 29 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,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"

/***/ },
/* 30 */
/***/ function(module, exports) {

	// <template>
	// 	<footer>
	// 		<div v-link="{ path: '/app/home' }" class="home"></div>
	// 		<div v-link="{ path: '/app/message' }" class="message"></div>
	// 		<div v-link="{ path: '/app/clame' }" class="clame"></div>
	// 		<div v-link="{ path: '/app/line' }" class="line"></div>
	// 	</footer>
	// </template>
	//
	// <script>


	// </script>
	//
	// <style scoped>
	// 	footer{
	// 		position: fixed;
	// 		height: 50px;
	// 		line-height: 50px;
	// 		bottom: 0;
	// 		left: 0;
	// 		right: 0;
	// 		background: #FFF;
	// 		/*opacity: 0.5;*/
	// 		text-align: center;
	// 		color: #FFF;
	// 		border-top: 1px solid #DDD;
	// 		z-index: 10;
	// 	}
	// 	footer div{
	// 		width: 25%;
	// 		float: left;
	// 		border: none;
	// 		display: inline-block;
	// 		height: 50px;
	// 		line-height: 50px;
	// 		text-align: center;
	// 		cursor: pointer;
	// 	}
	// 	.home{
	// 		background: url(../assets/home.png) center center no-repeat; 
	// 		-webkit-filter:grayscale(1);
	// 	}
	// 	.clame{
	// 		background: url(../assets/clame.png) center center no-repeat;
	// 		-webkit-filter:grayscale(1);
	// 	}
	// 	.message{
	// 		background: url(../assets/message.png) center center no-repeat;
	// 		-webkit-filter:grayscale(1);
	// 	}
	// 	.line{
	// 		background: url(../assets/line.png) center center no-repeat;
	// 		-webkit-filter:grayscale(1);
	// 	}
	// 	.v-link-active{
	// 		-webkit-filter:grayscale(0);
	// 	}
	// </style>
	"use strict";

/***/ },
/* 31 */
/***/ function(module, exports) {

	module.exports = "\n\t<footer _v-022af059=\"\">\n\t\t<div v-link=\"{ path: '/app/home' }\" class=\"home\" _v-022af059=\"\"></div>\n\t\t<div v-link=\"{ path: '/app/message' }\" class=\"message\" _v-022af059=\"\"></div>\n\t\t<div v-link=\"{ path: '/app/clame' }\" class=\"clame\" _v-022af059=\"\"></div>\n\t\t<div v-link=\"{ path: '/app/line' }\" class=\"line\" _v-022af059=\"\"></div>\n\t</footer>\n";

/***/ },
/* 32 */,
/* 33 */,
/* 34 */,
/* 35 */,
/* 36 */,
/* 37 */,
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_script__, __vue_template__
	__webpack_require__(39)
	__vue_script__ = __webpack_require__(41)
	__vue_template__ = __webpack_require__(42)
	module.exports = __vue_script__ || {}
	if (module.exports.__esModule) module.exports = module.exports.default
	if (__vue_template__) { (typeof module.exports === "function" ? module.exports.options : module.exports).template = __vue_template__ }
	if (false) {(function () {  module.hot.accept()
	  var hotAPI = require("vue-hot-reload-api")
	  hotAPI.install(require("vue"), true)
	  if (!hotAPI.compatible) return
	  var id = "E:\\nodejs\\vue-school\\src\\message.vue"
	  if (!module.hot.data) {
	    hotAPI.createRecord(id, module.exports)
	  } else {
	    hotAPI.update(id, module.exports, __vue_template__)
	  }
	})()}

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(40);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(13)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../node_modules/css-loader/index.js!./../node_modules/vue-loader/lib/style-rewriter.js?id=_v-60c7dff4&file=message.vue&scoped=true!./../node_modules/vue-loader/lib/selector.js?type=style&index=0!./message.vue", function() {
				var newContent = require("!!./../node_modules/css-loader/index.js!./../node_modules/vue-loader/lib/style-rewriter.js?id=_v-60c7dff4&file=message.vue&scoped=true!./../node_modules/vue-loader/lib/selector.js?type=style&index=0!./message.vue");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(12)();
	// imports


	// module
	exports.push([module.id, "\r\n\r\n", ""]);

	// exports


/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _store = __webpack_require__(15);

	var _store2 = _interopRequireDefault(_store);

	var _actions = __webpack_require__(17);

	var _sheader = __webpack_require__(18);

	var _sheader2 = _interopRequireDefault(_sheader);

	var _sfooter = __webpack_require__(23);

	var _sfooter2 = _interopRequireDefault(_sfooter);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// <template>
	// 	<div>
	// 		<p>1222223</p>
	// 	</div>
	// </template>
	//
	// <script>
	exports.default = {
		store: _store2.default,
		data: function data() {
			return {};
		},

		methods: {},
		vuex: {
			actions: {
				modifyTitle: _actions.modifyTitle
			}
		},
		route: {
			data: function data(transient) {
				this.modifyTitle('message');
			}
		}
	};
	// </script>
	//
	// <style scoped>
	//
	// </style>

/***/ },
/* 42 */
/***/ function(module, exports) {

	module.exports = "\n\t<div _v-60c7dff4=\"\">\n\t\t<p _v-60c7dff4=\"\">1222223</p>\n\t</div>\n";

/***/ }
]);