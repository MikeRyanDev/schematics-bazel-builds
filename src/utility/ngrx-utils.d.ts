/// <amd-module name="@ngrx/schematics/src/utility/ngrx-utils" />
import * as ts from 'typescript';
import { Change } from './change';
import { Rule } from '@angular-devkit/schematics';
import { ReducerOptions } from '../reducer';
export declare function addReducerToState(options: ReducerOptions): Rule;
/**
 * Insert the reducer into the first defined top level interface
 */
export declare function addReducerToStateInferface(source: ts.SourceFile, reducersPath: string, options: {
    name: string;
}): Change;
/**
 * Insert the reducer into the ActionReducerMap
 */
export declare function addReducerToActionReducerMap(source: ts.SourceFile, reducersPath: string, options: {
    name: string;
}): Change;
/**
 * Add reducer feature to NgModule
 */
export declare function addReducerImportToNgModule(options: ReducerOptions): Rule;
export declare function omit<T extends {
    [key: string]: any;
}>(object: T, keyToRemove: keyof T): Partial<T>;
