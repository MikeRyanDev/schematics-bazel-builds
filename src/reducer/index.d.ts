/// <amd-module name="@ngrx/schematics/src/reducer/index" />
import { Rule } from '@angular-devkit/schematics';
export declare const ReducerOptions: any;
export declare type ReducerOptions = {
    name: string;
    appRoot?: string;
    path?: string;
    sourceDir?: string;
    /**
     * Specifies if a spec file is generated.
     */
    spec?: boolean;
    /**
     * Flag to indicate if a dir is created.
     */
    flat?: boolean;
    module?: string;
    feature?: boolean;
    reducers?: string;
    group?: boolean;
};
export default function (options: ReducerOptions): Rule;
