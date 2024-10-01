import {InputOptionsType, InputType} from "../types/input.type";

export class ValidationUtils {
    constructor() {

    }

    public static validateForm(inputArray: InputType[]): boolean {
        let isValid: boolean = true;

        for (let i = 0; i < inputArray.length; i++) {
            if (!ValidationUtils.validateFields(inputArray[i]!.element, inputArray[i]!.options)) {
                isValid = false;
            }
        }
        return isValid;
    }

    private static validateFields(field: HTMLInputElement | null, options?: InputOptionsType): boolean {
        if (field) {
            let condition: any = field.value;
            if (options) {
                if (options.hasOwnProperty('pattern')) {
                    condition = field.value && field.value.match(options.pattern as RegExp);
                } else if (options.hasOwnProperty('compareTo')) {
                    condition = field.value && field.value === options.compareTo;
                }
            }

            if (condition) {
                field.classList.remove('is-invalid');
                field.nextElementSibling?.classList.remove('is-invalid');
                return true;
            } else {
                field.classList.add('is-invalid');
                field.nextElementSibling?.classList.add('is-invalid');
                return false;
            }
        }
        return false;
    }
}