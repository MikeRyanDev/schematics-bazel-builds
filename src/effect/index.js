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
        define("@ngrx/schematics/src/effect/index", ["require", "exports", "@angular-devkit/core", "@angular-devkit/schematics", "typescript", "@ngrx/schematics/src/utility/strings", "@ngrx/schematics/src/utility/ast-utils", "@ngrx/schematics/src/utility/change", "@ngrx/schematics/src/utility/find-module", "@ngrx/schematics/src/utility/route-utils"], factory);
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
    exports.EffectOptions = require('./schema.json');
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
            var effectsName = "" + stringUtils.classify(options.name + "Effects");
            var effectsModuleImport = route_utils_1.insertImport(source, modulePath, 'EffectsModule', '@ngrx/effects');
            var effectsPath = "/" + options.sourceDir + "/" + options.path + "/" +
                (options.flat ? '' : stringUtils.dasherize(options.name) + '/') +
                (options.group ? 'effects/' : '') +
                stringUtils.dasherize(options.name) +
                '.effects';
            var relativePath = find_module_1.buildRelativePath(modulePath, effectsPath);
            var effectsImport = route_utils_1.insertImport(source, modulePath, effectsName, relativePath);
            var _a = __read(ast_utils_1.addImportToModule(source, modulePath, "EffectsModule.for" + (options.root ? 'Root' : 'Feature') + "([" + effectsName + "])", relativePath), 1), effectsNgModuleImport = _a[0];
            var changes = [effectsModuleImport, effectsImport, effectsNgModuleImport];
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
                    if (changes_1_1 && !changes_1_1.done && (_b = changes_1.return)) _b.call(changes_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            host.commitUpdate(recorder);
            return host;
            var e_1, _b;
        };
    }
    function default_1(options) {
        options.path = options.path ? core_1.normalize(options.path) : options.path;
        var sourceDir = options.sourceDir;
        if (!sourceDir) {
            throw new schematics_1.SchematicsException("sourceDir option is required.");
        }
        return function (host, context) {
            if (options.module) {
                options.module = find_module_1.findModuleFromOptions(host, options);
            }
            var templateSource = schematics_1.apply(schematics_1.url('./files'), [
                options.spec ? schematics_1.noop() : schematics_1.filter(function (path) { return !path.endsWith('__spec.ts'); }),
                schematics_1.template(__assign({}, stringUtils, { 'if-flat': function (s) {
                        return stringUtils.group(options.flat ? '' : s, options.group ? 'effects' : '');
                    } }, options, { dot: function () { return '.'; } })),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL3NjaGVtYXRpY3Mvc3JjL2VmZmVjdC9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFBQSw2Q0FBaUQ7SUFDakQseURBY29DO0lBQ3BDLCtCQUFpQztJQUNqQyxrRUFBa0Q7SUFDbEQsb0VBQXlEO0lBQ3pELDhEQUFpRDtJQUNqRCx3RUFHZ0M7SUFDaEMsd0VBQXNEO0lBRXpDLFFBQUEsYUFBYSxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztJQXVCdEQsNkJBQTZCLE9BQXNCO1FBQ2pELE1BQU0sQ0FBQyxVQUFDLElBQVU7WUFDaEIsSUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQztZQUVsQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hCLE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFDZCxDQUFDO1lBRUQsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDN0IsTUFBTSxJQUFJLEtBQUssQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDO1lBQ3JELENBQUM7WUFFRCxJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ25DLEVBQUUsQ0FBQyxDQUFDLElBQUksS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNsQixNQUFNLElBQUksZ0NBQW1CLENBQUMsVUFBUSxVQUFVLHFCQUFrQixDQUFDLENBQUM7WUFDdEUsQ0FBQztZQUNELElBQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7WUFFMUMsSUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDLGdCQUFnQixD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O2dCQUNuRSxxQkFBUSxDQUFDLGFBQ0osV0FBVyxJQUNkLFNBQVMsRUFBRSxVQUFDLENBQVM7d0JBQ25CLE9BQUEsV0FBVyxDQUFDLEtBQUssQ0FDZixPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDckIsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQy9CO29CQUhELENBR0MsSUFDQyxPQUFrQixJQUN0QixHQUFHLEVBQUUsY0FBTSxPQUFBLEdBQUcsRUFBSCxDQUFHLEdBQ1IsQ0FBQztnQkFDVCxpQkFBSSxDQUFDLFNBQVMsQ0FBQzthQUNoQixDQUFDLENBQUM7WUFFSCxNQUFNLENBQUMsa0JBQUssQ0FBQztnQkFDWCwyQkFBYyxDQUNaLGtCQUFLLENBQUM7b0JBQ0osbUJBQU0sQ0FDSixVQUFBLElBQUk7d0JBQ0YsT0FBQSxJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQzs0QkFDM0IsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLG9CQUFvQixDQUFDO29CQURwQyxDQUNvQyxDQUN2QztvQkFDRCxtQkFBbUIsQ0FBQyxPQUFPLENBQUM7b0JBQzVCLHNCQUFTLENBQUMsY0FBYyxDQUFDO2lCQUMxQixDQUFDLENBQ0g7YUFDRixDQUFDLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ3BCLENBQUMsQ0FBQztJQUNKLENBQUM7SUF6Q0QsNEJBeUNDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgbm9ybWFsaXplIH0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L2NvcmUnO1xuaW1wb3J0IHtcbiAgUnVsZSxcbiAgU2NoZW1hdGljQ29udGV4dCxcbiAgU2NoZW1hdGljc0V4Y2VwdGlvbixcbiAgVHJlZSxcbiAgYXBwbHksXG4gIGJyYW5jaEFuZE1lcmdlLFxuICBjaGFpbixcbiAgZmlsdGVyLFxuICBtZXJnZVdpdGgsXG4gIG1vdmUsXG4gIG5vb3AsXG4gIHRlbXBsYXRlLFxuICB1cmwsXG59IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9zY2hlbWF0aWNzJztcbmltcG9ydCAqIGFzIHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xuaW1wb3J0ICogYXMgc3RyaW5nVXRpbHMgZnJvbSAnLi4vdXRpbGl0eS9zdHJpbmdzJztcbmltcG9ydCB7IGFkZEltcG9ydFRvTW9kdWxlIH0gZnJvbSAnLi4vdXRpbGl0eS9hc3QtdXRpbHMnO1xuaW1wb3J0IHsgSW5zZXJ0Q2hhbmdlIH0gZnJvbSAnLi4vdXRpbGl0eS9jaGFuZ2UnO1xuaW1wb3J0IHtcbiAgYnVpbGRSZWxhdGl2ZVBhdGgsXG4gIGZpbmRNb2R1bGVGcm9tT3B0aW9ucyxcbn0gZnJvbSAnLi4vdXRpbGl0eS9maW5kLW1vZHVsZSc7XG5pbXBvcnQgeyBpbnNlcnRJbXBvcnQgfSBmcm9tICcuLi91dGlsaXR5L3JvdXRlLXV0aWxzJztcblxuZXhwb3J0IGNvbnN0IEVmZmVjdE9wdGlvbnMgPSByZXF1aXJlKCcuL3NjaGVtYS5qc29uJyk7XG5leHBvcnQgdHlwZSBFZmZlY3RPcHRpb25zID0ge1xuICBuYW1lOiBzdHJpbmc7XG4gIHBhdGg/OiBzdHJpbmc7XG4gIGFwcFJvb3Q/OiBzdHJpbmc7XG4gIHNvdXJjZURpcj86IHN0cmluZztcbiAgLyoqXG4gICAqIEZsYWcgdG8gaW5kaWNhdGUgaWYgYSBkaXIgaXMgY3JlYXRlZC5cbiAgICovXG4gIGZsYXQ/OiBib29sZWFuO1xuICAvKipcbiAgICogU3BlY2lmaWVzIGlmIGEgc3BlYyBmaWxlIGlzIGdlbmVyYXRlZC5cbiAgICovXG4gIHNwZWM/OiBib29sZWFuO1xuICAvKipcbiAgICogQWxsb3dzIHNwZWNpZmljYXRpb24gb2YgdGhlIGRlY2xhcmluZyBtb2R1bGUuXG4gICAqL1xuICBtb2R1bGU/OiBzdHJpbmc7XG4gIHJvb3Q/OiBib29sZWFuO1xuICBmZWF0dXJlPzogYm9vbGVhbjtcbiAgZ3JvdXA/OiBib29sZWFuO1xufTtcblxuZnVuY3Rpb24gYWRkSW1wb3J0VG9OZ01vZHVsZShvcHRpb25zOiBFZmZlY3RPcHRpb25zKTogUnVsZSB7XG4gIHJldHVybiAoaG9zdDogVHJlZSkgPT4ge1xuICAgIGNvbnN0IG1vZHVsZVBhdGggPSBvcHRpb25zLm1vZHVsZTtcblxuICAgIGlmICghbW9kdWxlUGF0aCkge1xuICAgICAgcmV0dXJuIGhvc3Q7XG4gICAgfVxuXG4gICAgaWYgKCFob3N0LmV4aXN0cyhtb2R1bGVQYXRoKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdTcGVjaWZpZWQgbW9kdWxlIGRvZXMgbm90IGV4aXN0Jyk7XG4gICAgfVxuXG4gICAgY29uc3QgdGV4dCA9IGhvc3QucmVhZChtb2R1bGVQYXRoKTtcbiAgICBpZiAodGV4dCA9PT0gbnVsbCkge1xuICAgICAgdGhyb3cgbmV3IFNjaGVtYXRpY3NFeGNlcHRpb24oYEZpbGUgJHttb2R1bGVQYXRofSBkb2VzIG5vdCBleGlzdC5gKTtcbiAgICB9XG4gICAgY29uc3Qgc291cmNlVGV4dCA9IHRleHQudG9TdHJpbmcoJ3V0Zi04Jyk7XG5cbiAgICBjb25zdCBzb3VyY2UgPSB0cy5jcmVhdGVTb3VyY2VGaWxlKFxuICAgICAgbW9kdWxlUGF0aCxcbiAgICAgIHNvdXJjZVRleHQsXG4gICAgICB0cy5TY3JpcHRUYXJnZXQuTGF0ZXN0LFxuICAgICAgdHJ1ZVxuICAgICk7XG5cbiAgICBjb25zdCBlZmZlY3RzTmFtZSA9IGAke3N0cmluZ1V0aWxzLmNsYXNzaWZ5KGAke29wdGlvbnMubmFtZX1FZmZlY3RzYCl9YDtcblxuICAgIGNvbnN0IGVmZmVjdHNNb2R1bGVJbXBvcnQgPSBpbnNlcnRJbXBvcnQoXG4gICAgICBzb3VyY2UsXG4gICAgICBtb2R1bGVQYXRoLFxuICAgICAgJ0VmZmVjdHNNb2R1bGUnLFxuICAgICAgJ0BuZ3J4L2VmZmVjdHMnXG4gICAgKTtcblxuICAgIGNvbnN0IGVmZmVjdHNQYXRoID1cbiAgICAgIGAvJHtvcHRpb25zLnNvdXJjZURpcn0vJHtvcHRpb25zLnBhdGh9L2AgK1xuICAgICAgKG9wdGlvbnMuZmxhdCA/ICcnIDogc3RyaW5nVXRpbHMuZGFzaGVyaXplKG9wdGlvbnMubmFtZSkgKyAnLycpICtcbiAgICAgIChvcHRpb25zLmdyb3VwID8gJ2VmZmVjdHMvJyA6ICcnKSArXG4gICAgICBzdHJpbmdVdGlscy5kYXNoZXJpemUob3B0aW9ucy5uYW1lKSArXG4gICAgICAnLmVmZmVjdHMnO1xuICAgIGNvbnN0IHJlbGF0aXZlUGF0aCA9IGJ1aWxkUmVsYXRpdmVQYXRoKG1vZHVsZVBhdGgsIGVmZmVjdHNQYXRoKTtcbiAgICBjb25zdCBlZmZlY3RzSW1wb3J0ID0gaW5zZXJ0SW1wb3J0KFxuICAgICAgc291cmNlLFxuICAgICAgbW9kdWxlUGF0aCxcbiAgICAgIGVmZmVjdHNOYW1lLFxuICAgICAgcmVsYXRpdmVQYXRoXG4gICAgKTtcbiAgICBjb25zdCBbZWZmZWN0c05nTW9kdWxlSW1wb3J0XSA9IGFkZEltcG9ydFRvTW9kdWxlKFxuICAgICAgc291cmNlLFxuICAgICAgbW9kdWxlUGF0aCxcbiAgICAgIGBFZmZlY3RzTW9kdWxlLmZvciR7b3B0aW9ucy5yb290ID8gJ1Jvb3QnIDogJ0ZlYXR1cmUnfShbJHtlZmZlY3RzTmFtZX1dKWAsXG4gICAgICByZWxhdGl2ZVBhdGhcbiAgICApO1xuICAgIGNvbnN0IGNoYW5nZXMgPSBbZWZmZWN0c01vZHVsZUltcG9ydCwgZWZmZWN0c0ltcG9ydCwgZWZmZWN0c05nTW9kdWxlSW1wb3J0XTtcbiAgICBjb25zdCByZWNvcmRlciA9IGhvc3QuYmVnaW5VcGRhdGUobW9kdWxlUGF0aCk7XG4gICAgZm9yIChjb25zdCBjaGFuZ2Ugb2YgY2hhbmdlcykge1xuICAgICAgaWYgKGNoYW5nZSBpbnN0YW5jZW9mIEluc2VydENoYW5nZSkge1xuICAgICAgICByZWNvcmRlci5pbnNlcnRMZWZ0KGNoYW5nZS5wb3MsIGNoYW5nZS50b0FkZCk7XG4gICAgICB9XG4gICAgfVxuICAgIGhvc3QuY29tbWl0VXBkYXRlKHJlY29yZGVyKTtcblxuICAgIHJldHVybiBob3N0O1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihvcHRpb25zOiBFZmZlY3RPcHRpb25zKTogUnVsZSB7XG4gIG9wdGlvbnMucGF0aCA9IG9wdGlvbnMucGF0aCA/IG5vcm1hbGl6ZShvcHRpb25zLnBhdGgpIDogb3B0aW9ucy5wYXRoO1xuICBjb25zdCBzb3VyY2VEaXIgPSBvcHRpb25zLnNvdXJjZURpcjtcbiAgaWYgKCFzb3VyY2VEaXIpIHtcbiAgICB0aHJvdyBuZXcgU2NoZW1hdGljc0V4Y2VwdGlvbihgc291cmNlRGlyIG9wdGlvbiBpcyByZXF1aXJlZC5gKTtcbiAgfVxuXG4gIHJldHVybiAoaG9zdDogVHJlZSwgY29udGV4dDogU2NoZW1hdGljQ29udGV4dCkgPT4ge1xuICAgIGlmIChvcHRpb25zLm1vZHVsZSkge1xuICAgICAgb3B0aW9ucy5tb2R1bGUgPSBmaW5kTW9kdWxlRnJvbU9wdGlvbnMoaG9zdCwgb3B0aW9ucyk7XG4gICAgfVxuXG4gICAgY29uc3QgdGVtcGxhdGVTb3VyY2UgPSBhcHBseSh1cmwoJy4vZmlsZXMnKSwgW1xuICAgICAgb3B0aW9ucy5zcGVjID8gbm9vcCgpIDogZmlsdGVyKHBhdGggPT4gIXBhdGguZW5kc1dpdGgoJ19fc3BlYy50cycpKSxcbiAgICAgIHRlbXBsYXRlKHtcbiAgICAgICAgLi4uc3RyaW5nVXRpbHMsXG4gICAgICAgICdpZi1mbGF0JzogKHM6IHN0cmluZykgPT5cbiAgICAgICAgICBzdHJpbmdVdGlscy5ncm91cChcbiAgICAgICAgICAgIG9wdGlvbnMuZmxhdCA/ICcnIDogcyxcbiAgICAgICAgICAgIG9wdGlvbnMuZ3JvdXAgPyAnZWZmZWN0cycgOiAnJ1xuICAgICAgICAgICksXG4gICAgICAgIC4uLihvcHRpb25zIGFzIG9iamVjdCksXG4gICAgICAgIGRvdDogKCkgPT4gJy4nLFxuICAgICAgfSBhcyBhbnkpLFxuICAgICAgbW92ZShzb3VyY2VEaXIpLFxuICAgIF0pO1xuXG4gICAgcmV0dXJuIGNoYWluKFtcbiAgICAgIGJyYW5jaEFuZE1lcmdlKFxuICAgICAgICBjaGFpbihbXG4gICAgICAgICAgZmlsdGVyKFxuICAgICAgICAgICAgcGF0aCA9PlxuICAgICAgICAgICAgICBwYXRoLmVuZHNXaXRoKCcubW9kdWxlLnRzJykgJiZcbiAgICAgICAgICAgICAgIXBhdGguZW5kc1dpdGgoJy1yb3V0aW5nLm1vZHVsZS50cycpXG4gICAgICAgICAgKSxcbiAgICAgICAgICBhZGRJbXBvcnRUb05nTW9kdWxlKG9wdGlvbnMpLFxuICAgICAgICAgIG1lcmdlV2l0aCh0ZW1wbGF0ZVNvdXJjZSksXG4gICAgICAgIF0pXG4gICAgICApLFxuICAgIF0pKGhvc3QsIGNvbnRleHQpO1xuICB9O1xufVxuIl19