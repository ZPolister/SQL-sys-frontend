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
 * 饮食记录请求参数
 * @export
 * @interface DietLogDto
 */
export interface DietLogDto {
    /**
     * 食物名称
     * @type {string}
     * @memberof DietLogDto
     */
    foodItem: string;
    /**
     * 食用量（克）
     * @type {number}
     * @memberof DietLogDto
     */
    quantityGrams?: number;
    /**
     * 总热量（大卡）
     * @type {number}
     * @memberof DietLogDto
     */
    totalCalories: number;
    /**
     * 时间戳格式
     * @type {number}
     * @memberof DietLogDto
     */
    consumptionTime?: number;
}

/**
 * Check if a given object implements the DietLogDto interface.
 */
export function instanceOfDietLogDto(value: object): value is DietLogDto {
    if (!('foodItem' in value) || value['foodItem'] === undefined) return false;
    if (!('totalCalories' in value) || value['totalCalories'] === undefined) return false;
    return true;
}

export function DietLogDtoFromJSON(json: any): DietLogDto {
    return DietLogDtoFromJSONTyped(json, false);
}

export function DietLogDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): DietLogDto {
    if (json == null) {
        return json;
    }
    return {
        
        'foodItem': json['foodItem'],
        'quantityGrams': json['quantityGrams'] == null ? undefined : json['quantityGrams'],
        'totalCalories': json['totalCalories'],
        'consumptionTime': json['consumptionTime'] == null ? undefined : (new Date(json['consumptionTime'])),
    };
}

export function DietLogDtoToJSON(json: any): DietLogDto {
    return DietLogDtoToJSONTyped(json, false);
}

export function DietLogDtoToJSONTyped(value?: DietLogDto | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'foodItem': value['foodItem'],
        'quantityGrams': value['quantityGrams'],
        'totalCalories': value['totalCalories'],
        'consumptionTime': value['consumptionTime'] == null ? undefined : ((value['consumptionTime'])),
    };
}

