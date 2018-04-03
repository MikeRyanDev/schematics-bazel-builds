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
        define("@ngrx/schematics/src/container/index", ["require", "exports", "@angular-devkit/schematics", "typescript", "@ngrx/schematics/src/utility/strings", "@ngrx/schematics/src/utility/find-module", "@ngrx/schematics/src/utility/change", "@ngrx/schematics/src/utility/route-utils", "@ngrx/schematics/src/utility/ngrx-utils"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var schematics_1 = require("@angular-devkit/schematics");
    var ts = require("typescript");
    var stringUtils = require("@ngrx/schematics/src/utility/strings");
    var find_module_1 = require("@ngrx/schematics/src/utility/find-module");
    var change_1 = require("@ngrx/schematics/src/utility/change");
    var route_utils_1 = require("@ngrx/schematics/src/utility/route-utils");
    var ngrx_utils_1 = require("@ngrx/schematics/src/utility/ngrx-utils");
    exports.ContainerOptions = require('./schema.json');
    function addStateToComponent(options) {
        return function (host) {
            if (!options.state && !options.stateInterface) {
                return host;
            }
            var statePath = "/" + options.sourceDir + "/" + options.path + "/" + options.state;
            if (options.state) {
                if (!host.exists(statePath)) {
                    throw new Error('Specified state path does not exist');
                }
            }
            var componentPath = "/" + options.sourceDir + "/" + options.path + "/" +
                (options.flat ? '' : stringUtils.dasherize(options.name) + '/') +
                stringUtils.dasherize(options.name) +
                '.component.ts';
            var text = host.read(componentPath);
            if (text === null) {
                throw new schematics_1.SchematicsException("File " + componentPath + " does not exist.");
            }
            var sourceText = text.toString('utf-8');
            var source = ts.createSourceFile(componentPath, sourceText, ts.ScriptTarget.Latest, true);
            var stateImportPath = find_module_1.buildRelativePath(componentPath, statePath);
            var storeImport = route_utils_1.insertImport(source, componentPath, 'Store', '@ngrx/store');
            var stateImport = options.state
                ? route_utils_1.insertImport(source, componentPath, "* as fromStore", stateImportPath, true)
                : new change_1.NoopChange();
            var componentClass = source.statements.find(function (stm) { return stm.kind === ts.SyntaxKind.ClassDeclaration; });
            var component = componentClass;
            var componentConstructor = component.members.find(function (member) { return member.kind === ts.SyntaxKind.Constructor; });
            var cmpCtr = componentConstructor;
            var pos = cmpCtr.pos;
            var stateType = options.state
                ? "fromStore." + options.stateInterface
                : 'any';
            var constructorText = cmpCtr.getText();
            var _a = __read(constructorText.split('()'), 2), start = _a[0], end = _a[1];
            var storeText = "private store: Store<" + stateType + ">";
            var storeConstructor = [start, "(" + storeText + ")", end].join('');
            var constructorUpdate = new change_1.ReplaceChange(componentPath, pos, "  " + constructorText + "\n\n", "\n\n  " + storeConstructor);
            var changes = [storeImport, stateImport, constructorUpdate];
            var recorder = host.beginUpdate(componentPath);
            try {
                for (var changes_1 = __values(changes), changes_1_1 = changes_1.next(); !changes_1_1.done; changes_1_1 = changes_1.next()) {
                    var change = changes_1_1.value;
                    if (change instanceof change_1.InsertChange) {
                        recorder.insertLeft(change.pos, change.toAdd);
                    }
                    else if (change instanceof change_1.ReplaceChange) {
                        recorder.remove(pos, change.oldText.length);
                        recorder.insertLeft(change.order, change.newText);
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
        return function (host, context) {
            var sourceDir = options.sourceDir;
            if (!sourceDir) {
                throw new schematics_1.SchematicsException("sourceDir option is required.");
            }
            var opts = ['state', 'stateInterface'].reduce(function (current, key) {
                return ngrx_utils_1.omit(current, key);
            }, options);
            var templateSource = schematics_1.apply(schematics_1.url('./files'), [
                options.spec ? schematics_1.noop() : schematics_1.filter(function (path) { return !path.endsWith('__spec.ts'); }),
                schematics_1.template(__assign({ 'if-flat': function (s) { return (options.flat ? '' : s); } }, stringUtils, options, { dot: function () { return '.'; } })),
                schematics_1.move(sourceDir),
            ]);
            return schematics_1.chain([
                schematics_1.externalSchematic('@schematics/angular', 'component', __assign({}, opts, { spec: false })),
                addStateToComponent(options),
                schematics_1.mergeWith(templateSource),
            ])(host, context);
        };
    }
    exports.default = default_1;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL3NjaGVtYXRpY3Mvc3JjL2NvbnRhaW5lci9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFBQSx5REFjb0M7SUFDcEMsK0JBQWlDO0lBQ2pDLGtFQUFrRDtJQUNsRCx3RUFBMkQ7SUFDM0QsOERBQTRFO0lBQzVFLHdFQUFzRDtJQUN0RCxzRUFBNkM7SUFFaEMsUUFBQSxnQkFBZ0IsR0FBRyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7SUEwRHpELDZCQUE2QixPQUF5QjtRQUNwRCxNQUFNLENBQUMsVUFBQyxJQUFVO1lBQ2hCLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO2dCQUM5QyxNQUFNLENBQUMsSUFBSSxDQUFDO1lBQ2QsQ0FBQztZQUVELElBQU0sU0FBUyxHQUFHLE1BQUksT0FBTyxDQUFDLFNBQVMsU0FBSSxPQUFPLENBQUMsSUFBSSxTQUFJLE9BQU8sQ0FBQyxLQUFPLENBQUM7WUFFM0UsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ2xCLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQzVCLE1BQU0sSUFBSSxLQUFLLENBQUMscUNBQXFDLENBQUMsQ0FBQztnQkFDekQsQ0FBQztZQUNILENBQUM7WUFFRCxJQUFNLGFBQWEsR0FDakIsTUFBSSxPQUFPLENBQUMsU0FBUyxTQUFJLE9BQU8sQ0FBQyxJQUFJLE1BQUc7Z0JBQ3hDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxXQUFX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VUFBQSxJQUFJLElBQUksT0FBQSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLEVBQTNCLENBQTJCLENBQUM7Z0JBQ25FLHFCQUFRLENBQUMsV0FDUCxTQUFTLEVBQUUsVUFBQyxDQUFTLElBQUssT0FBQSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQXZCLENBQXVCLElBQzlDLFdBQVcsRUFDVixPQUFrQixJQUN0QixHQUFHLEVBQUUsY0FBTSxPQUFBLEdBQUcsRUFBSCxDQUFHLEdBQ1IsQ0FBQztnQkFDVCxpQkFBSSxDQUFDLFNBQVMsQ0FBQzthQUNoQixDQUFDLENBQUM7WUFFSCxNQUFNLENBQUMsa0JBQUssQ0FBQztnQkFDWCw4QkFBaUIsQ0FBQyxxQkFBcUIsRUFBRSxXQUFXLGVBQy9DLElBQUksSUFDUCxJQUFJLEVBQUUsS0FBSyxJQUNYO2dCQUNGLG1CQUFtQixDQUFDLE9BQU8sQ0FBQztnQkFDNUIsc0JBQVMsQ0FBQyxjQUFjLENBQUM7YUFDMUIsQ0FBQyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNwQixDQUFDLENBQUM7SUFDSixDQUFDO0lBbkNELDRCQW1DQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIFJ1bGUsXG4gIFNjaGVtYXRpY0NvbnRleHQsXG4gIFNjaGVtYXRpY3NFeGNlcHRpb24sXG4gIFRyZWUsXG4gIGNoYWluLFxuICBleHRlcm5hbFNjaGVtYXRpYyxcbiAgYXBwbHksXG4gIHVybCxcbiAgbm9vcCxcbiAgZmlsdGVyLFxuICB0ZW1wbGF0ZSxcbiAgbW92ZSxcbiAgbWVyZ2VXaXRoLFxufSBmcm9tICdAYW5ndWxhci1kZXZraXQvc2NoZW1hdGljcyc7XG5pbXBvcnQgKiBhcyB0cyBmcm9tICd0eXBlc2NyaXB0JztcbmltcG9ydCAqIGFzIHN0cmluZ1V0aWxzIGZyb20gJy4uL3V0aWxpdHkvc3RyaW5ncyc7XG5pbXBvcnQgeyBidWlsZFJlbGF0aXZlUGF0aCB9IGZyb20gJy4uL3V0aWxpdHkvZmluZC1tb2R1bGUnO1xuaW1wb3J0IHsgTm9vcENoYW5nZSwgSW5zZXJ0Q2hhbmdlLCBSZXBsYWNlQ2hhbmdlIH0gZnJvbSAnLi4vdXRpbGl0eS9jaGFuZ2UnO1xuaW1wb3J0IHsgaW5zZXJ0SW1wb3J0IH0gZnJvbSAnLi4vdXRpbGl0eS9yb3V0ZS11dGlscyc7XG5pbXBvcnQgeyBvbWl0IH0gZnJvbSAnLi4vdXRpbGl0eS9uZ3J4LXV0aWxzJztcblxuZXhwb3J0IGNvbnN0IENvbnRhaW5lck9wdGlvbnMgPSByZXF1aXJlKCcuL3NjaGVtYS5qc29uJyk7XG5leHBvcnQgdHlwZSBDb250YWluZXJPcHRpb25zID0ge1xuICBwYXRoPzogc3RyaW5nO1xuICBhcHBSb290Pzogc3RyaW5nO1xuICBzb3VyY2VEaXI/OiBzdHJpbmc7XG4gIG5hbWU6IHN0cmluZztcbiAgLyoqXG4gICAqIFNwZWNpZmllcyBpZiB0aGUgc3R5bGUgd2lsbCBiZSBpbiB0aGUgdHMgZmlsZS5cbiAgICovXG4gIGlubGluZVN0eWxlPzogYm9vbGVhbjtcbiAgLyoqXG4gICAqIFNwZWNpZmllcyBpZiB0aGUgdGVtcGxhdGUgd2lsbCBiZSBpbiB0aGUgdHMgZmlsZS5cbiAgICovXG4gIGlubGluZVRlbXBsYXRlPzogYm9vbGVhbjtcbiAgLyoqXG4gICAqIFNwZWNpZmllcyB0aGUgdmlldyBlbmNhcHN1bGF0aW9uIHN0cmF0ZWd5LlxuICAgKi9cbiAgdmlld0VuY2Fwc3VsYXRpb24/OiAnRW11bGF0ZWQnIHwgJ05hdGl2ZScgfCAnTm9uZSc7XG4gIC8qKlxuICAgKiBTcGVjaWZpZXMgdGhlIGNoYW5nZSBkZXRlY3Rpb24gc3RyYXRlZ3kuXG4gICAqL1xuICBjaGFuZ2VEZXRlY3Rpb24/OiAnRGVmYXVsdCcgfCAnT25QdXNoJztcbiAgcm91dGluZz86IGJvb2xlYW47XG4gIC8qKlxuICAgKiBUaGUgcHJlZml4IHRvIGFwcGx5IHRvIGdlbmVyYXRlZCBzZWxlY3RvcnMuXG4gICAqL1xuICBwcmVmaXg/OiBzdHJpbmc7XG4gIC8qKlxuICAgKiBUaGUgZmlsZSBleHRlbnNpb24gdG8gYmUgdXNlZCBmb3Igc3R5bGUgZmlsZXMuXG4gICAqL1xuICBzdHlsZWV4dD86IHN0cmluZztcbiAgc3BlYz86IGJvb2xlYW47XG4gIC8qKlxuICAgKiBGbGFnIHRvIGluZGljYXRlIGlmIGEgZGlyIGlzIGNyZWF0ZWQuXG4gICAqL1xuICBmbGF0PzogYm9vbGVhbjtcbiAgaHRtbFRlbXBsYXRlPzogc3RyaW5nO1xuICBza2lwSW1wb3J0PzogYm9vbGVhbjtcbiAgc2VsZWN0b3I/OiBzdHJpbmc7XG4gIC8qKlxuICAgKiBBbGxvd3Mgc3BlY2lmaWNhdGlvbiBvZiB0aGUgZGVjbGFyaW5nIG1vZHVsZS5cbiAgICovXG4gIG1vZHVsZT86IHN0cmluZztcbiAgLyoqXG4gICAqIFNwZWNpZmllcyBpZiBkZWNsYXJpbmcgbW9kdWxlIGV4cG9ydHMgdGhlIGNvbXBvbmVudC5cbiAgICovXG4gIGV4cG9ydD86IGJvb2xlYW47XG4gIC8qKlxuICAgKiBTcGVjaWZpZXMgdGhlIHBhdGggdG8gdGhlIHN0YXRlIGV4cG9ydHNcbiAgICovXG4gIHN0YXRlPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBTcGVjaWZpZXMgdGhlIGludGVyZmFjZSBmb3IgdGhlIHN0YXRlXG4gICAqL1xuICBzdGF0ZUludGVyZmFjZT86IHN0cmluZztcbn07XG5cbmZ1bmN0aW9uIGFkZFN0YXRlVG9Db21wb25lbnQob3B0aW9uczogQ29udGFpbmVyT3B0aW9ucykge1xuICByZXR1cm4gKGhvc3Q6IFRyZWUpID0+IHtcbiAgICBpZiAoIW9wdGlvbnMuc3RhdGUgJiYgIW9wdGlvbnMuc3RhdGVJbnRlcmZhY2UpIHtcbiAgICAgIHJldHVybiBob3N0O1xuICAgIH1cblxuICAgIGNvbnN0IHN0YXRlUGF0aCA9IGAvJHtvcHRpb25zLnNvdXJjZURpcn0vJHtvcHRpb25zLnBhdGh9LyR7b3B0aW9ucy5zdGF0ZX1gO1xuXG4gICAgaWYgKG9wdGlvbnMuc3RhdGUpIHtcbiAgICAgIGlmICghaG9zdC5leGlzdHMoc3RhdGVQYXRoKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1NwZWNpZmllZCBzdGF0ZSBwYXRoIGRvZXMgbm90IGV4aXN0Jyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgY29tcG9uZW50UGF0aCA9XG4gICAgICBgLyR7b3B0aW9ucy5zb3VyY2VEaXJ9LyR7b3B0aW9ucy5wYXRofS9gICtcbiAgICAgIChvcHRpb25zLmZsYXQgPyAnJyA6IHN0cmluZ1V0aWxzLmRhc2hlcml6ZShvcHRpb25zLm5hbWUpICsgJy8nKSArXG4gICAgICBzdHJpbmdVdGlscy5kYXNoZXJpemUob3B0aW9ucy5uYW1lKSArXG4gICAgICAnLmNvbXBvbmVudC50cyc7XG5cbiAgICBjb25zdCB0ZXh0ID0gaG9zdC5yZWFkKGNvbXBvbmVudFBhdGgpO1xuXG4gICAgaWYgKHRleHQgPT09IG51bGwpIHtcbiAgICAgIHRocm93IG5ldyBTY2hlbWF0aWNzRXhjZXB0aW9uKGBGaWxlICR7Y29tcG9uZW50UGF0aH0gZG9lcyBub3QgZXhpc3QuYCk7XG4gICAgfVxuXG4gICAgY29uc3Qgc291cmNlVGV4dCA9IHRleHQudG9TdHJpbmcoJ3V0Zi04Jyk7XG5cbiAgICBjb25zdCBzb3VyY2UgPSB0cy5jcmVhdGVTb3VyY2VGaWxlKFxuICAgICAgY29tcG9uZW50UGF0aCxcbiAgICAgIHNvdXJjZVRleHQsXG4gICAgICB0cy5TY3JpcHRUYXJnZXQuTGF0ZXN0LFxuICAgICAgdHJ1ZVxuICAgICk7XG5cbiAgICBjb25zdCBzdGF0ZUltcG9ydFBhdGggPSBidWlsZFJlbGF0aXZlUGF0aChjb21wb25lbnRQYXRoLCBzdGF0ZVBhdGgpO1xuICAgIGNvbnN0IHN0b3JlSW1wb3J0ID0gaW5zZXJ0SW1wb3J0KFxuICAgICAgc291cmNlLFxuICAgICAgY29tcG9uZW50UGF0aCxcbiAgICAgICdTdG9yZScsXG4gICAgICAnQG5ncngvc3RvcmUnXG4gICAgKTtcbiAgICBjb25zdCBzdGF0ZUltcG9ydCA9IG9wdGlvbnMuc3RhdGVcbiAgICAgID8gaW5zZXJ0SW1wb3J0KFxuICAgICAgICAgIHNvdXJjZSxcbiAgICAgICAgICBjb21wb25lbnRQYXRoLFxuICAgICAgICAgIGAqIGFzIGZyb21TdG9yZWAsXG4gICAgICAgICAgc3RhdGVJbXBvcnRQYXRoLFxuICAgICAgICAgIHRydWVcbiAgICAgICAgKVxuICAgICAgOiBuZXcgTm9vcENoYW5nZSgpO1xuXG4gICAgY29uc3QgY29tcG9uZW50Q2xhc3MgPSBzb3VyY2Uuc3RhdGVtZW50cy5maW5kKFxuICAgICAgc3RtID0+IHN0bS5raW5kID09PSB0cy5TeW50YXhLaW5kLkNsYXNzRGVjbGFyYXRpb25cbiAgICApO1xuICAgIGNvbnN0IGNvbXBvbmVudCA9IGNvbXBvbmVudENsYXNzIGFzIHRzLkNsYXNzRGVjbGFyYXRpb247XG4gICAgY29uc3QgY29tcG9uZW50Q29uc3RydWN0b3IgPSBjb21wb25lbnQubWVtYmVycy5maW5kKFxuICAgICAgbWVtYmVyID0+IG1lbWJlci5raW5kID09PSB0cy5TeW50YXhLaW5kLkNvbnN0cnVjdG9yXG4gICAgKTtcbiAgICBjb25zdCBjbXBDdHIgPSBjb21wb25lbnRDb25zdHJ1Y3RvciBhcyB0cy5Db25zdHJ1Y3RvckRlY2xhcmF0aW9uO1xuICAgIGNvbnN0IHsgcG9zIH0gPSBjbXBDdHI7XG4gICAgY29uc3Qgc3RhdGVUeXBlID0gb3B0aW9ucy5zdGF0ZVxuICAgICAgPyBgZnJvbVN0b3JlLiR7b3B0aW9ucy5zdGF0ZUludGVyZmFjZX1gXG4gICAgICA6ICdhbnknO1xuICAgIGNvbnN0IGNvbnN0cnVjdG9yVGV4dCA9IGNtcEN0ci5nZXRUZXh0KCk7XG4gICAgY29uc3QgW3N0YXJ0LCBlbmRdID0gY29uc3RydWN0b3JUZXh0LnNwbGl0KCcoKScpO1xuICAgIGNvbnN0IHN0b3JlVGV4dCA9IGBwcml2YXRlIHN0b3JlOiBTdG9yZTwke3N0YXRlVHlwZX0+YDtcbiAgICBjb25zdCBzdG9yZUNvbnN0cnVjdG9yID0gW3N0YXJ0LCBgKCR7c3RvcmVUZXh0fSlgLCBlbmRdLmpvaW4oJycpO1xuICAgIGNvbnN0IGNvbnN0cnVjdG9yVXBkYXRlID0gbmV3IFJlcGxhY2VDaGFuZ2UoXG4gICAgICBjb21wb25lbnRQYXRoLFxuICAgICAgcG9zLFxuICAgICAgYCAgJHtjb25zdHJ1Y3RvclRleHR9XFxuXFxuYCxcbiAgICAgIGBcXG5cXG4gICR7c3RvcmVDb25zdHJ1Y3Rvcn1gXG4gICAgKTtcblxuICAgIGNvbnN0IGNoYW5nZXMgPSBbc3RvcmVJbXBvcnQsIHN0YXRlSW1wb3J0LCBjb25zdHJ1Y3RvclVwZGF0ZV07XG4gICAgY29uc3QgcmVjb3JkZXIgPSBob3N0LmJlZ2luVXBkYXRlKGNvbXBvbmVudFBhdGgpO1xuXG4gICAgZm9yIChjb25zdCBjaGFuZ2Ugb2YgY2hhbmdlcykge1xuICAgICAgaWYgKGNoYW5nZSBpbnN0YW5jZW9mIEluc2VydENoYW5nZSkge1xuICAgICAgICByZWNvcmRlci5pbnNlcnRMZWZ0KGNoYW5nZS5wb3MsIGNoYW5nZS50b0FkZCk7XG4gICAgICB9IGVsc2UgaWYgKGNoYW5nZSBpbnN0YW5jZW9mIFJlcGxhY2VDaGFuZ2UpIHtcbiAgICAgICAgcmVjb3JkZXIucmVtb3ZlKHBvcywgY2hhbmdlLm9sZFRleHQubGVuZ3RoKTtcbiAgICAgICAgcmVjb3JkZXIuaW5zZXJ0TGVmdChjaGFuZ2Uub3JkZXIsIGNoYW5nZS5uZXdUZXh0KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBob3N0LmNvbW1pdFVwZGF0ZShyZWNvcmRlcik7XG5cbiAgICByZXR1cm4gaG9zdDtcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24ob3B0aW9uczogQ29udGFpbmVyT3B0aW9ucyk6IFJ1bGUge1xuICByZXR1cm4gKGhvc3Q6IFRyZWUsIGNvbnRleHQ6IFNjaGVtYXRpY0NvbnRleHQpID0+IHtcbiAgICBjb25zdCBzb3VyY2VEaXIgPSBvcHRpb25zLnNvdXJjZURpcjtcblxuICAgIGlmICghc291cmNlRGlyKSB7XG4gICAgICB0aHJvdyBuZXcgU2NoZW1hdGljc0V4Y2VwdGlvbihgc291cmNlRGlyIG9wdGlvbiBpcyByZXF1aXJlZC5gKTtcbiAgICB9XG5cbiAgICBjb25zdCBvcHRzID0gWydzdGF0ZScsICdzdGF0ZUludGVyZmFjZSddLnJlZHVjZShcbiAgICAgIChjdXJyZW50OiBQYXJ0aWFsPENvbnRhaW5lck9wdGlvbnM+LCBrZXkpID0+IHtcbiAgICAgICAgcmV0dXJuIG9taXQoY3VycmVudCwga2V5IGFzIGFueSk7XG4gICAgICB9LFxuICAgICAgb3B0aW9uc1xuICAgICk7XG5cbiAgICBjb25zdCB0ZW1wbGF0ZVNvdXJjZSA9IGFwcGx5KHVybCgnLi9maWxlcycpLCBbXG4gICAgICBvcHRpb25zLnNwZWMgPyBub29wKCkgOiBmaWx0ZXIocGF0aCA9PiAhcGF0aC5lbmRzV2l0aCgnX19zcGVjLnRzJykpLFxuICAgICAgdGVtcGxhdGUoe1xuICAgICAgICAnaWYtZmxhdCc6IChzOiBzdHJpbmcpID0+IChvcHRpb25zLmZsYXQgPyAnJyA6IHMpLFxuICAgICAgICAuLi5zdHJpbmdVdGlscyxcbiAgICAgICAgLi4uKG9wdGlvbnMgYXMgb2JqZWN0KSxcbiAgICAgICAgZG90OiAoKSA9PiAnLicsXG4gICAgICB9IGFzIGFueSksXG4gICAgICBtb3ZlKHNvdXJjZURpciksXG4gICAgXSk7XG5cbiAgICByZXR1cm4gY2hhaW4oW1xuICAgICAgZXh0ZXJuYWxTY2hlbWF0aWMoJ0BzY2hlbWF0aWNzL2FuZ3VsYXInLCAnY29tcG9uZW50Jywge1xuICAgICAgICAuLi5vcHRzLFxuICAgICAgICBzcGVjOiBmYWxzZSxcbiAgICAgIH0pLFxuICAgICAgYWRkU3RhdGVUb0NvbXBvbmVudChvcHRpb25zKSxcbiAgICAgIG1lcmdlV2l0aCh0ZW1wbGF0ZVNvdXJjZSksXG4gICAgXSkoaG9zdCwgY29udGV4dCk7XG4gIH07XG59XG4iXX0=