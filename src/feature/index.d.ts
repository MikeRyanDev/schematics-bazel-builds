/// <amd-module name="@ngrx/schematics/src/feature/index" />
import { Rule } from '@angular-devkit/schematics';
export declare const FeatureOptions: any;
export declare type FeatureOptions = {
    path?: string;
    sourceDir?: string;
    name: string;
    module?: string;
    flat?: boolean;
    spec?: boolean;
    reducers?: string;
    group?: boolean;
};
export default function (options: FeatureOptions): Rule;
