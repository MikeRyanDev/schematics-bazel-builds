(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@ngrx/schematics/src/feature/index", ["require", "exports", "@angular-devkit/schematics"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var schematics_1 = require("@angular-devkit/schematics");
    exports.FeatureOptions = require('./schema.json');
    function default_1(options) {
        return function (host, context) {
            return schematics_1.chain([
                schematics_1.schematic('action', {
                    flat: options.flat,
                    group: options.group,
                    name: options.name,
                    path: options.path,
                    sourceDir: options.sourceDir,
                    spec: false,
                }),
                schematics_1.schematic('reducer', {
                    flat: options.flat,
                    group: options.group,
                    module: options.module,
                    name: options.name,
                    path: options.path,
                    sourceDir: options.sourceDir,
                    spec: options.spec,
                    reducers: options.reducers,
                    feature: true,
                }),
                schematics_1.schematic('effect', {
                    flat: options.flat,
                    group: options.group,
                    module: options.module,
                    name: options.name,
                    path: options.path,
                    sourceDir: options.sourceDir,
                    spec: options.spec,
                    feature: true,
                }),
            ])(host, context);
        };
    }
    exports.default = default_1;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL3NjaGVtYXRpY3Mvc3JjL2ZlYXR1cmUvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7SUFBQSx5REFNb0M7SUFFdkIsUUFBQSxjQUFjLEdBQUcsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0lBWXZELG1CQUF3QixPQUF1QjtRQUM3QyxNQUFNLENBQUMsVUFBQyxJQUFVLEVBQUUsT0FBeUI7WUFDM0MsTUFBTSxDQUFDLGtCQUFLLENBQUM7Z0JBQ1gsc0JBQVMsQ0FBQyxRQUFRLEVBQUU7b0JBQ2xCLElBQUksRUFBRSxPQUFPLENBQUMsSUFBSTtvQkFDbEIsS0FBSyxFQUFFLE9BQU8sQ0FBQyxLQUFLO29CQUNwQixJQUFJLEVBQUUsT0FBTyxDQUFDLElBQUk7b0JBQ2xCLElBQUksRUFBRSxPQUFPLENBQUMsSUFBSTtvQkFDbEIsU0FBUyxFQUFFLE9BQU8sQ0FBQyxTQUFTO29CQUM1QixJQUFJLEVBQUUsS0FBSztpQkFDWixDQUFDO2dCQUNGLHNCQUFTLENBQUMsU0FBUyxFQUFFO29CQUNuQixJQUFJLEVBQUUsT0FBTyxDQUFDLElBQUk7b0JBQ2xCLEtBQUssRUFBRSxPQUFPLENBQUMsS0FBSztvQkFDcEIsTUFBTSxFQUFFLE9BQU8sQ0FBQyxNQUFNO29CQUN0QixJQUFJLEVBQUUsT0FBTyxDQUFDLElBQUk7b0JBQ2xCLElBQUksRUFBRSxPQUFPLENBQUMsSUFBSTtvQkFDbEIsU0FBUyxFQUFFLE9BQU8sQ0FBQyxTQUFTO29CQUM1QixJQUFJLEVBQUUsT0FBTyxDQUFDLElBQUk7b0JBQ2xCLFFBQVEsRUFBRSxPQUFPLENBQUMsUUFBUTtvQkFDMUIsT0FBTyxFQUFFLElBQUk7aUJBQ2QsQ0FBQztnQkFDRixzQkFBUyxDQUFDLFFBQVEsRUFBRTtvQkFDbEIsSUFBSSxFQUFFLE9BQU8sQ0FBQyxJQUFJO29CQUNsQixLQUFLLEVBQUUsT0FBTyxDQUFDLEtBQUs7b0JBQ3BCLE1BQU0sRUFBRSxPQUFPLENBQUMsTUFBTTtvQkFDdEIsSUFBSSxFQUFFLE9BQU8sQ0FBQyxJQUFJO29CQUNsQixJQUFJLEVBQUUsT0FBTyxDQUFDLElBQUk7b0JBQ2xCLFNBQVMsRUFBRSxPQUFPLENBQUMsU0FBUztvQkFDNUIsSUFBSSxFQUFFLE9BQU8sQ0FBQyxJQUFJO29CQUNsQixPQUFPLEVBQUUsSUFBSTtpQkFDZCxDQUFDO2FBQ0gsQ0FBQyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNwQixDQUFDLENBQUM7SUFDSixDQUFDO0lBbENELDRCQWtDQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIFJ1bGUsXG4gIFNjaGVtYXRpY0NvbnRleHQsXG4gIFRyZWUsXG4gIGNoYWluLFxuICBzY2hlbWF0aWMsXG59IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9zY2hlbWF0aWNzJztcblxuZXhwb3J0IGNvbnN0IEZlYXR1cmVPcHRpb25zID0gcmVxdWlyZSgnLi9zY2hlbWEuanNvbicpO1xuZXhwb3J0IHR5cGUgRmVhdHVyZU9wdGlvbnMgPSB7XG4gIHBhdGg/OiBzdHJpbmc7XG4gIHNvdXJjZURpcj86IHN0cmluZztcbiAgbmFtZTogc3RyaW5nO1xuICBtb2R1bGU/OiBzdHJpbmc7XG4gIGZsYXQ/OiBib29sZWFuO1xuICBzcGVjPzogYm9vbGVhbjtcbiAgcmVkdWNlcnM/OiBzdHJpbmc7XG4gIGdyb3VwPzogYm9vbGVhbjtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG9wdGlvbnM6IEZlYXR1cmVPcHRpb25zKTogUnVsZSB7XG4gIHJldHVybiAoaG9zdDogVHJlZSwgY29udGV4dDogU2NoZW1hdGljQ29udGV4dCkgPT4ge1xuICAgIHJldHVybiBjaGFpbihbXG4gICAgICBzY2hlbWF0aWMoJ2FjdGlvbicsIHtcbiAgICAgICAgZmxhdDogb3B0aW9ucy5mbGF0LFxuICAgICAgICBncm91cDogb3B0aW9ucy5ncm91cCxcbiAgICAgICAgbmFtZTogb3B0aW9ucy5uYW1lLFxuICAgICAgICBwYXRoOiBvcHRpb25zLnBhdGgsXG4gICAgICAgIHNvdXJjZURpcjogb3B0aW9ucy5zb3VyY2VEaXIsXG4gICAgICAgIHNwZWM6IGZhbHNlLFxuICAgICAgfSksXG4gICAgICBzY2hlbWF0aWMoJ3JlZHVjZXInLCB7XG4gICAgICAgIGZsYXQ6IG9wdGlvbnMuZmxhdCxcbiAgICAgICAgZ3JvdXA6IG9wdGlvbnMuZ3JvdXAsXG4gICAgICAgIG1vZHVsZTogb3B0aW9ucy5tb2R1bGUsXG4gICAgICAgIG5hbWU6IG9wdGlvbnMubmFtZSxcbiAgICAgICAgcGF0aDogb3B0aW9ucy5wYXRoLFxuICAgICAgICBzb3VyY2VEaXI6IG9wdGlvbnMuc291cmNlRGlyLFxuICAgICAgICBzcGVjOiBvcHRpb25zLnNwZWMsXG4gICAgICAgIHJlZHVjZXJzOiBvcHRpb25zLnJlZHVjZXJzLFxuICAgICAgICBmZWF0dXJlOiB0cnVlLFxuICAgICAgfSksXG4gICAgICBzY2hlbWF0aWMoJ2VmZmVjdCcsIHtcbiAgICAgICAgZmxhdDogb3B0aW9ucy5mbGF0LFxuICAgICAgICBncm91cDogb3B0aW9ucy5ncm91cCxcbiAgICAgICAgbW9kdWxlOiBvcHRpb25zLm1vZHVsZSxcbiAgICAgICAgbmFtZTogb3B0aW9ucy5uYW1lLFxuICAgICAgICBwYXRoOiBvcHRpb25zLnBhdGgsXG4gICAgICAgIHNvdXJjZURpcjogb3B0aW9ucy5zb3VyY2VEaXIsXG4gICAgICAgIHNwZWM6IG9wdGlvbnMuc3BlYyxcbiAgICAgICAgZmVhdHVyZTogdHJ1ZSxcbiAgICAgIH0pLFxuICAgIF0pKGhvc3QsIGNvbnRleHQpO1xuICB9O1xufVxuIl19