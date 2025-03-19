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
import type { HealthGoal } from './HealthGoal';
import {
    HealthGoalFromJSON,
    HealthGoalFromJSONTyped,
    HealthGoalToJSON,
    HealthGoalToJSONTyped,
} from './HealthGoal';

/**
 * 通用响应结果
 * @export
 * @interface ResponseResultHealthGoal
 */
export interface ResponseResultHealthGoal {
    /**
     * 状态码
     * @type {number}
     * @memberof ResponseResultHealthGoal
     */
    code?: number;
    /**
     * 提示信息
     * @type {string}
     * @memberof ResponseResultHealthGoal
     */
    msg?: string;
    /**
     * 
     * @type {HealthGoal}
     * @memberof ResponseResultHealthGoal
     */
    data?: HealthGoal;
}

/**
 * Check if a given object implements the ResponseResultHealthGoal interface.
 */
export function instanceOfResponseResultHealthGoal(value: object): value is ResponseResultHealthGoal {
    return true;
}

export function ResponseResultHealthGoalFromJSON(json: any): ResponseResultHealthGoal {
    return ResponseResultHealthGoalFromJSONTyped(json, false);
}

export function ResponseResultHealthGoalFromJSONTyped(json: any, ignoreDiscriminator: boolean): ResponseResultHealthGoal {
    if (json == null) {
        return json;
    }
    return {
        
        'code': json['code'] == null ? undefined : json['code'],
        'msg': json['msg'] == null ? undefined : json['msg'],
        'data': json['data'] == null ? undefined : HealthGoalFromJSON(json['data']),
    };
}

export function ResponseResultHealthGoalToJSON(json: any): ResponseResultHealthGoal {
    return ResponseResultHealthGoalToJSONTyped(json, false);
}

export function ResponseResultHealthGoalToJSONTyped(value?: ResponseResultHealthGoal | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'code': value['code'],
        'msg': value['msg'],
        'data': HealthGoalToJSON(value['data']),
    };
}

