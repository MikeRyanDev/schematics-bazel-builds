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
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@ngrx/schematics/src/utility/ngrx-utils", ["require", "exports", "typescript", "@ngrx/schematics/src/utility/strings", "@ngrx/schematics/src/utility/change", "@angular-devkit/schematics", "@angular-devkit/core", "@ngrx/schematics/src/utility/find-module", "@ngrx/schematics/src/utility/route-utils", "@ngrx/schematics/src/utility/ast-utils"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ts = require("typescript");
    var stringUtils = require("@ngrx/schematics/src/utility/strings");
    var change_1 = require("@ngrx/schematics/src/utility/change");
    var schematics_1 = require("@angular-devkit/schematics");
    var core_1 = require("@angular-devkit/core");
    var find_module_1 = require("@ngrx/schematics/src/utility/find-module");
    var route_utils_1 = require("@ngrx/schematics/src/utility/route-utils");
    var ast_utils_1 = require("@ngrx/schematics/src/utility/ast-utils");
    function addReducerToState(options) {
        return function (host) {
            if (!options.reducers) {
                return host;
            }
            var reducersPath = core_1.normalize("/" + options.sourceDir + "/" + options.path + "/" + options.reducers);
            if (!host.exists(reducersPath)) {
                throw new Error('Specified reducers path does not exist');
            }
            var text = host.read(reducersPath);
            if (text === null) {
                throw new schematics_1.SchematicsException("File " + reducersPath + " does not exist.");
            }
            var sourceText = text.toString('utf-8');
            var source = ts.createSourceFile(reducersPath, sourceText, ts.ScriptTarget.Latest, true);
            var reducerPath = "/" + options.sourceDir + "/" + options.path + "/" +
                (options.flat ? '' : stringUtils.dasherize(options.name) + '/') +
                (options.group ? 'reducers/' : '') +
                stringUtils.dasherize(options.name) +
                '.reducer';
            var relativePath = find_module_1.buildRelativePath(reducersPath, reducerPath);
            var reducerImport = route_utils_1.insertImport(source, reducersPath, "* as from" + stringUtils.classify(options.name), relativePath, true);
            var stateInferfaceInsert = addReducerToStateInferface(source, reducersPath, options);
            var reducerMapInsert = addReducerToActionReducerMap(source, reducersPath, options);
            var changes = [reducerImport, stateInferfaceInsert, reducerMapInsert];
            var recorder = host.beginUpdate(reducersPath);
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
    exports.addReducerToState = addReducerToState;
    /**
     * Insert the reducer into the first defined top level interface
     */
    function addReducerToStateInferface(source, reducersPath, options) {
        var stateInterface = source.statements.find(function (stm) { return stm.kind === ts.SyntaxKind.InterfaceDeclaration; });
        var node = stateInterface;
        if (!node) {
            return new change_1.NoopChange();
        }
        var keyInsert = stringUtils.camelize(options.name) +
            ': from' +
            stringUtils.classify(options.name) +
            '.State;';
        var expr = node;
        var position;
        var toInsert;
        if (expr.members.length === 0) {
            position = expr.getEnd() - 1;
            toInsert = "  " + keyInsert + "\n";
        }
        else {
            node = expr.members[expr.members.length - 1];
            position = node.getEnd() + 1;
            // Get the indentation of the last element, if any.
            var text = node.getFullText(source);
            var matches = text.match(/^\r?\n+(\s*)/);
            if (matches.length > 0) {
                toInsert = "" + matches[1] + keyInsert + "\n";
            }
            else {
                toInsert = "\n" + keyInsert;
            }
        }
        return new change_1.InsertChange(reducersPath, position, toInsert);
    }
    exports.addReducerToStateInferface = addReducerToStateInferface;
    /**
     * Insert the reducer into the ActionReducerMap
     */
    function addReducerToActionReducerMap(source, reducersPath, options) {
        var initializer;
        var actionReducerMap = source.statements
            .filter(function (stm) { return stm.kind === ts.SyntaxKind.VariableStatement; })
            .filter(function (stm) { return !!stm.declarationList; })
            .map(function (stm) {
            var declarations = stm.declarationList.declarations;
            var variable = declarations.find(function (decl) { return decl.kind === ts.SyntaxKind.VariableDeclaration; });
            var type = variable ? variable.type : {};
            return { initializer: variable.initializer, type: type };
        })
            .find(function (_a) {
            var type = _a.type;
            return type.typeName.text === 'ActionReducerMap';
        });
        if (!actionReducerMap || !actionReducerMap.initializer) {
            return new change_1.NoopChange();
        }
        var node = actionReducerMap.initializer;
        var keyInsert = stringUtils.camelize(options.name) +
            ': from' +
            stringUtils.classify(options.name) +
            '.reducer,';
        var expr = node;
        var position;
        var toInsert;
        if (expr.properties.length === 0) {
            position = expr.getEnd() - 1;
            toInsert = "  " + keyInsert + "\n";
        }
        else {
            node = expr.properties[expr.properties.length - 1];
            position = node.getEnd() + 1;
            // Get the indentation of the last element, if any.
            var text = node.getFullText(source);
            var matches = text.match(/^\r?\n+(\s*)/);
            if (matches.length > 0) {
                toInsert = "\n" + matches[1] + keyInsert;
            }
            else {
                toInsert = "\n" + keyInsert;
            }
        }
        return new change_1.InsertChange(reducersPath, position, toInsert);
    }
    exports.addReducerToActionReducerMap = addReducerToActionReducerMap;
    /**
     * Add reducer feature to NgModule
     */
    function addReducerImportToNgModule(options) {
        return function (host) {
            if (!options.module) {
                return host;
            }
            var modulePath = options.module;
            if (!host.exists(options.module)) {
                throw new Error('Specified module does not exist');
            }
            var text = host.read(modulePath);
            if (text === null) {
                throw new schematics_1.SchematicsException("File " + modulePath + " does not exist.");
            }
            var sourceText = text.toString('utf-8');
            var source = ts.createSourceFile(modulePath, sourceText, ts.ScriptTarget.Latest, true);
            var commonImports = [
                route_utils_1.insertImport(source, modulePath, 'StoreModule', '@ngrx/store'),
            ];
            var reducerPath = "/" + options.sourceDir + "/" + options.path + "/" +
                (options.flat ? '' : stringUtils.dasherize(options.name) + '/') +
                (options.group ? 'reducers/' : '') +
                stringUtils.dasherize(options.name) +
                '.reducer';
            var relativePath = find_module_1.buildRelativePath(modulePath, reducerPath);
            var reducerImport = route_utils_1.insertImport(source, modulePath, "* as from" + stringUtils.classify(options.name), relativePath, true);
            var _a = __read(ast_utils_1.addImportToModule(source, modulePath, "StoreModule.forFeature('" + stringUtils.camelize(options.name) + "', from" + stringUtils.classify(options.name) + ".reducer)", relativePath), 1), storeNgModuleImport = _a[0];
            var changes = __spread(commonImports, [reducerImport, storeNgModuleImport]);
            var recorder = host.beginUpdate(modulePath);
            try {
                for (var changes_2 = __values(changes), changes_2_1 = changes_2.next(); !changes_2_1.done; changes_2_1 = changes_2.next()) {
                    var change = changes_2_1.value;
                    if (change instanceof change_1.InsertChange) {
                        recorder.insertLeft(change.pos, change.toAdd);
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (changes_2_1 && !changes_2_1.done && (_b = changes_2.return)) _b.call(changes_2);
                }
                finally { if (e_2) throw e_2.error; }
            }
            host.commitUpdate(recorder);
            return host;
            var e_2, _b;
        };
    }
    exports.addReducerImportToNgModule = addReducerImportToNgModule;
    function omit(object, keyToRemove) {
        return Object.keys(object)
            .filter(function (key) { return key !== keyToRemove; })
            .reduce(function (result, key) {
            return Object.assign(result, (_a = {}, _a[key] = object[key], _a));
            var _a;
        }, {});
    }
    exports.omit = omit;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdyeC11dGlscy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvc2NoZW1hdGljcy9zcmMvdXRpbGl0eS9uZ3J4LXV0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBQUEsK0JBQWlDO0lBQ2pDLGtFQUF5QztJQUN6Qyw4REFBNEQ7SUFDNUQseURBQTZFO0lBQzdFLDZDQUFpRDtJQUNqRCx3RUFBa0Q7SUFDbEQsd0VBQTZDO0lBRTdDLG9FQUFnRDtJQUVoRCwyQkFBa0MsT0FBdUI7UUFDdkQsTUFBTSxDQUFDLFVBQUMsSUFBVTtZQUNoQixFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUN0QixNQUFNLENBQUMsSUFBSSxDQUFDO1lBQ2QsQ0FBQztZQUVELElBQU0sWUFBWSxHQUFHLGdCQUFTLENBQzVCLE1BQUksT0FBTyxDQUFDLFNBQVMsU0FBSSxPQUFPLENBQUMsSUFBSSxTQUFJLE9BQU8sQ0FBQyxRQUFVLENBQzVELENBQUM7WUFFRixFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMvQixNQUFNLElBQUksS0FBSyxDQUFDLHdDQUF3QyxDQUFDLENBQUM7WUFDNUQsQ0FBQztZQUVELElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDckMsRUFBRSxDQUFDLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ2xCLE1BQU0sSUFBSSxnQ0FBbUIsQ0FBQyxVQUFRLFlBQVkscUJBQWtCLENBQUMsQ0FBQztZQUN4RSxDQUFDO1lBRUQsSUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUUxQyxJ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QTdDLENBQTZDLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDaEYsQ0FBQztJQVBELG9CQU9DIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5pbXBvcnQgKiBhcyBzdHJpbmdVdGlscyBmcm9tICcuL3N0cmluZ3MnO1xuaW1wb3J0IHsgSW5zZXJ0Q2hhbmdlLCBDaGFuZ2UsIE5vb3BDaGFuZ2UgfSBmcm9tICcuL2NoYW5nZSc7XG5pbXBvcnQgeyBUcmVlLCBTY2hlbWF0aWNzRXhjZXB0aW9uLCBSdWxlIH0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L3NjaGVtYXRpY3MnO1xuaW1wb3J0IHsgbm9ybWFsaXplIH0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L2NvcmUnO1xuaW1wb3J0IHsgYnVpbGRSZWxhdGl2ZVBhdGggfSBmcm9tICcuL2ZpbmQtbW9kdWxlJztcbmltcG9ydCB7IGluc2VydEltcG9ydCB9IGZyb20gJy4vcm91dGUtdXRpbHMnO1xuaW1wb3J0IHsgUmVkdWNlck9wdGlvbnMgfSBmcm9tICcuLi9yZWR1Y2VyJztcbmltcG9ydCB7IGFkZEltcG9ydFRvTW9kdWxlIH0gZnJvbSAnLi9hc3QtdXRpbHMnO1xuXG5leHBvcnQgZnVuY3Rpb24gYWRkUmVkdWNlclRvU3RhdGUob3B0aW9uczogUmVkdWNlck9wdGlvbnMpOiBSdWxlIHtcbiAgcmV0dXJuIChob3N0OiBUcmVlKSA9PiB7XG4gICAgaWYgKCFvcHRpb25zLnJlZHVjZXJzKSB7XG4gICAgICByZXR1cm4gaG9zdDtcbiAgICB9XG5cbiAgICBjb25zdCByZWR1Y2Vyc1BhdGggPSBub3JtYWxpemUoXG4gICAgICBgLyR7b3B0aW9ucy5zb3VyY2VEaXJ9LyR7b3B0aW9ucy5wYXRofS8ke29wdGlvbnMucmVkdWNlcnN9YFxuICAgICk7XG5cbiAgICBpZiAoIWhvc3QuZXhpc3RzKHJlZHVjZXJzUGF0aCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignU3BlY2lmaWVkIHJlZHVjZXJzIHBhdGggZG9lcyBub3QgZXhpc3QnKTtcbiAgICB9XG5cbiAgICBjb25zdCB0ZXh0ID0gaG9zdC5yZWFkKHJlZHVjZXJzUGF0aCk7XG4gICAgaWYgKHRleHQgPT09IG51bGwpIHtcbiAgICAgIHRocm93IG5ldyBTY2hlbWF0aWNzRXhjZXB0aW9uKGBGaWxlICR7cmVkdWNlcnNQYXRofSBkb2VzIG5vdCBleGlzdC5gKTtcbiAgICB9XG5cbiAgICBjb25zdCBzb3VyY2VUZXh0ID0gdGV4dC50b1N0cmluZygndXRmLTgnKTtcblxuICAgIGNvbnN0IHNvdXJjZSA9IHRzLmNyZWF0ZVNvdXJjZUZpbGUoXG4gICAgICByZWR1Y2Vyc1BhdGgsXG4gICAgICBzb3VyY2VUZXh0LFxuICAgICAgdHMuU2NyaXB0VGFyZ2V0LkxhdGVzdCxcbiAgICAgIHRydWVcbiAgICApO1xuXG4gICAgY29uc3QgcmVkdWNlclBhdGggPVxuICAgICAgYC8ke29wdGlvbnMuc291cmNlRGlyfS8ke29wdGlvbnMucGF0aH0vYCArXG4gICAgICAob3B0aW9ucy5mbGF0ID8gJycgOiBzdHJpbmdVdGlscy5kYXNoZXJpemUob3B0aW9ucy5uYW1lKSArICcvJykgK1xuICAgICAgKG9wdGlvbnMuZ3JvdXAgPyAncmVkdWNlcnMvJyA6ICcnKSArXG4gICAgICBzdHJpbmdVdGlscy5kYXNoZXJpemUob3B0aW9ucy5uYW1lKSArXG4gICAgICAnLnJlZHVjZXInO1xuXG4gICAgY29uc3QgcmVsYXRpdmVQYXRoID0gYnVpbGRSZWxhdGl2ZVBhdGgocmVkdWNlcnNQYXRoLCByZWR1Y2VyUGF0aCk7XG4gICAgY29uc3QgcmVkdWNlckltcG9ydCA9IGluc2VydEltcG9ydChcbiAgICAgIHNvdXJjZSxcbiAgICAgIHJlZHVjZXJzUGF0aCxcbiAgICAgIGAqIGFzIGZyb20ke3N0cmluZ1V0aWxzLmNsYXNzaWZ5KG9wdGlvbnMubmFtZSl9YCxcbiAgICAgIHJlbGF0aXZlUGF0aCxcbiAgICAgIHRydWVcbiAgICApO1xuXG4gICAgY29uc3Qgc3RhdGVJbmZlcmZhY2VJbnNlcnQgPSBhZGRSZWR1Y2VyVG9TdGF0ZUluZmVyZmFjZShcbiAgICAgIHNvdXJjZSxcbiAgICAgIHJlZHVjZXJzUGF0aCxcbiAgICAgIG9wdGlvbnNcbiAgICApO1xuICAgIGNvbnN0IHJlZHVjZXJNYXBJbnNlcnQgPSBhZGRSZWR1Y2VyVG9BY3Rpb25SZWR1Y2VyTWFwKFxuICAgICAgc291cmNlLFxuICAgICAgcmVkdWNlcnNQYXRoLFxuICAgICAgb3B0aW9uc1xuICAgICk7XG5cbiAgICBjb25zdCBjaGFuZ2VzID0gW3JlZHVjZXJJbXBvcnQsIHN0YXRlSW5mZXJmYWNlSW5zZXJ0LCByZWR1Y2VyTWFwSW5zZXJ0XTtcbiAgICBjb25zdCByZWNvcmRlciA9IGhvc3QuYmVnaW5VcGRhdGUocmVkdWNlcnNQYXRoKTtcbiAgICBmb3IgKGNvbnN0IGNoYW5nZSBvZiBjaGFuZ2VzKSB7XG4gICAgICBpZiAoY2hhbmdlIGluc3RhbmNlb2YgSW5zZXJ0Q2hhbmdlKSB7XG4gICAgICAgIHJlY29yZGVyLmluc2VydExlZnQoY2hhbmdlLnBvcywgY2hhbmdlLnRvQWRkKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaG9zdC5jb21taXRVcGRhdGUocmVjb3JkZXIpO1xuXG4gICAgcmV0dXJuIGhvc3Q7XG4gIH07XG59XG5cbi8qKlxuICogSW5zZXJ0IHRoZSByZWR1Y2VyIGludG8gdGhlIGZpcnN0IGRlZmluZWQgdG9wIGxldmVsIGludGVyZmFjZVxuICovXG5leHBvcnQgZnVuY3Rpb24gYWRkUmVkdWNlclRvU3RhdGVJbmZlcmZhY2UoXG4gIHNvdXJjZTogdHMuU291cmNlRmlsZSxcbiAgcmVkdWNlcnNQYXRoOiBzdHJpbmcsXG4gIG9wdGlvbnM6IHsgbmFtZTogc3RyaW5nIH1cbik6IENoYW5nZSB7XG4gIGNvbnN0IHN0YXRlSW50ZXJmYWNlID0gc291cmNlLnN0YXRlbWVudHMuZmluZChcbiAgICBzdG0gPT4gc3RtLmtpbmQgPT09IHRzLlN5bnRheEtpbmQuSW50ZXJmYWNlRGVjbGFyYXRpb25cbiAgKTtcbiAgbGV0IG5vZGUgPSBzdGF0ZUludGVyZmFjZSBhcyB0cy5TdGF0ZW1lbnQ7XG5cbiAgaWYgKCFub2RlKSB7XG4gICAgcmV0dXJuIG5ldyBOb29wQ2hhbmdlKCk7XG4gIH1cblxuICBjb25zdCBrZXlJbnNlcnQgPVxuICAgIHN0cmluZ1V0aWxzLmNhbWVsaXplKG9wdGlvbnMubmFtZSkgK1xuICAgICc6IGZyb20nICtcbiAgICBzdHJpbmdVdGlscy5jbGFzc2lmeShvcHRpb25zLm5hbWUpICtcbiAgICAnLlN0YXRlOyc7XG4gIGNvbnN0IGV4cHIgPSBub2RlIGFzIGFueTtcbiAgbGV0IHBvc2l0aW9uO1xuICBsZXQgdG9JbnNlcnQ7XG5cbiAgaWYgKGV4cHIubWVtYmVycy5sZW5ndGggPT09IDApIHtcbiAgICBwb3NpdGlvbiA9IGV4cHIuZ2V0RW5kKCkgLSAxO1xuICAgIHRvSW5zZXJ0ID0gYCAgJHtrZXlJbnNlcnR9XFxuYDtcbiAgfSBlbHNlIHtcbiAgICBub2RlID0gZXhwci5tZW1iZXJzW2V4cHIubWVtYmVycy5sZW5ndGggLSAxXTtcbiAgICBwb3NpdGlvbiA9IG5vZGUuZ2V0RW5kKCkgKyAxO1xuICAgIC8vIEdldCB0aGUgaW5kZW50YXRpb24gb2YgdGhlIGxhc3QgZWxlbWVudCwgaWYgYW55LlxuICAgIGNvbnN0IHRleHQgPSBub2RlLmdldEZ1bGxUZXh0KHNvdXJjZSk7XG4gICAgY29uc3QgbWF0Y2hlcyA9IHRleHQubWF0Y2goL15cXHI/XFxuKyhcXHMqKS8pO1xuXG4gICAgaWYgKG1hdGNoZXMhLmxlbmd0aCA+IDApIHtcbiAgICAgIHRvSW5zZXJ0ID0gYCR7bWF0Y2hlcyFbMV19JHtrZXlJbnNlcnR9XFxuYDtcbiAgICB9IGVsc2Uge1xuICAgICAgdG9JbnNlcnQgPSBgXFxuJHtrZXlJbnNlcnR9YDtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbmV3IEluc2VydENoYW5nZShyZWR1Y2Vyc1BhdGgsIHBvc2l0aW9uLCB0b0luc2VydCk7XG59XG5cbi8qKlxuICogSW5zZXJ0IHRoZSByZWR1Y2VyIGludG8gdGhlIEFjdGlvblJlZHVjZXJNYXBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFkZFJlZHVjZXJUb0FjdGlvblJlZHVjZXJNYXAoXG4gIHNvdXJjZTogdHMuU291cmNlRmlsZSxcbiAgcmVkdWNlcnNQYXRoOiBzdHJpbmcsXG4gIG9wdGlvbnM6IHsgbmFtZTogc3RyaW5nIH1cbik6IENoYW5nZSB7XG4gIGxldCBpbml0aWFsaXplcjogYW55O1xuICBjb25zdCBhY3Rpb25SZWR1Y2VyTWFwOiBhbnkgPSBzb3VyY2Uuc3RhdGVtZW50c1xuICAgIC5maWx0ZXIoc3RtID0+IHN0bS5raW5kID09PSB0cy5TeW50YXhLaW5kLlZhcmlhYmxlU3RhdGVtZW50KVxuICAgIC5maWx0ZXIoKHN0bTogYW55KSA9PiAhIXN0bS5kZWNsYXJhdGlvbkxpc3QpXG4gICAgLm1hcCgoc3RtOiBhbnkpID0+IHtcbiAgICAgIGNvbnN0IHtcbiAgICAgICAgZGVjbGFyYXRpb25zLFxuICAgICAgfToge1xuICAgICAgICBkZWNsYXJhdGlvbnM6IHRzLlN5bnRheEtpbmQuVmFyaWFibGVEZWNsYXJhdGlvbkxpc3RbXTtcbiAgICAgIH0gPSBzdG0uZGVjbGFyYXRpb25MaXN0O1xuICAgICAgY29uc3QgdmFyaWFibGU6IGFueSA9IGRlY2xhcmF0aW9ucy5maW5kKFxuICAgICAgICAoZGVjbDogYW55KSA9PiBkZWNsLmtpbmQgPT09IHRzLlN5bnRheEtpbmQuVmFyaWFibGVEZWNsYXJhdGlvblxuICAgICAgKTtcbiAgICAgIGNvbnN0IHR5cGUgPSB2YXJpYWJsZSA/IHZhcmlhYmxlLnR5cGUgOiB7fTtcblxuICAgICAgcmV0dXJuIHsgaW5pdGlhbGl6ZXI6IHZhcmlhYmxlLmluaXRpYWxpemVyLCB0eXBlIH07XG4gICAgfSlcbiAgICAuZmluZCgoeyB0eXBlIH0pID0+IHR5cGUudHlwZU5hbWUudGV4dCA9PT0gJ0FjdGlvblJlZHVjZXJNYXAnKTtcblxuICBpZiAoIWFjdGlvblJlZHVjZXJNYXAgfHwgIWFjdGlvblJlZHVjZXJNYXAuaW5pdGlhbGl6ZXIpIHtcbiAgICByZXR1cm4gbmV3IE5vb3BDaGFuZ2UoKTtcbiAgfVxuXG4gIGxldCBub2RlID0gYWN0aW9uUmVkdWNlck1hcC5pbml0aWFsaXplcjtcblxuICBjb25zdCBrZXlJbnNlcnQgPVxuICAgIHN0cmluZ1V0aWxzLmNhbWVsaXplKG9wdGlvbnMubmFtZSkgK1xuICAgICc6IGZyb20nICtcbiAgICBzdHJpbmdVdGlscy5jbGFzc2lmeShvcHRpb25zLm5hbWUpICtcbiAgICAnLnJlZHVjZXIsJztcbiAgY29uc3QgZXhwciA9IG5vZGUgYXMgYW55O1xuICBsZXQgcG9zaXRpb247XG4gIGxldCB0b0luc2VydDtcblxuICBpZiAoZXhwci5wcm9wZXJ0aWVzLmxlbmd0aCA9PT0gMCkge1xuICAgIHBvc2l0aW9uID0gZXhwci5nZXRFbmQoKSAtIDE7XG4gICAgdG9JbnNlcnQgPSBgICAke2tleUluc2VydH1cXG5gO1xuICB9IGVsc2Uge1xuICAgIG5vZGUgPSBleHByLnByb3BlcnRpZXNbZXhwci5wcm9wZXJ0aWVzLmxlbmd0aCAtIDFdO1xuICAgIHBvc2l0aW9uID0gbm9kZS5nZXRFbmQoKSArIDE7XG4gICAgLy8gR2V0IHRoZSBpbmRlbnRhdGlvbiBvZiB0aGUgbGFzdCBlbGVtZW50LCBpZiBhbnkuXG4gICAgY29uc3QgdGV4dCA9IG5vZGUuZ2V0RnVsbFRleHQoc291cmNlKTtcbiAgICBjb25zdCBtYXRjaGVzID0gdGV4dC5tYXRjaCgvXlxccj9cXG4rKFxccyopLyk7XG5cbiAgICBpZiAobWF0Y2hlcy5sZW5ndGggPiAwKSB7XG4gICAgICB0b0luc2VydCA9IGBcXG4ke21hdGNoZXMhWzFdfSR7a2V5SW5zZXJ0fWA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRvSW5zZXJ0ID0gYFxcbiR7a2V5SW5zZXJ0fWA7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG5ldyBJbnNlcnRDaGFuZ2UocmVkdWNlcnNQYXRoLCBwb3NpdGlvbiwgdG9JbnNlcnQpO1xufVxuXG4vKipcbiAqIEFkZCByZWR1Y2VyIGZlYXR1cmUgdG8gTmdNb2R1bGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFkZFJlZHVjZXJJbXBvcnRUb05nTW9kdWxlKG9wdGlvbnM6IFJlZHVjZXJPcHRpb25zKTogUnVsZSB7XG4gIHJldHVybiAoaG9zdDogVHJlZSkgPT4ge1xuICAgIGlmICghb3B0aW9ucy5tb2R1bGUpIHtcbiAgICAgIHJldHVybiBob3N0O1xuICAgIH1cblxuICAgIGNvbnN0IG1vZHVsZVBhdGggPSBvcHRpb25zLm1vZHVsZTtcbiAgICBpZiAoIWhvc3QuZXhpc3RzKG9wdGlvbnMubW9kdWxlKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdTcGVjaWZpZWQgbW9kdWxlIGRvZXMgbm90IGV4aXN0Jyk7XG4gICAgfVxuXG4gICAgY29uc3QgdGV4dCA9IGhvc3QucmVhZChtb2R1bGVQYXRoKTtcbiAgICBpZiAodGV4dCA9PT0gbnVsbCkge1xuICAgICAgdGhyb3cgbmV3IFNjaGVtYXRpY3NFeGNlcHRpb24oYEZpbGUgJHttb2R1bGVQYXRofSBkb2VzIG5vdCBleGlzdC5gKTtcbiAgICB9XG4gICAgY29uc3Qgc291cmNlVGV4dCA9IHRleHQudG9TdHJpbmcoJ3V0Zi04Jyk7XG5cbiAgICBjb25zdCBzb3VyY2UgPSB0cy5jcmVhdGVTb3VyY2VGaWxlKFxuICAgICAgbW9kdWxlUGF0aCxcbiAgICAgIHNvdXJjZVRleHQsXG4gICAgICB0cy5TY3JpcHRUYXJnZXQuTGF0ZXN0LFxuICAgICAgdHJ1ZVxuICAgICk7XG5cbiAgICBjb25zdCBjb21tb25JbXBvcnRzID0gW1xuICAgICAgaW5zZXJ0SW1wb3J0KHNvdXJjZSwgbW9kdWxlUGF0aCwgJ1N0b3JlTW9kdWxlJywgJ0BuZ3J4L3N0b3JlJyksXG4gICAgXTtcblxuICAgIGNvbnN0IHJlZHVjZXJQYXRoID1cbiAgICAgIGAvJHtvcHRpb25zLnNvdXJjZURpcn0vJHtvcHRpb25zLnBhdGh9L2AgK1xuICAgICAgKG9wdGlvbnMuZmxhdCA/ICcnIDogc3RyaW5nVXRpbHMuZGFzaGVyaXplKG9wdGlvbnMubmFtZSkgKyAnLycpICtcbiAgICAgIChvcHRpb25zLmdyb3VwID8gJ3JlZHVjZXJzLycgOiAnJykgK1xuICAgICAgc3RyaW5nVXRpbHMuZGFzaGVyaXplKG9wdGlvbnMubmFtZSkgK1xuICAgICAgJy5yZWR1Y2VyJztcbiAgICBjb25zdCByZWxhdGl2ZVBhdGggPSBidWlsZFJlbGF0aXZlUGF0aChtb2R1bGVQYXRoLCByZWR1Y2VyUGF0aCk7XG4gICAgY29uc3QgcmVkdWNlckltcG9ydCA9IGluc2VydEltcG9ydChcbiAgICAgIHNvdXJjZSxcbiAgICAgIG1vZHVsZVBhdGgsXG4gICAgICBgKiBhcyBmcm9tJHtzdHJpbmdVdGlscy5jbGFzc2lmeShvcHRpb25zLm5hbWUpfWAsXG4gICAgICByZWxhdGl2ZVBhdGgsXG4gICAgICB0cnVlXG4gICAgKTtcbiAgICBjb25zdCBbc3RvcmVOZ01vZHVsZUltcG9ydF0gPSBhZGRJbXBvcnRUb01vZHVsZShcbiAgICAgIHNvdXJjZSxcbiAgICAgIG1vZHVsZVBhdGgsXG4gICAgICBgU3RvcmVNb2R1bGUuZm9yRmVhdHVyZSgnJHtzdHJpbmdVdGlscy5jYW1lbGl6ZShcbiAgICAgICAgb3B0aW9ucy5uYW1lXG4gICAgICApfScsIGZyb20ke3N0cmluZ1V0aWxzLmNsYXNzaWZ5KG9wdGlvbnMubmFtZSl9LnJlZHVjZXIpYCxcbiAgICAgIHJlbGF0aXZlUGF0aFxuICAgICk7XG4gICAgY29uc3QgY2hhbmdlcyA9IFsuLi5jb21tb25JbXBvcnRzLCByZWR1Y2VySW1wb3J0LCBzdG9yZU5nTW9kdWxlSW1wb3J0XTtcbiAgICBjb25zdCByZWNvcmRlciA9IGhvc3QuYmVnaW5VcGRhdGUobW9kdWxlUGF0aCk7XG4gICAgZm9yIChjb25zdCBjaGFuZ2Ugb2YgY2hhbmdlcykge1xuICAgICAgaWYgKGNoYW5nZSBpbnN0YW5jZW9mIEluc2VydENoYW5nZSkge1xuICAgICAgICByZWNvcmRlci5pbnNlcnRMZWZ0KGNoYW5nZS5wb3MsIGNoYW5nZS50b0FkZCk7XG4gICAgICB9XG4gICAgfVxuICAgIGhvc3QuY29tbWl0VXBkYXRlKHJlY29yZGVyKTtcblxuICAgIHJldHVybiBob3N0O1xuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gb21pdDxUIGV4dGVuZHMgeyBba2V5OiBzdHJpbmddOiBhbnkgfT4oXG4gIG9iamVjdDogVCxcbiAga2V5VG9SZW1vdmU6IGtleW9mIFRcbik6IFBhcnRpYWw8VD4ge1xuICByZXR1cm4gT2JqZWN0LmtleXMob2JqZWN0KVxuICAgIC5maWx0ZXIoa2V5ID0+IGtleSAhPT0ga2V5VG9SZW1vdmUpXG4gICAgLnJlZHVjZSgocmVzdWx0LCBrZXkpID0+IE9iamVjdC5hc3NpZ24ocmVzdWx0LCB7IFtrZXldOiBvYmplY3Rba2V5XSB9KSwge30pO1xufVxuIl19