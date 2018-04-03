(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@ngrx/schematics/src/utility/find-module", ["require", "exports", "@angular-devkit/core", "@ngrx/schematics/src/utility/strings"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var core_1 = require("@angular-devkit/core");
    var strings_1 = require("@ngrx/schematics/src/utility/strings");
    /**
     * Find the module referred by a set of options passed to the schematics.
     */
    function findModuleFromOptions(host, options) {
        if (options.hasOwnProperty('skipImport') && options.skipImport) {
            return undefined;
        }
        if (!options.module) {
            var pathToCheck = (options.sourceDir || '') +
                '/' +
                (options.path || '') +
                (options.flat ? '' : '/' + strings_1.dasherize(options.name));
            return core_1.normalize(findModule(host, pathToCheck));
        }
        else {
            var modulePath = core_1.normalize('/' +
                options.sourceDir +
                '/' +
                (options.appRoot || options.path) +
                '/' +
                options.module);
            var moduleBaseName = core_1.normalize(modulePath)
                .split('/')
                .pop();
            if (host.exists(modulePath)) {
                return core_1.normalize(modulePath);
            }
            else if (host.exists(modulePath + '.ts')) {
                return core_1.normalize(modulePath + '.ts');
            }
            else if (host.exists(modulePath + '.module.ts')) {
                return core_1.normalize(modulePath + '.module.ts');
            }
            else if (host.exists(modulePath + '/' + moduleBaseName + '.module.ts')) {
                return core_1.normalize(modulePath + '/' + moduleBaseName + '.module.ts');
            }
            else {
                throw new Error('Specified module does not exist');
            }
        }
    }
    exports.findModuleFromOptions = findModuleFromOptions;
    /**
     * Function to find the "closest" module to a generated file's path.
     */
    function findModule(host, generateDir) {
        var dir = host.getDir('/' + generateDir);
        var moduleRe = /\.module\.ts$/;
        var routingModuleRe = /-routing\.module\.ts/;
        while (dir) {
            var matches = dir.subfiles.filter(function (p) { return moduleRe.test(p) && !routingModuleRe.test(p); });
            if (matches.length == 1) {
                return core_1.join(dir.path, matches[0]);
            }
            else if (matches.length > 1) {
                throw new Error('More than one module matches. Use skip-import option to skip importing ' +
                    'the component into the closest module.');
            }
            dir = dir.parent;
        }
        throw new Error('Could not find an NgModule for the new component. Use the skip-import ' +
            'option to skip importing components in NgModule.');
    }
    exports.findModule = findModule;
    /**
     * Build a relative path from one file path to another file path.
     */
    function buildRelativePath(from, to) {
        from = core_1.normalize(from);
        to = core_1.normalize(to);
        // Convert to arrays.
        var fromParts = from.split('/');
        var toParts = to.split('/');
        // Remove file names (preserving destination)
        fromParts.pop();
        var toFileName = toParts.pop();
        var relativePath = core_1.relative(core_1.normalize(fromParts.join('/')), core_1.normalize(toParts.join('/')));
        var pathPrefix = '';
        // Set the path prefix for same dir or child dir, parent dir starts with `..`
        if (!relativePath) {
            pathPrefix = '.';
        }
        else if (!relativePath.startsWith('.')) {
            pathPrefix = "./";
        }
        if (pathPrefix && !pathPrefix.endsWith('/')) {
            pathPrefix += '/';
        }
        return pathPrefix + (relativePath ? relativePath + '/' : '') + toFileName;
    }
    exports.buildRelativePath = buildRelativePath;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmluZC1tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL3NjaGVtYXRpY3Mvc3JjL3V0aWxpdHkvZmluZC1tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7SUFBQTs7Ozs7O09BTUc7SUFDSCw2Q0FBdUU7SUFFdkUsZ0VBQXNDO0lBWXRDOztPQUVHO0lBQ0gsK0JBQ0UsSUFBVSxFQUNWLE9BQXNCO1FBRXRCLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUFDLElBQUksT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDL0QsTUFBTSxDQUFDLFNBQVMsQ0FBQztRQUNuQixDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNwQixJQUFNLFdBQVcsR0FDZixDQUFDLE9BQU8sQ0FBQyxTQUFTLElBQUksRUFBRSxDQUFDO2dCQUN6QixHQUFHO2dCQUNILENBQUMsT0FBTyxDQUFDLElBQUksSUFBSSxFQUFFLENBQUM7Z0JBQ3BCLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsbUJBQVMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUV0RCxNQUFNLENBQUMsZ0JBQVMsQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUM7UUFDbEQsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sSUFBTSxVQUFVLEdBQUcsZ0JBQVMsQ0FDMUIsR0FBRztnQkFDRCxPQUFPLENBQUMsU0FBUztnQkFDakIsR0FBRztnQkFDSCxDQUFDLE9BQU8sQ0FBQyxPQUFPLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQztnQkFDakMsR0FBRztnQkFDSCxPQUFPLENBQUMsTUFBTSxDQUNqQixDQUFDO1lBQ0YsSUFBTSxjQUFjLEdBQUcsZ0JBQVMsQ0FBQyxVQUFVLENBQUM7aUJBQ3pDLEtBQUssQ0FBQyxHQUFHLENBQUM7aUJBQ1YsR0FBRyxFQUFFLENBQUM7WUFFVCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDNUIsTUFBTSxDQUFDLGdCQUFTLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDL0IsQ0FBQztZQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzNDLE1BQU0sQ0FBQyxnQkFBUyxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUMsQ0FBQztZQUN2QyxDQUFDO1lBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxHQUFHLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbEQsTUFBTSxDQUFDLGdCQUFTLENBQUMsVUFBVSxHQUFHLFlBQVksQ0FBQyxDQUFDO1lBQzlDLENBQUM7WUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEdBQUcsR0FBRyxHQUFHLGNBQWMsR0FBRyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3pFLE1BQU0sQ0FBQyxnQkFBUyxDQUFDLFVBQVUsR0FBRyxHQUFHLEdBQUcsY0FBYyxHQUFHLFlBQVksQ0FBQyxDQUFDO1lBQ3JFLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDTixNQUFNLElBQUksS0FBSyxDQUFDLGlDQUFpQyxDQUFDLENBQUM7WUFDckQsQ0FBQztRQUNILENBQUM7SUFDSCxDQUFDO0lBekNELHNEQXlDQztJQUVEOztPQUVHO0lBQ0gsb0JBQTJCLElBQVUsRUFBRSxXQUFtQjtRQUN4RCxJQUFJLEdBQUcsR0FBb0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEdBQUcsV0FBVyxDQUFDLENBQUM7UUFFMUQsSUFBTSxRQUFRLEdBQUcsZUFBZSxDQUFDO1FBQ2pDLElBQU0sZUFBZSxHQUFHLHNCQUFzQixDQUFDO1FBRS9DLE9BQU8sR0FBRyxFQUFFLENBQUM7WUFDWCxJQUFNLE9BQU8sR0FBRyxHQUFHLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FDakMsVUFBQSxDQUFDLElBQUksT0FBQSxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBNUMsQ0FBNEMsQ0FDbEQsQ0FBQztZQUVGLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDeEIsTUFBTSxDQUFDLFdBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3BDLENBQUM7WUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM5QixNQUFNLElBQUksS0FBSyxDQUNiLHlFQUF5RTtvQkFDdkUsd0NBQXdDLENBQzNDLENBQUM7WUFDSixDQUFDO1lBRUQsR0FBRyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUM7UUFDbkIsQ0FBQztRQUVELE1BQU0sSUFBSSxLQUFLLENBQ2Isd0VBQXdFO1lBQ3RFLGtEQUFrRCxDQUNyRCxDQUFDO0lBQ0osQ0FBQztJQTNCRCxnQ0EyQkM7SUFFRDs7T0FFRztJQUNILDJCQUFrQyxJQUFZLEVBQUUsRUFBVTtRQUN4RCxJQUFJLEdBQUcsZ0JBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN2QixFQUFFLEdBQUcsZ0JBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUVuQixxQkFBcUI7UUFDckIsSUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNsQyxJQUFNLE9BQU8sR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRTlCLDZDQUE2QztRQUM3QyxTQUFTLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDaEIsSUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBRWpDLElBQU0sWUFBWSxHQUFHLGVBQVEsQ0FDM0IsZ0JBQVMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQzlCLGdCQUFTLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUM3QixDQUFDO1FBQ0YsSUFBSSxVQUFVLEdBQUcsRUFBRSxDQUFDO1FBRXBCLDZFQUE2RTtRQUM3RSxFQUFFLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7WUFDbEIsVUFBVSxHQUFHLEdBQUcsQ0FBQztRQUNuQixDQUFDO1FBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDekMsVUFBVSxHQUFHLElBQUksQ0FBQztRQUNwQixDQUFDO1FBQ0QsRUFBRSxDQUFDLENBQUMsVUFBVSxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDNUMsVUFBVSxJQUFJLEdBQUcsQ0FBQztRQUNwQixDQUFDO1FBRUQsTUFBTSxDQUFDLFVBQVUsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsWUFBWSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsVUFBVSxDQUFDO0lBQzVFLENBQUM7SUE3QkQsOENBNkJDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHsgUGF0aCwgam9pbiwgbm9ybWFsaXplLCByZWxhdGl2ZSB9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9jb3JlJztcbmltcG9ydCB7IERpckVudHJ5LCBUcmVlIH0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L3NjaGVtYXRpY3MnO1xuaW1wb3J0IHsgZGFzaGVyaXplIH0gZnJvbSAnLi9zdHJpbmdzJztcblxuZXhwb3J0IGludGVyZmFjZSBNb2R1bGVPcHRpb25zIHtcbiAgbW9kdWxlPzogc3RyaW5nO1xuICBuYW1lPzogc3RyaW5nO1xuICBmbGF0PzogYm9vbGVhbjtcbiAgc291cmNlRGlyPzogc3RyaW5nO1xuICBwYXRoPzogc3RyaW5nO1xuICBza2lwSW1wb3J0PzogYm9vbGVhbjtcbiAgYXBwUm9vdD86IHN0cmluZztcbn1cblxuLyoqXG4gKiBGaW5kIHRoZSBtb2R1bGUgcmVmZXJyZWQgYnkgYSBzZXQgb2Ygb3B0aW9ucyBwYXNzZWQgdG8gdGhlIHNjaGVtYXRpY3MuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmaW5kTW9kdWxlRnJvbU9wdGlvbnMoXG4gIGhvc3Q6IFRyZWUsXG4gIG9wdGlvbnM6IE1vZHVsZU9wdGlvbnNcbik6IFBhdGggfCB1bmRlZmluZWQge1xuICBpZiAob3B0aW9ucy5oYXNPd25Qcm9wZXJ0eSgnc2tpcEltcG9ydCcpICYmIG9wdGlvbnMuc2tpcEltcG9ydCkge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICBpZiAoIW9wdGlvbnMubW9kdWxlKSB7XG4gICAgY29uc3QgcGF0aFRvQ2hlY2sgPVxuICAgICAgKG9wdGlvbnMuc291cmNlRGlyIHx8ICcnKSArXG4gICAgICAnLycgK1xuICAgICAgKG9wdGlvbnMucGF0aCB8fCAnJykgK1xuICAgICAgKG9wdGlvbnMuZmxhdCA/ICcnIDogJy8nICsgZGFzaGVyaXplKG9wdGlvbnMubmFtZSkpO1xuXG4gICAgcmV0dXJuIG5vcm1hbGl6ZShmaW5kTW9kdWxlKGhvc3QsIHBhdGhUb0NoZWNrKSk7XG4gIH0gZWxzZSB7XG4gICAgY29uc3QgbW9kdWxlUGF0aCA9IG5vcm1hbGl6ZShcbiAgICAgICcvJyArXG4gICAgICAgIG9wdGlvbnMuc291cmNlRGlyICtcbiAgICAgICAgJy8nICtcbiAgICAgICAgKG9wdGlvbnMuYXBwUm9vdCB8fCBvcHRpb25zLnBhdGgpICtcbiAgICAgICAgJy8nICtcbiAgICAgICAgb3B0aW9ucy5tb2R1bGVcbiAgICApO1xuICAgIGNvbnN0IG1vZHVsZUJhc2VOYW1lID0gbm9ybWFsaXplKG1vZHVsZVBhdGgpXG4gICAgICAuc3BsaXQoJy8nKVxuICAgICAgLnBvcCgpO1xuXG4gICAgaWYgKGhvc3QuZXhpc3RzKG1vZHVsZVBhdGgpKSB7XG4gICAgICByZXR1cm4gbm9ybWFsaXplKG1vZHVsZVBhdGgpO1xuICAgIH0gZWxzZSBpZiAoaG9zdC5leGlzdHMobW9kdWxlUGF0aCArICcudHMnKSkge1xuICAgICAgcmV0dXJuIG5vcm1hbGl6ZShtb2R1bGVQYXRoICsgJy50cycpO1xuICAgIH0gZWxzZSBpZiAoaG9zdC5leGlzdHMobW9kdWxlUGF0aCArICcubW9kdWxlLnRzJykpIHtcbiAgICAgIHJldHVybiBub3JtYWxpemUobW9kdWxlUGF0aCArICcubW9kdWxlLnRzJyk7XG4gICAgfSBlbHNlIGlmIChob3N0LmV4aXN0cyhtb2R1bGVQYXRoICsgJy8nICsgbW9kdWxlQmFzZU5hbWUgKyAnLm1vZHVsZS50cycpKSB7XG4gICAgICByZXR1cm4gbm9ybWFsaXplKG1vZHVsZVBhdGggKyAnLycgKyBtb2R1bGVCYXNlTmFtZSArICcubW9kdWxlLnRzJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignU3BlY2lmaWVkIG1vZHVsZSBkb2VzIG5vdCBleGlzdCcpO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIEZ1bmN0aW9uIHRvIGZpbmQgdGhlIFwiY2xvc2VzdFwiIG1vZHVsZSB0byBhIGdlbmVyYXRlZCBmaWxlJ3MgcGF0aC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZpbmRNb2R1bGUoaG9zdDogVHJlZSwgZ2VuZXJhdGVEaXI6IHN0cmluZyk6IFBhdGgge1xuICBsZXQgZGlyOiBEaXJFbnRyeSB8IG51bGwgPSBob3N0LmdldERpcignLycgKyBnZW5lcmF0ZURpcik7XG5cbiAgY29uc3QgbW9kdWxlUmUgPSAvXFwubW9kdWxlXFwudHMkLztcbiAgY29uc3Qgcm91dGluZ01vZHVsZVJlID0gLy1yb3V0aW5nXFwubW9kdWxlXFwudHMvO1xuXG4gIHdoaWxlIChkaXIpIHtcbiAgICBjb25zdCBtYXRjaGVzID0gZGlyLnN1YmZpbGVzLmZpbHRlcihcbiAgICAgIHAgPT4gbW9kdWxlUmUudGVzdChwKSAmJiAhcm91dGluZ01vZHVsZVJlLnRlc3QocClcbiAgICApO1xuXG4gICAgaWYgKG1hdGNoZXMubGVuZ3RoID09IDEpIHtcbiAgICAgIHJldHVybiBqb2luKGRpci5wYXRoLCBtYXRjaGVzWzBdKTtcbiAgICB9IGVsc2UgaWYgKG1hdGNoZXMubGVuZ3RoID4gMSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAnTW9yZSB0aGFuIG9uZSBtb2R1bGUgbWF0Y2hlcy4gVXNlIHNraXAtaW1wb3J0IG9wdGlvbiB0byBza2lwIGltcG9ydGluZyAnICtcbiAgICAgICAgICAndGhlIGNvbXBvbmVudCBpbnRvIHRoZSBjbG9zZXN0IG1vZHVsZS4nXG4gICAgICApO1xuICAgIH1cblxuICAgIGRpciA9IGRpci5wYXJlbnQ7XG4gIH1cblxuICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgJ0NvdWxkIG5vdCBmaW5kIGFuIE5nTW9kdWxlIGZvciB0aGUgbmV3IGNvbXBvbmVudC4gVXNlIHRoZSBza2lwLWltcG9ydCAnICtcbiAgICAgICdvcHRpb24gdG8gc2tpcCBpbXBvcnRpbmcgY29tcG9uZW50cyBpbiBOZ01vZHVsZS4nXG4gICk7XG59XG5cbi8qKlxuICogQnVpbGQgYSByZWxhdGl2ZSBwYXRoIGZyb20gb25lIGZpbGUgcGF0aCB0byBhbm90aGVyIGZpbGUgcGF0aC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkUmVsYXRpdmVQYXRoKGZyb206IHN0cmluZywgdG86IHN0cmluZyk6IHN0cmluZyB7XG4gIGZyb20gPSBub3JtYWxpemUoZnJvbSk7XG4gIHRvID0gbm9ybWFsaXplKHRvKTtcblxuICAvLyBDb252ZXJ0IHRvIGFycmF5cy5cbiAgY29uc3QgZnJvbVBhcnRzID0gZnJvbS5zcGxpdCgnLycpO1xuICBjb25zdCB0b1BhcnRzID0gdG8uc3BsaXQoJy8nKTtcblxuICAvLyBSZW1vdmUgZmlsZSBuYW1lcyAocHJlc2VydmluZyBkZXN0aW5hdGlvbilcbiAgZnJvbVBhcnRzLnBvcCgpO1xuICBjb25zdCB0b0ZpbGVOYW1lID0gdG9QYXJ0cy5wb3AoKTtcblxuICBjb25zdCByZWxhdGl2ZVBhdGggPSByZWxhdGl2ZShcbiAgICBub3JtYWxpemUoZnJvbVBhcnRzLmpvaW4oJy8nKSksXG4gICAgbm9ybWFsaXplKHRvUGFydHMuam9pbignLycpKVxuICApO1xuICBsZXQgcGF0aFByZWZpeCA9ICcnO1xuXG4gIC8vIFNldCB0aGUgcGF0aCBwcmVmaXggZm9yIHNhbWUgZGlyIG9yIGNoaWxkIGRpciwgcGFyZW50IGRpciBzdGFydHMgd2l0aCBgLi5gXG4gIGlmICghcmVsYXRpdmVQYXRoKSB7XG4gICAgcGF0aFByZWZpeCA9ICcuJztcbiAgfSBlbHNlIGlmICghcmVsYXRpdmVQYXRoLnN0YXJ0c1dpdGgoJy4nKSkge1xuICAgIHBhdGhQcmVmaXggPSBgLi9gO1xuICB9XG4gIGlmIChwYXRoUHJlZml4ICYmICFwYXRoUHJlZml4LmVuZHNXaXRoKCcvJykpIHtcbiAgICBwYXRoUHJlZml4ICs9ICcvJztcbiAgfVxuXG4gIHJldHVybiBwYXRoUHJlZml4ICsgKHJlbGF0aXZlUGF0aCA/IHJlbGF0aXZlUGF0aCArICcvJyA6ICcnKSArIHRvRmlsZU5hbWU7XG59XG4iXX0=