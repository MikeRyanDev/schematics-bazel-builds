var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@ngrx/schematics/src/action/index", ["require", "exports", "@angular-devkit/core", "@angular-devkit/schematics", "@ngrx/schematics/src/utility/strings"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular-devkit/core");
    var schematics_1 = require("@angular-devkit/schematics");
    var stringUtils = require("@ngrx/schematics/src/utility/strings");
    exports.ActionOptions = require('./schema.json');
    function default_1(options) {
        options.path = options.path ? core_1.normalize(options.path) : options.path;
        var sourceDir = options.sourceDir;
        if (!sourceDir) {
            throw new schematics_1.SchematicsException("sourceDir option is required.");
        }
        var templateSource = schematics_1.apply(schematics_1.url('./files'), [
            options.spec ? schematics_1.noop() : schematics_1.filter(function (path) { return !path.endsWith('__spec.ts'); }),
            schematics_1.template(__assign({ 'if-flat': function (s) {
                    return stringUtils.group(options.flat ? '' : s, options.group ? 'actions' : '');
                } }, stringUtils, options, { dot: function () { return '.'; } })),
            schematics_1.move(sourceDir),
        ]);
        return schematics_1.chain([schematics_1.branchAndMerge(schematics_1.chain([schematics_1.mergeWith(templateSource)]))]);
    }
    exports.default = default_1;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL3NjaGVtYXRpY3Mvc3JjL2FjdGlvbi9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBQUEsNkNBQWlEO0lBQ2pELHlEQVlvQztJQUNwQyxrRUFBa0Q7SUFFckMsUUFBQSxhQUFhLEdBQUcsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0lBY3RELG1CQUF3QixPQUFzQjtRQUM1QyxPQUFPLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLGdCQUFTLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO1FBQ3JFLElBQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUM7UUFDcEMsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ2YsTUFBTSxJQUFJLGdDQUFtQixDQUFDLCtCQUErQixDQUFDLENBQUM7UUFDakUsQ0FBQztRQUVELElBQU0sY0FBYyxHQUFHLGtCQUFLLENBQUMsZ0JBQUcsQ0FBQyxTQUFTLENBQUMsRUFBRTtZQUMzQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxpQkFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLG1CQUFNLENBQUMsVUFBQSxJQUFJLElBQUksT0FBQSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLEVBQTNCLENBQTJCLENBQUM7WUFDbkUscUJBQVEsQ0FBQyxXQUNQLFNBQVMsRUFBRSxVQUFDLENBQVM7b0JBQ25CLE9BQUEsV0FBVyxDQUFDLEtBQUssQ0FDZixPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDckIsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQy9CO2dCQUhELENBR0MsSUFDQSxXQUFXLEVBQ1YsT0FBa0IsSUFDdEIsR0FBRyxFQUFFLGNBQU0sT0FBQSxHQUFHLEVBQUgsQ0FBRyxHQUNSLENBQUM7WUFDVCxpQkFBSSxDQUFDLFNBQVMsQ0FBQztTQUNoQixDQUFDLENBQUM7UUFFSCxNQUFNLENBQUMsa0JBQUssQ0FBQyxDQUFDLDJCQUFjLENBQUMsa0JBQUssQ0FBQyxDQUFDLHNCQUFTLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3JFLENBQUM7SUF2QkQsNEJBdUJDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgbm9ybWFsaXplIH0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L2NvcmUnO1xuaW1wb3J0IHtcbiAgUnVsZSxcbiAgU2NoZW1hdGljc0V4Y2VwdGlvbixcbiAgYXBwbHksXG4gIGJyYW5jaEFuZE1lcmdlLFxuICBjaGFpbixcbiAgZmlsdGVyLFxuICBtZXJnZVdpdGgsXG4gIG1vdmUsXG4gIG5vb3AsXG4gIHRlbXBsYXRlLFxuICB1cmwsXG59IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9zY2hlbWF0aWNzJztcbmltcG9ydCAqIGFzIHN0cmluZ1V0aWxzIGZyb20gJy4uL3V0aWxpdHkvc3RyaW5ncyc7XG5cbmV4cG9ydCBjb25zdCBBY3Rpb25PcHRpb25zID0gcmVxdWlyZSgnLi9zY2hlbWEuanNvbicpO1xuZXhwb3J0IHR5cGUgQWN0aW9uT3B0aW9ucyA9IHtcbiAgbmFtZTogc3RyaW5nO1xuICBhcHBSb290Pzogc3RyaW5nO1xuICBwYXRoPzogc3RyaW5nO1xuICBzb3VyY2VEaXI/OiBzdHJpbmc7XG4gIC8qKlxuICAgKiBTcGVjaWZpZXMgaWYgYSBzcGVjIGZpbGUgaXMgZ2VuZXJhdGVkLlxuICAgKi9cbiAgc3BlYz86IGJvb2xlYW47XG4gIGZsYXQ/OiBib29sZWFuO1xuICBncm91cD86IGJvb2xlYW47XG59O1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihvcHRpb25zOiBBY3Rpb25PcHRpb25zKTogUnVsZSB7XG4gIG9wdGlvbnMucGF0aCA9IG9wdGlvbnMucGF0aCA/IG5vcm1hbGl6ZShvcHRpb25zLnBhdGgpIDogb3B0aW9ucy5wYXRoO1xuICBjb25zdCBzb3VyY2VEaXIgPSBvcHRpb25zLnNvdXJjZURpcjtcbiAgaWYgKCFzb3VyY2VEaXIpIHtcbiAgICB0aHJvdyBuZXcgU2NoZW1hdGljc0V4Y2VwdGlvbihgc291cmNlRGlyIG9wdGlvbiBpcyByZXF1aXJlZC5gKTtcbiAgfVxuXG4gIGNvbnN0IHRlbXBsYXRlU291cmNlID0gYXBwbHkodXJsKCcuL2ZpbGVzJyksIFtcbiAgICBvcHRpb25zLnNwZWMgPyBub29wKCkgOiBmaWx0ZXIocGF0aCA9PiAhcGF0aC5lbmRzV2l0aCgnX19zcGVjLnRzJykpLFxuICAgIHRlbXBsYXRlKHtcbiAgICAgICdpZi1mbGF0JzogKHM6IHN0cmluZykgPT5cbiAgICAgICAgc3RyaW5nVXRpbHMuZ3JvdXAoXG4gICAgICAgICAgb3B0aW9ucy5mbGF0ID8gJycgOiBzLFxuICAgICAgICAgIG9wdGlvbnMuZ3JvdXAgPyAnYWN0aW9ucycgOiAnJ1xuICAgICAgICApLFxuICAgICAgLi4uc3RyaW5nVXRpbHMsXG4gICAgICAuLi4ob3B0aW9ucyBhcyBvYmplY3QpLFxuICAgICAgZG90OiAoKSA9PiAnLicsXG4gICAgfSBhcyBhbnkpLFxuICAgIG1vdmUoc291cmNlRGlyKSxcbiAgXSk7XG5cbiAgcmV0dXJuIGNoYWluKFticmFuY2hBbmRNZXJnZShjaGFpbihbbWVyZ2VXaXRoKHRlbXBsYXRlU291cmNlKV0pKV0pO1xufVxuIl19