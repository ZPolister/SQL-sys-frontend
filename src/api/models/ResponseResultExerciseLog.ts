/* tslint:disable */
/* eslint-disable */
/**
 * TTXX健康
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { mapValues } from '../runtime';
import type { ExerciseLog } from './ExerciseLog';
import {
    ExerciseLogFromJSON,
    ExerciseLogFromJSONTyped,
    ExerciseLogToJSON,
    ExerciseLogToJSONTyped,
} from './ExerciseLog';

/**
 * 通用响应结果
 * @export
 * @interface ResponseResultExerciseLog
 */
export interface ResponseResultExerciseLog {
    /**
     * 状态码
     * @type {number}
     * @memberof ResponseResultExerciseLog
     */
    code?: number;
    /**
     * 提示信息
     * @type {string}
     * @memberof ResponseResultExerciseLog
     */
    msg?: string;
    /**
     * 
     * @type {ExerciseLog}
     * @memberof ResponseResultExerciseLog
     */
    data?: ExerciseLog;
}

/**
 * Check if a given object implements the ResponseResultExerciseLog interface.
 */
export function instanceOfResponseResultExerciseLog(value: object): value is ResponseResultExerciseLog {
    return true;
}

export function ResponseResultExerciseLogFromJSON(json: any): ResponseResultExerciseLog {
    return ResponseResultExerciseLogFromJSONTyped(json, false);
}

export function ResponseResultExerciseLogFromJSONTyped(json: any, ignoreDiscriminator: boolean): ResponseResultExerciseLog {
    if (json == null) {
        return json;
    }
    return {
        
        'code': json['code'] == null ? undefined : json['code'],
        'msg': json['msg'] == null ? undefined : json['msg'],
        'data': json['data'] == null ? undefined : ExerciseLogFromJSON(json['data']),
    };
}

export function ResponseResultExerciseLogToJSON(json: any): ResponseResultExerciseLog {
    return ResponseResultExerciseLogToJSONTyped(json, false);
}

export function ResponseResultExerciseLogToJSONTyped(value?: ResponseResultExerciseLog | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'code': value['code'],
        'msg': value['msg'],
        'data': ExerciseLogToJSON(value['data']),
    };
}

