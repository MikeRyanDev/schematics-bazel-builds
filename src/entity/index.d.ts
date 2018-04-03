/// <amd-module name="@ngrx/schematics/src/entity/index" />
import { Rule } from '@angular-devkit/schematics';
export declare const EntityOptions: any;
export declare type EntityOptions = {
    name: string;
    appRoot?: string;
    path?: string;
    sourceDir?: string;
    /**
     * Specifies if a spec file is generated.
     */
    spec?: boolean;
    module?: string;
    reducers?: string;
    flat?: boolean;
    group?: boolean;
};
export default function (options: EntityOptions): Rule;
