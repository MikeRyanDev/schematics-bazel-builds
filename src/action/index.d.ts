/// <amd-module name="@ngrx/schematics/src/action/index" />
import { Rule } from '@angular-devkit/schematics';
export declare const ActionOptions: any;
export declare type ActionOptions = {
    name: string;
    appRoot?: string;
    path?: string;
    sourceDir?: string;
    /**
     * Specifies if a spec file is generated.
     */
    spec?: boolean;
    flat?: boolean;
    group?: boolean;
};
export default function (options: ActionOptions): Rule;
