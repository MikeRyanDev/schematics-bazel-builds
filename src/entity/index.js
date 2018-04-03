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
        define("@ngrx/schematics/src/entity/index", ["require", "exports", "@angular-devkit/core", "@angular-devkit/schematics", "@ngrx/schematics/src/utility/strings", "@ngrx/schematics/src/utility/ngrx-utils", "@ngrx/schematics/src/utility/find-module"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular-devkit/core");
    var schematics_1 = require("@angular-devkit/schematics");
    var stringUtils = require("@ngrx/schematics/src/utility/strings");
    var ngrx_utils_1 = require("@ngrx/schematics/src/utility/ngrx-utils");
    var find_module_1 = require("@ngrx/schematics/src/utility/find-module");
    exports.EntityOptions = require('./schema.json');
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
                schematics_1.template(__assign({}, stringUtils, { 'if-flat': function (s) { return (options.flat ? '' : s); }, 'group-actions': function (name) {
                        return stringUtils.group(name, options.group ? 'actions' : '');
                    }, 'group-models': function (name) {
                        return stringUtils.group(name, options.group ? 'models' : '');
                    }, 'group-reducers': function (s) {
                        return stringUtils.group(s, options.group ? 'reducers' : '');
                    } }, options, { dot: function () { return '.'; } })),
                schematics_1.move(sourceDir),
            ]);
            return schematics_1.chain([
                ngrx_utils_1.addReducerToState(__assign({}, options)),
                ngrx_utils_1.addReducerImportToNgModule(__assign({}, options)),
                schematics_1.branchAndMerge(schematics_1.chain([schematics_1.mergeWith(templateSource)])),
            ])(host, context);
        };
    }
    exports.default = default_1;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL3NjaGVtYXRpY3Mvc3JjL2VudGl0eS9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBQUEsNkNBQWlEO0lBQ2pELHlEQWNvQztJQUNwQyxrRUFBa0Q7SUFDbEQsc0VBRytCO0lBQy9CLHdFQUErRDtJQUVsRCxRQUFBLGFBQWEsR0FBRyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7SUFnQnRELG1CQUF3QixPQUFzQjtRQUM1QyxPQUFPLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLGdCQUFTLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO1FBQ3JFLElBQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUM7UUFDcEMsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ2YsTUFBTSxJQUFJLGdDQUFtQixDQUFDLCtCQUErQixDQUFDLENBQUM7UUFDakUsQ0FBQztRQUVELE1BQU0sQ0FBQyxVQUFDLElBQVUsRUFBRSxPQUF5QjtZQUMzQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDbkIsT0FBTyxDQUFDLE1BQU0sR0FBRyxtQ0FBcUIsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDeEQsQ0FBQztZQUVELElBQU0sY0FBYyxHQUFHLGtCQUFLLENBQUMsZ0JBQUcsQ0FBQyxTQUFTLENBQUMsRUFBRTtnQkFDM0MsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsaUJBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxtQkFBTSxDQUFDLFVBQUEsSUFBSSxJQUFJLE9BQUEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxFQUEzQixDQUEyQixDQUFDO2dCQUNuRSxxQkFBUSxDQUFDLGFBQ0osV0FBVyxJQUNkLFNBQVMsRUFBRSxVQUFDLENBQVMsSUFBSyxPQUFBLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBdkIsQ0FBdUIsRUFDakQsZUFBZSxFQUFFLFVBQUMsSUFBWTt3QkFDNUIsT0FBQSxXQUFXLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztvQkFBdkQsQ0FBdUQsRUFDekQsY0FBYyxFQUFFLFVBQUMsSUFBWTt3QkFDM0IsT0FBQSxXQUFXLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztvQkFBdEQsQ0FBc0QsRUFDeEQsZ0JBQWdCLEVBQUUsVUFBQyxDQUFTO3dCQUMxQixPQUFBLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO29CQUFyRCxDQUFxRCxJQUNuRCxPQUFrQixJQUN0QixHQUFHLEVBQUUsY0FBTSxPQUFBLEdBQUcsRUFBSCxDQUFHLEdBQ1IsQ0FBQztnQkFDVCxpQkFBSSxDQUFDLFNBQVMsQ0FBQzthQUNoQixDQUFDLENBQUM7WUFFSCxNQUFNLENBQUMsa0JBQUssQ0FBQztnQkFDWCw4QkFBaUIsY0FBTSxPQUFPLEVBQUc7Z0JBQ2pDLHVDQUEwQixjQUFNLE9BQU8sRUFBRztnQkFDMUMsMkJBQWMsQ0FBQyxrQkFBSyxDQUFDLENBQUMsc0JBQVMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDbkQsQ0FBQyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNwQixDQUFDLENBQUM7SUFDSixDQUFDO0lBbkNELDRCQW1DQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IG5vcm1hbGl6ZSB9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9jb3JlJztcbmltcG9ydCB7XG4gIFJ1bGUsXG4gIFNjaGVtYXRpY3NFeGNlcHRpb24sXG4gIGFwcGx5LFxuICBicmFuY2hBbmRNZXJnZSxcbiAgY2hhaW4sXG4gIGZpbHRlcixcbiAgbWVyZ2VXaXRoLFxuICBtb3ZlLFxuICBub29wLFxuICB0ZW1wbGF0ZSxcbiAgdXJsLFxuICBUcmVlLFxuICBTY2hlbWF0aWNDb250ZXh0LFxufSBmcm9tICdAYW5ndWxhci1kZXZraXQvc2NoZW1hdGljcyc7XG5pbXBvcnQgKiBhcyBzdHJpbmdVdGlscyBmcm9tICcuLi91dGlsaXR5L3N0cmluZ3MnO1xuaW1wb3J0IHtcbiAgYWRkUmVkdWNlclRvU3RhdGUsXG4gIGFkZFJlZHVjZXJJbXBvcnRUb05nTW9kdWxlLFxufSBmcm9tICcuLi91dGlsaXR5L25ncngtdXRpbHMnO1xuaW1wb3J0IHsgZmluZE1vZHVsZUZyb21PcHRpb25zIH0gZnJvbSAnLi4vdXRpbGl0eS9maW5kLW1vZHVsZSc7XG5cbmV4cG9ydCBjb25zdCBFbnRpdHlPcHRpb25zID0gcmVxdWlyZSgnLi9zY2hlbWEuanNvbicpO1xuZXhwb3J0IHR5cGUgRW50aXR5T3B0aW9ucyA9IHtcbiAgbmFtZTogc3RyaW5nO1xuICBhcHBSb290Pzogc3RyaW5nO1xuICBwYXRoPzogc3RyaW5nO1xuICBzb3VyY2VEaXI/OiBzdHJpbmc7XG4gIC8qKlxuICAgKiBTcGVjaWZpZXMgaWYgYSBzcGVjIGZpbGUgaXMgZ2VuZXJhdGVkLlxuICAgKi9cbiAgc3BlYz86IGJvb2xlYW47XG4gIG1vZHVsZT86IHN0cmluZztcbiAgcmVkdWNlcnM/OiBzdHJpbmc7XG4gIGZsYXQ/OiBib29sZWFuO1xuICBncm91cD86IGJvb2xlYW47XG59O1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihvcHRpb25zOiBFbnRpdHlPcHRpb25zKTogUnVsZSB7XG4gIG9wdGlvbnMucGF0aCA9IG9wdGlvbnMucGF0aCA/IG5vcm1hbGl6ZShvcHRpb25zLnBhdGgpIDogb3B0aW9ucy5wYXRoO1xuICBjb25zdCBzb3VyY2VEaXIgPSBvcHRpb25zLnNvdXJjZURpcjtcbiAgaWYgKCFzb3VyY2VEaXIpIHtcbiAgICB0aHJvdyBuZXcgU2NoZW1hdGljc0V4Y2VwdGlvbihgc291cmNlRGlyIG9wdGlvbiBpcyByZXF1aXJlZC5gKTtcbiAgfVxuXG4gIHJldHVybiAoaG9zdDogVHJlZSwgY29udGV4dDogU2NoZW1hdGljQ29udGV4dCkgPT4ge1xuICAgIGlmIChvcHRpb25zLm1vZHVsZSkge1xuICAgICAgb3B0aW9ucy5tb2R1bGUgPSBmaW5kTW9kdWxlRnJvbU9wdGlvbnMoaG9zdCwgb3B0aW9ucyk7XG4gICAgfVxuXG4gICAgY29uc3QgdGVtcGxhdGVTb3VyY2UgPSBhcHBseSh1cmwoJy4vZmlsZXMnKSwgW1xuICAgICAgb3B0aW9ucy5zcGVjID8gbm9vcCgpIDogZmlsdGVyKHBhdGggPT4gIXBhdGguZW5kc1dpdGgoJ19fc3BlYy50cycpKSxcbiAgICAgIHRlbXBsYXRlKHtcbiAgICAgICAgLi4uc3RyaW5nVXRpbHMsXG4gICAgICAgICdpZi1mbGF0JzogKHM6IHN0cmluZykgPT4gKG9wdGlvbnMuZmxhdCA/ICcnIDogcyksXG4gICAgICAgICdncm91cC1hY3Rpb25zJzogKG5hbWU6IHN0cmluZykgPT5cbiAgICAgICAgICBzdHJpbmdVdGlscy5ncm91cChuYW1lLCBvcHRpb25zLmdyb3VwID8gJ2FjdGlvbnMnIDogJycpLFxuICAgICAgICAnZ3JvdXAtbW9kZWxzJzogKG5hbWU6IHN0cmluZykgPT5cbiAgICAgICAgICBzdHJpbmdVdGlscy5ncm91cChuYW1lLCBvcHRpb25zLmdyb3VwID8gJ21vZGVscycgOiAnJyksXG4gICAgICAgICdncm91cC1yZWR1Y2Vycyc6IChzOiBzdHJpbmcpID0+XG4gICAgICAgICAgc3RyaW5nVXRpbHMuZ3JvdXAocywgb3B0aW9ucy5ncm91cCA/ICdyZWR1Y2VycycgOiAnJyksXG4gICAgICAgIC4uLihvcHRpb25zIGFzIG9iamVjdCksXG4gICAgICAgIGRvdDogKCkgPT4gJy4nLFxuICAgICAgfSBhcyBhbnkpLFxuICAgICAgbW92ZShzb3VyY2VEaXIpLFxuICAgIF0pO1xuXG4gICAgcmV0dXJuIGNoYWluKFtcbiAgICAgIGFkZFJlZHVjZXJUb1N0YXRlKHsgLi4ub3B0aW9ucyB9KSxcbiAgICAgIGFkZFJlZHVjZXJJbXBvcnRUb05nTW9kdWxlKHsgLi4ub3B0aW9ucyB9KSxcbiAgICAgIGJyYW5jaEFuZE1lcmdlKGNoYWluKFttZXJnZVdpdGgodGVtcGxhdGVTb3VyY2UpXSkpLFxuICAgIF0pKGhvc3QsIGNvbnRleHQpO1xuICB9O1xufVxuIl19