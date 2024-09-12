export class ValidationUtils {
    constructor() {

    }

    static validateForm(inputArray) {
        let isValid = true;

        for (let i = 0; i < inputArray.length; i++) {
            if (!ValidationUtils.validateFields(inputArray[i].element, inputArray[i].options)) {
                isValid = false;
            }
        }
        return isValid;
    }

    static validateFields(field, options) {
        let condition = field.value;
        console.log(condition);
        if (options) {
            if (options.hasOwnProperty('pattern')) {
                condition = field.value && field.value.match(options.pattern);
            } else if (options.hasOwnProperty('compareTo')) {
                condition = field.value && field.value === options.compareTo;
            }
        }

        if (condition) {
            field.classList.remove('is-invalid');
            field.nextElementSibling.classList.remove('is-invalid');
            return true;
        } else {
            field.classList.add('is-invalid');
            field.nextElementSibling.classList.add('is-invalid');
            return false;
        }
    }
}