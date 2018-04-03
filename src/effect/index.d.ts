/// <amd-module name="@ngrx/schematics/src/effect/index" />
import { Rule } from '@angular-devkit/schematics';
export declare const EffectOptions: any;
export declare type EffectOptions = {
    name: string;
    path?: string;
    appRoot?: string;
    sourceDir?: string;
    /**
     * Flag to indicate if a dir is created.
     */
    flat?: boolean;
    /**
     * Specifies if a spec file is generated.
     */
    spec?: boolean;
    /**
     * Allows specification of the declaring module.
     */
    module?: string;
    root?: boolean;
    feature?: boolean;
    group?: boolean;
};
export default function (options: EffectOptions): Rule;
