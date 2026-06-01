async function calculator(expression) {

    try {
        const result =
            Function(
                `return ${expression}`
            )();
        return {
            expression,
            result
        };

    }
    catch (error) {
        return {
            error: "Invalid calculation"
        };
    }

}

module.exports =calculator;