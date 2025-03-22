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
/**
 * 响应数据
 * @export
 * @interface HealthGoal
 */
export interface HealthGoal {
    /**
     * 
     * @type {number}
     * @memberof HealthGoal
     */
    goalId?: number;
    /**
     * 
     * @type {number}
     * @memberof HealthGoal
     */
    accountId?: number;
    /**
     * 
     * @type {string}
     * @memberof HealthGoal
     */
    goalCategory?: string;
    /**
     * 
     * @type {number}
     * @memberof HealthGoal
     */
    targetValue?: number;
    /**
     * 
     * @type {number}
     * @memberof HealthGoal
     */
    currentValue?: number;
    /**
     * 
     * @type {string}
     * @memberof HealthGoal
     */
    startDate?: string;
    /**
     * 
     * @type {Date}
     * @memberof HealthGoal
     */
    targetDate?: Date;
    /**
     * 
     * @type {number}
     * @memberof HealthGoal
     */
    goalStatus?: number;
    /**
     * 
     * @type {Date}
     * @memberof HealthGoal
     */
    createdAt?: Date;
}

/**
 * Check if a given object implements the HealthGoal interface.
 */
export function instanceOfHealthGoal(value: object): value is HealthGoal {
    return true;
}

export function HealthGoalFromJSON(json: any): HealthGoal {
    return HealthGoalFromJSONTyped(json, false);
}

export function HealthGoalFromJSONTyped(json: any, ignoreDiscriminator: boolean): HealthGoal {
    if (json == null) {
        return json;
    }
    return {
        
        'goalId': json['goalId'] == null ? undefined : json['goalId'],
        'accountId': json['accountId'] == null ? undefined : json['accountId'],
        'goalCategory': json['goalCategory'] == null ? undefined : json['goalCategory'],
        'targetValue': json['targetValue'] == null ? undefined : json['targetValue'],
        'currentValue': json['currentValue'] == null ? undefined : json['currentValue'],
        'startDate': json['startDate'] == null ? undefined : (new Date(json['startDate'])),
        'targetDate': json['targetDate'] == null ? undefined : json['targetDate'],
        'goalStatus': json['goalStatus'] == null ? undefined : json['goalStatus'],
        'createdAt': json['createdAt'] == null ? undefined : (new Date(json['createdAt'])),
    };
}

export function HealthGoalToJSON(json: any): HealthGoal {
    return HealthGoalToJSONTyped(json, false);
}

export function HealthGoalToJSONTyped(value?: HealthGoal | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'goalId': value['goalId'],
        'accountId': value['accountId'],
        'goalCategory': value['goalCategory'],
        'targetValue': value['targetValue'],
        'currentValue': value['currentValue'],
        'startDate': value['startDate'] == null ? undefined : ((value['startDate']).toISOString()),
        'targetDate': value['targetDate'] == null ? undefined : ((value['targetDate']).toISOString()),
        'goalStatus': value['goalStatus'],
        'createdAt': value['createdAt'] == null ? undefined : ((value['createdAt']).toISOString()),
    };
}

