/// <amd-module name="@ngrx/schematics/src/store/index" />
import { Rule } from '@angular-devkit/schematics';
export declare const StoreOptions: any;
export declare type StoreOptions = {
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
    statePath?: string;
    root?: boolean;
    /**
     * Specifies the interface for the state
     */
    stateInterface?: string;
};
export default function (options: StoreOptions): Rule;
