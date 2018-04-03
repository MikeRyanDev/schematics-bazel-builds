var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@ngrx/schematics/src/store/index", ["require", "exports", "@angular-devkit/core", "@angular-devkit/schematics", "typescript", "@ngrx/schematics/src/utility/strings", "@ngrx/schematics/src/utility/ast-utils", "@ngrx/schematics/src/utility/change", "@ngrx/schematics/src/utility/find-module", "@ngrx/schematics/src/utility/route-utils"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular-devkit/core");
    var schematics_1 = require("@angular-devkit/schematics");
    var ts = require("typescript");
    var stringUtils = require("@ngrx/schematics/src/utility/strings");
    var ast_utils_1 = require("@ngrx/schematics/src/utility/ast-utils");
    var change_1 = require("@ngrx/schematics/src/utility/change");
    var find_module_1 = require("@ngrx/schematics/src/utility/find-module");
    var route_utils_1 = require("@ngrx/schematics/src/utility/route-utils");
    exports.StoreOptions = require('./schema.json');
    function addImportToNgModule(options) {
        return function (host) {
            var modulePath = options.module;
            if (!modulePath) {
                return host;
            }
            if (!host.exists(modulePath)) {
                throw new Error('Specified module does not exist');
            }
            var text = host.read(modulePath);
            if (text === null) {
                throw new schematics_1.SchematicsException("File " + modulePath + " does not exist.");
            }
            var sourceText = text.toString('utf-8');
            var source = ts.createSourceFile(modulePath, sourceText, ts.ScriptTarget.Latest, true);
            var statePath = "/" + options.sourceDir + "/" + options.path + "/" + options.statePath;
            var relativePath = find_module_1.buildRelativePath(modulePath, statePath);
            var environmentsPath = find_module_1.buildRelativePath(statePath, "/" + options.sourceDir + "/environments/environment");
            var storeNgModuleImport = ast_utils_1.addImportToModule(source, modulePath, options.root
                ? "StoreModule.forRoot(reducers, { metaReducers })"
                : "StoreModule.forFeature('" + stringUtils.camelize(options.name) + "', from" + stringUtils.classify(options.name) + ".reducers, { metaReducers: from" + stringUtils.classify(options.name) + ".metaReducers })", relativePath).shift();
            var commonImports = [
                route_utils_1.insertImport(source, modulePath, 'StoreModule', '@ngrx/store'),
                options.root
                    ? route_utils_1.insertImport(source, modulePath, 'reducers, metaReducers', relativePath)
                    : route_utils_1.insertImport(source, modulePath, "* as from" + stringUtils.classify(options.name), relativePath, true),
                storeNgModuleImport,
            ];
            var rootImports = [];
            if (options.root) {
                var storeDevtoolsNgModuleImport = ast_utils_1.addImportToModule(source, modulePath, "!environment.production ? StoreDevtoolsModule.instrument() : []", relativePath).shift();
                rootImports = rootImports.concat([
                    route_utils_1.insertImport(source, modulePath, 'StoreDevtoolsModule', '@ngrx/store-devtools'),
                    route_utils_1.insertImport(source, modulePath, 'environment', environmentsPath),
                    storeDevtoolsNgModuleImport,
                ]);
            }
            var changes = __spread(commonImports, rootImports);
            var recorder = host.beginUpdate(modulePath);
            try {
                for (var changes_1 = __values(changes), changes_1_1 = changes_1.next(); !changes_1_1.done; changes_1_1 = changes_1.next()) {
                    var change = changes_1_1.value;
                    if (change instanceof change_1.InsertChange) {
                        recorder.insertLeft(change.pos, change.toAdd);
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (changes_1_1 && !changes_1_1.done && (_a = changes_1.return)) _a.call(changes_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            host.commitUpdate(recorder);
            return host;
            var e_1, _a;
        };
    }
    function default_1(options) {
        options.path = options.path ? core_1.normalize(options.path) : options.path;
        var sourceDir = options.sourceDir;
        var statePath = "/" + options.sourceDir + "/" + options.path + "/" + options.statePath + "/index.ts";
        var environmentsPath = find_module_1.buildRelativePath(statePath, "/" + options.sourceDir + "/environments/environment");
        if (!sourceDir) {
            throw new schematics_1.SchematicsException("sourceDir option is required.");
        }
        return function (host, context) {
            if (options.module) {
                options.module = find_module_1.findModuleFromOptions(host, options);
            }
            if (options.root &&
                options.stateInterface &&
                options.stateInterface !== 'State') {
                options.stateInterface = stringUtils.classify(options.stateInterface);
            }
            var templateSource = schematics_1.apply(schematics_1.url('./files'), [
                schematics_1.template(__assign({}, stringUtils, options, { environmentsPath: environmentsPath })),
                schematics_1.move(sourceDir),
            ]);
            return schematics_1.chain([
                schematics_1.branchAndMerge(schematics_1.chain([
                    schematics_1.filter(function (path) {
                        return path.endsWith('.module.ts') &&
                            !path.endsWith('-routing.module.ts');
                    }),
                    addImportToNgModule(options),
                    schematics_1.mergeWith(templateSource),
                ])),
            ])(host, context);
        };
    }
    exports.default = default_1;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL3NjaGVtYXRpY3Mvc3JjL3N0b3JlL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFBQSw2Q0FBaUQ7SUFDakQseURBYW9DO0lBQ3BDLCtCQUFpQztJQUNqQyxrRUFBa0Q7SUFDbEQsb0VBQXlEO0lBQ3pELDhEQUF5RDtJQUN6RCx3RUFHZ0M7SUFDaEMsd0VBQXNEO0lBRXpDLFFBQUEsWUFBWSxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztJQTBCckQsNkJBQTZCLE9BQXFCO1FBQ2hELE1BQU0sQ0FBQyxVQUFDLElBQVU7WUFDaEIsSUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQztZQUVsQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hCLE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFDZCxDQUFDO1lBRUQsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDN0IsTUFBTSxJQUFJLEtBQUssQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDO1lBQ3JELENBQUM7WUFFRCxJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ25DLEVBQUUsQ0FBQyxDQUFDLElBQUksS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNsQixNQUFNLElBQUksZ0NBQW1CLENBQUMsVUFBUSxVQUFVLHFCQUFrQixDQUFDLENBQUM7WUFDdEUsQ0FBQztZQUNELElBQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7WUFFMUMsSUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDLGdCQUFnQixDQUNoQyxVQUFVLEVBQ1YsVUFBVSxFQUNWLEVBQUUsQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUN0QixJQUFJLENBQ0wsQ0FBQztZQUVGLElBQU0sU0FBUyxHQUFHLE1BQUksT0FBTyxDQUFDLFNBQVMsU0FBSSxPQUFPLENBQUMsSUFBSSxTQUNyRCxPQUFPLENBQUMsU0FDUixDQUFDO1lBQ0gsSUFBTSxZQUFZLEdBQUcsK0JBQWlCLENBQUMsVUFBVSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBQzlELElBQU0sZ0JBQWdCLEdBQUcsK0JBQWlCLENBQ3hDLFNBQVMsRUFDVCxNQUFJLE9BQU8sQ0FBQyxTQUFTLDhCQUEyQixDQUNqRCxDQUFDO1lBRUYsSUFBTSxtQkFBbUIsR0FBRyw2QkFBaUIsQ0FDM0MsTUFBTSxFQUNOLFVBQVUsRUFDVixPQUFPLENBQUMsSUFBSTtnQkFDVixDQUFDLENBQUMsaURBQWlEO2dCQUNuRCxDQUFDLENBQUMsNkJBQTJCLFdBQVcsQ0FBQyxRQUFRLENBQzdDLE9BQU8sQ0FBQyxJQUFJLENBQ2IsZUFBVSxXQUFXLENBQUMsUUFBUSxDQUM3QixPQUFPLENBQUMsSUFBSSxDQUNiLHVDQUFrQyxXQUFXLENBQUMsUUFBUSxDQUNyRCxPQUFPLENBQUMsSUFBSSxDQUNiLHFCQUFrQixFQUN2QixZQUFZLENBQ2IsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUVWLElBQUksYUFBYSxHQUFHO2dCQUNsQiwwQkFBWSxDQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsYUFBYSxFQUFFLGFBQWEsQ0FBQztnQkFDOUQsT0FBTyxDQUFDLElBQUk7b0JBQ1YsQ0FBQyxDQUFDLDBCQUFZLENBQ1YsTUFBTSxFQUNOLFVBQVUsRUFDVix3QkFBd0IsRUFDeEIsWUFBWSxDQUNiO29CQUNILENBQUMsQ0FBQywwQkFBWSxDQUNWLE1BQU0sRUFDTixVQUFVLEVBQ1YsY0FBWSxXQUFXLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUcsRUFDaEQsWUFBWSxFQUNaLElBQUksQ0FDTDtnQkFDTCxtQkFBbUI7YUFDcEIsQ0FBQztZQUNGLElBQUksV0FBVyxHQUEyQixFQUFFLENBQUM7WUFFN0MsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ2pCLElBQU0sMkJBQTJCLEdBQUcsNkJBQWlCLENBQ25ELE1BQU0sRUFDTixVQUFVLEVBQ1YsaUVBQWlFLEVBQ2pFLFlBQVksQ0FDYixDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUVWLFdBQVcsR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDO29CQUMvQiwwQkFBWSxDQUNWLE1BQU0sRUFDTixVQUFVLEVBQ1YscUJBQXFCLEVBQ3JCLHNCQUFzQixDQUN2QjtvQkFDRCwwQkFBWSxDQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsYUFBYSxFQUFFLGdCQUFnQixDQUFDO29CQUNqRSwyQkFBMkI7aUJBQzVCLENBQUMsQ0FBQztZQUNMLENBQUM7WUFFRCxJQUFNLE9BQU8sWUFBTyxhQUFhLEVBQUssV0FBVyxDQUFDLENBQUM7WUFDbkQsSUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQzs7Z0JBQzlDLEdBQUcsQ0FBQyxDQUFpQixJQUFBLFlBQUEsU0FBQSxPQUFPLENBQUEsZ0NBQUE7b0JBQXZCLElBQU0sTUFBTSxvQkFBQTtvQkFDZixFQUFFLENBQUMsQ0FBQyxNQUFNLFlBQVkscUJBQVksQ0FBQyxDQUFDLENBQUM7d0JBQ25DLFFBQVEsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQ2hELENBQUM7aUJBQ0Y7Ozs7Ozs7OztZQUNELElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUM7WUFFNUIsTUFBTSxDQUFDLElBQUksQ0FBQzs7UUFDZCxDQUFDLENBQUM7SUFDSixDQUFDO0lBRUQsbUJBQXdCLE9BQXFCO1FBQzNDLE9BQU8sQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsZ0JBQVMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7UUFDckUsSUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQztRQUNwQyxJQUFNLFNBQVMsR0FBRyxNQUFJLE9BQU8sQ0FBQyxTQUFTLFNBQUksT0FBTyxDQUFDLElBQUksU0FDckQsT0FBTyxDQUFDLFNBQVMsY0FDUixDQUFDO1FBQ1osSUFBTSxnQkFBZ0IsR0FBRywrQkFBaUIsQ0FDeEMsU0FBUyxFQUNULE1BQUksT0FBTyxDQUFDLFNBQVMsOEJBQTJCLENBQ2pELENBQUM7UUFDRixFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDZixNQUFNLElBQUksZ0NBQW1CLENBQUMsK0JBQStCLENBQUMsQ0FBQztRQUNqRSxDQUFDO1FBRUQsTUFBTSxDQUFDLFVBQUMsSUFBVSxFQUFFLE9BQXlCO1lBQzNDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNuQixPQUFPLENBQUMsTUFBTSxHQUFHLG1DQUFxQixDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztZQUN4RCxDQUFDO1lBRUQsRUFBRSxDQUFDLENBQ0QsT0FBTyxDQUFDLElBQUk7Z0JBQ1osT0FBTyxDQUFDLGNBQWM7Z0JBQ3RCLE9BQU8sQ0FBQyxjQUFjLEtBQUssT0FDN0IsQ0FBQyxDQUFDLENBQUM7Z0JBQ0QsT0FBTyxDQUFDLGNBQWMsR0FBRyxXQUFXLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQztZQUN4RSxDQUFDO1lBRUQsSUFBTSxjQUFjLEdBQUcsa0JBQUssQ0FBQyxnQkFBRyxDQUFDLFNBQVMsQ0FBQyxFQUFFO2dCQUMzQyxxQkFBUSxDQUFDLGFBQ0osV0FBVyxFQUNWLE9BQWtCLElBQ3RCLGdCQUFnQixrQkFBQSxHQUNWLENBQUM7Z0JBQ1QsaUJBQUksQ0FBQyxTQUFTLENBQUM7YUFDaEIsQ0FBQyxDQUFDO1lBRUgsTUFBTSxDQUFDLGtCQUFLLENBQUM7Z0JBQ1gsMkJBQWMsQ0FDWixrQkFBSyxDQUFDO29CQUNKLG1CQUFNLENBQ0osVUFBQSxJQUFJO3dCQUNGLE9BQUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUM7NEJBQzNCLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxvQkFBb0IsQ0FBQztvQkFEcEMsQ0FDb0MsQ0FDdkM7b0JBQ0QsbUJBQW1CLENBQUMsT0FBTyxDQUFDO29CQUM1QixzQkFBUyxDQUFDLGNBQWMsQ0FBQztpQkFDMUIsQ0FBQyxDQUNIO2FBQ0YsQ0FBQyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNwQixDQUFDLENBQUM7SUFDSixDQUFDO0lBbERELDRCQWtEQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IG5vcm1hbGl6ZSB9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9jb3JlJztcbmltcG9ydCB7XG4gIFJ1bGUsXG4gIFNjaGVtYXRpY0NvbnRleHQsXG4gIFNjaGVtYXRpY3NFeGNlcHRpb24sXG4gIFRyZWUsXG4gIGFwcGx5LFxuICBicmFuY2hBbmRNZXJnZSxcbiAgY2hhaW4sXG4gIGZpbHRlcixcbiAgbWVyZ2VXaXRoLFxuICBtb3ZlLFxuICB0ZW1wbGF0ZSxcbiAgdXJsLFxufSBmcm9tICdAYW5ndWxhci1kZXZraXQvc2NoZW1hdGljcyc7XG5pbXBvcnQgKiBhcyB0cyBmcm9tICd0eXBlc2NyaXB0JztcbmltcG9ydCAqIGFzIHN0cmluZ1V0aWxzIGZyb20gJy4uL3V0aWxpdHkvc3RyaW5ncyc7XG5pbXBvcnQgeyBhZGRJbXBvcnRUb01vZHVsZSB9IGZyb20gJy4uL3V0aWxpdHkvYXN0LXV0aWxzJztcbmltcG9ydCB7IEluc2VydENoYW5nZSwgQ2hhbmdlIH0gZnJvbSAnLi4vdXRpbGl0eS9jaGFuZ2UnO1xuaW1wb3J0IHtcbiAgYnVpbGRSZWxhdGl2ZVBhdGgsXG4gIGZpbmRNb2R1bGVGcm9tT3B0aW9ucyxcbn0gZnJvbSAnLi4vdXRpbGl0eS9maW5kLW1vZHVsZSc7XG5pbXBvcnQgeyBpbnNlcnRJbXBvcnQgfSBmcm9tICcuLi91dGlsaXR5L3JvdXRlLXV0aWxzJztcblxuZXhwb3J0IGNvbnN0IFN0b3JlT3B0aW9ucyA9IHJlcXVpcmUoJy4vc2NoZW1hLmpzb24nKTtcbmV4cG9ydCB0eXBlIFN0b3JlT3B0aW9ucyA9IHtcbiAgbmFtZTogc3RyaW5nO1xuICBwYXRoPzogc3RyaW5nO1xuICBhcHBSb290Pzogc3RyaW5nO1xuICBzb3VyY2VEaXI/OiBzdHJpbmc7XG4gIC8qKlxuICAgKiBGbGFnIHRvIGluZGljYXRlIGlmIGEgZGlyIGlzIGNyZWF0ZWQuXG4gICAqL1xuICBmbGF0PzogYm9vbGVhbjtcbiAgLyoqXG4gICAqIFNwZWNpZmllcyBpZiBhIHNwZWMgZmlsZSBpcyBnZW5lcmF0ZWQuXG4gICAqL1xuICBzcGVjPzogYm9vbGVhbjtcbiAgLyoqXG4gICAqIEFsbG93cyBzcGVjaWZpY2F0aW9uIG9mIHRoZSBkZWNsYXJpbmcgbW9kdWxlLlxuICAgKi9cbiAgbW9kdWxlPzogc3RyaW5nO1xuICBzdGF0ZVBhdGg/OiBzdHJpbmc7XG4gIHJvb3Q/OiBib29sZWFuO1xuICAvKipcbiAgICogU3BlY2lmaWVzIHRoZSBpbnRlcmZhY2UgZm9yIHRoZSBzdGF0ZVxuICAgKi9cbiAgc3RhdGVJbnRlcmZhY2U/OiBzdHJpbmc7XG59O1xuXG5mdW5jdGlvbiBhZGRJbXBvcnRUb05nTW9kdWxlKG9wdGlvbnM6IFN0b3JlT3B0aW9ucyk6IFJ1bGUge1xuICByZXR1cm4gKGhvc3Q6IFRyZWUpID0+IHtcbiAgICBjb25zdCBtb2R1bGVQYXRoID0gb3B0aW9ucy5tb2R1bGU7XG5cbiAgICBpZiAoIW1vZHVsZVBhdGgpIHtcbiAgICAgIHJldHVybiBob3N0O1xuICAgIH1cblxuICAgIGlmICghaG9zdC5leGlzdHMobW9kdWxlUGF0aCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignU3BlY2lmaWVkIG1vZHVsZSBkb2VzIG5vdCBleGlzdCcpO1xuICAgIH1cblxuICAgIGNvbnN0IHRleHQgPSBob3N0LnJlYWQobW9kdWxlUGF0aCk7XG4gICAgaWYgKHRleHQgPT09IG51bGwpIHtcbiAgICAgIHRocm93IG5ldyBTY2hlbWF0aWNzRXhjZXB0aW9uKGBGaWxlICR7bW9kdWxlUGF0aH0gZG9lcyBub3QgZXhpc3QuYCk7XG4gICAgfVxuICAgIGNvbnN0IHNvdXJjZVRleHQgPSB0ZXh0LnRvU3RyaW5nKCd1dGYtOCcpO1xuXG4gICAgY29uc3Qgc291cmNlID0gdHMuY3JlYXRlU291cmNlRmlsZShcbiAgICAgIG1vZHVsZVBhdGgsXG4gICAgICBzb3VyY2VUZXh0LFxuICAgICAgdHMuU2NyaXB0VGFyZ2V0LkxhdGVzdCxcbiAgICAgIHRydWVcbiAgICApO1xuXG4gICAgY29uc3Qgc3RhdGVQYXRoID0gYC8ke29wdGlvbnMuc291cmNlRGlyfS8ke29wdGlvbnMucGF0aH0vJHtcbiAgICAgIG9wdGlvbnMuc3RhdGVQYXRoXG4gICAgfWA7XG4gICAgY29uc3QgcmVsYXRpdmVQYXRoID0gYnVpbGRSZWxhdGl2ZVBhdGgobW9kdWxlUGF0aCwgc3RhdGVQYXRoKTtcbiAgICBjb25zdCBlbnZpcm9ubWVudHNQYXRoID0gYnVpbGRSZWxhdGl2ZVBhdGgoXG4gICAgICBzdGF0ZVBhdGgsXG4gICAgICBgLyR7b3B0aW9ucy5zb3VyY2VEaXJ9L2Vudmlyb25tZW50cy9lbnZpcm9ubWVudGBcbiAgICApO1xuXG4gICAgY29uc3Qgc3RvcmVOZ01vZHVsZUltcG9ydCA9IGFkZEltcG9ydFRvTW9kdWxlKFxuICAgICAgc291cmNlLFxuICAgICAgbW9kdWxlUGF0aCxcbiAgICAgIG9wdGlvbnMucm9vdFxuICAgICAgICA/IGBTdG9yZU1vZHVsZS5mb3JSb290KHJlZHVjZXJzLCB7IG1ldGFSZWR1Y2VycyB9KWBcbiAgICAgICAgOiBgU3RvcmVNb2R1bGUuZm9yRmVhdHVyZSgnJHtzdHJpbmdVdGlscy5jYW1lbGl6ZShcbiAgICAgICAgICAgIG9wdGlvbnMubmFtZVxuICAgICAgICAgICl9JywgZnJvbSR7c3RyaW5nVXRpbHMuY2xhc3NpZnkoXG4gICAgICAgICAgICBvcHRpb25zLm5hbWVcbiAgICAgICAgICApfS5yZWR1Y2VycywgeyBtZXRhUmVkdWNlcnM6IGZyb20ke3N0cmluZ1V0aWxzLmNsYXNzaWZ5KFxuICAgICAgICAgICAgb3B0aW9ucy5uYW1lXG4gICAgICAgICAgKX0ubWV0YVJlZHVjZXJzIH0pYCxcbiAgICAgIHJlbGF0aXZlUGF0aFxuICAgICkuc2hpZnQoKTtcblxuICAgIGxldCBjb21tb25JbXBvcnRzID0gW1xuICAgICAgaW5zZXJ0SW1wb3J0KHNvdXJjZSwgbW9kdWxlUGF0aCwgJ1N0b3JlTW9kdWxlJywgJ0BuZ3J4L3N0b3JlJyksXG4gICAgICBvcHRpb25zLnJvb3RcbiAgICAgICAgPyBpbnNlcnRJbXBvcnQoXG4gICAgICAgICAgICBzb3VyY2UsXG4gICAgICAgICAgICBtb2R1bGVQYXRoLFxuICAgICAgICAgICAgJ3JlZHVjZXJzLCBtZXRhUmVkdWNlcnMnLFxuICAgICAgICAgICAgcmVsYXRpdmVQYXRoXG4gICAgICAgICAgKVxuICAgICAgICA6IGluc2VydEltcG9ydChcbiAgICAgICAgICAgIHNvdXJjZSxcbiAgICAgICAgICAgIG1vZHVsZVBhdGgsXG4gICAgICAgICAgICBgKiBhcyBmcm9tJHtzdHJpbmdVdGlscy5jbGFzc2lmeShvcHRpb25zLm5hbWUpfWAsXG4gICAgICAgICAgICByZWxhdGl2ZVBhdGgsXG4gICAgICAgICAgICB0cnVlXG4gICAgICAgICAgKSxcbiAgICAgIHN0b3JlTmdNb2R1bGVJbXBvcnQsXG4gICAgXTtcbiAgICBsZXQgcm9vdEltcG9ydHM6IChDaGFuZ2UgfCB1bmRlZmluZWQpW10gPSBbXTtcblxuICAgIGlmIChvcHRpb25zLnJvb3QpIHtcbiAgICAgIGNvbnN0IHN0b3JlRGV2dG9vbHNOZ01vZHVsZUltcG9ydCA9IGFkZEltcG9ydFRvTW9kdWxlKFxuICAgICAgICBzb3VyY2UsXG4gICAgICAgIG1vZHVsZVBhdGgsXG4gICAgICAgIGAhZW52aXJvbm1lbnQucHJvZHVjdGlvbiA/IFN0b3JlRGV2dG9vbHNNb2R1bGUuaW5zdHJ1bWVudCgpIDogW11gLFxuICAgICAgICByZWxhdGl2ZVBhdGhcbiAgICAgICkuc2hpZnQoKTtcblxuICAgICAgcm9vdEltcG9ydHMgPSByb290SW1wb3J0cy5jb25jYXQoW1xuICAgICAgICBpbnNlcnRJbXBvcnQoXG4gICAgICAgICAgc291cmNlLFxuICAgICAgICAgIG1vZHVsZVBhdGgsXG4gICAgICAgICAgJ1N0b3JlRGV2dG9vbHNNb2R1bGUnLFxuICAgICAgICAgICdAbmdyeC9zdG9yZS1kZXZ0b29scydcbiAgICAgICAgKSxcbiAgICAgICAgaW5zZXJ0SW1wb3J0KHNvdXJjZSwgbW9kdWxlUGF0aCwgJ2Vudmlyb25tZW50JywgZW52aXJvbm1lbnRzUGF0aCksXG4gICAgICAgIHN0b3JlRGV2dG9vbHNOZ01vZHVsZUltcG9ydCxcbiAgICAgIF0pO1xuICAgIH1cblxuICAgIGNvbnN0IGNoYW5nZXMgPSBbLi4uY29tbW9uSW1wb3J0cywgLi4ucm9vdEltcG9ydHNdO1xuICAgIGNvbnN0IHJlY29yZGVyID0gaG9zdC5iZWdpblVwZGF0ZShtb2R1bGVQYXRoKTtcbiAgICBmb3IgKGNvbnN0IGNoYW5nZSBvZiBjaGFuZ2VzKSB7XG4gICAgICBpZiAoY2hhbmdlIGluc3RhbmNlb2YgSW5zZXJ0Q2hhbmdlKSB7XG4gICAgICAgIHJlY29yZGVyLmluc2VydExlZnQoY2hhbmdlLnBvcywgY2hhbmdlLnRvQWRkKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaG9zdC5jb21taXRVcGRhdGUocmVjb3JkZXIpO1xuXG4gICAgcmV0dXJuIGhvc3Q7XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG9wdGlvbnM6IFN0b3JlT3B0aW9ucyk6IFJ1bGUge1xuICBvcHRpb25zLnBhdGggPSBvcHRpb25zLnBhdGggPyBub3JtYWxpemUob3B0aW9ucy5wYXRoKSA6IG9wdGlvbnMucGF0aDtcbiAgY29uc3Qgc291cmNlRGlyID0gb3B0aW9ucy5zb3VyY2VEaXI7XG4gIGNvbnN0IHN0YXRlUGF0aCA9IGAvJHtvcHRpb25zLnNvdXJjZURpcn0vJHtvcHRpb25zLnBhdGh9LyR7XG4gICAgb3B0aW9ucy5zdGF0ZVBhdGhcbiAgfS9pbmRleC50c2A7XG4gIGNvbnN0IGVudmlyb25tZW50c1BhdGggPSBidWlsZFJlbGF0aXZlUGF0aChcbiAgICBzdGF0ZVBhdGgsXG4gICAgYC8ke29wdGlvbnMuc291cmNlRGlyfS9lbnZpcm9ubWVudHMvZW52aXJvbm1lbnRgXG4gICk7XG4gIGlmICghc291cmNlRGlyKSB7XG4gICAgdGhyb3cgbmV3IFNjaGVtYXRpY3NFeGNlcHRpb24oYHNvdXJjZURpciBvcHRpb24gaXMgcmVxdWlyZWQuYCk7XG4gIH1cblxuICByZXR1cm4gKGhvc3Q6IFRyZWUsIGNvbnRleHQ6IFNjaGVtYXRpY0NvbnRleHQpID0+IHtcbiAgICBpZiAob3B0aW9ucy5tb2R1bGUpIHtcbiAgICAgIG9wdGlvbnMubW9kdWxlID0gZmluZE1vZHVsZUZyb21PcHRpb25zKGhvc3QsIG9wdGlvbnMpO1xuICAgIH1cblxuICAgIGlmIChcbiAgICAgIG9wdGlvbnMucm9vdCAmJlxuICAgICAgb3B0aW9ucy5zdGF0ZUludGVyZmFjZSAmJlxuICAgICAgb3B0aW9ucy5zdGF0ZUludGVyZmFjZSAhPT0gJ1N0YXRlJ1xuICAgICkge1xuICAgICAgb3B0aW9ucy5zdGF0ZUludGVyZmFjZSA9IHN0cmluZ1V0aWxzLmNsYXNzaWZ5KG9wdGlvbnMuc3RhdGVJbnRlcmZhY2UpO1xuICAgIH1cblxuICAgIGNvbnN0IHRlbXBsYXRlU291cmNlID0gYXBwbHkodXJsKCcuL2ZpbGVzJyksIFtcbiAgICAgIHRlbXBsYXRlKHtcbiAgICAgICAgLi4uc3RyaW5nVXRpbHMsXG4gICAgICAgIC4uLihvcHRpb25zIGFzIG9iamVjdCksXG4gICAgICAgIGVudmlyb25tZW50c1BhdGgsXG4gICAgICB9IGFzIGFueSksXG4gICAgICBtb3ZlKHNvdXJjZURpciksXG4gICAgXSk7XG5cbiAgICByZXR1cm4gY2hhaW4oW1xuICAgICAgYnJhbmNoQW5kTWVyZ2UoXG4gICAgICAgIGNoYWluKFtcbiAgICAgICAgICBmaWx0ZXIoXG4gICAgICAgICAgICBwYXRoID0+XG4gICAgICAgICAgICAgIHBhdGguZW5kc1dpdGgoJy5tb2R1bGUudHMnKSAmJlxuICAgICAgICAgICAgICAhcGF0aC5lbmRzV2l0aCgnLXJvdXRpbmcubW9kdWxlLnRzJylcbiAgICAgICAgICApLFxuICAgICAgICAgIGFkZEltcG9ydFRvTmdNb2R1bGUob3B0aW9ucyksXG4gICAgICAgICAgbWVyZ2VXaXRoKHRlbXBsYXRlU291cmNlKSxcbiAgICAgICAgXSlcbiAgICAgICksXG4gICAgXSkoaG9zdCwgY29udGV4dCk7XG4gIH07XG59XG4iXX0=