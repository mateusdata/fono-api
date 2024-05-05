
const validatePersonalId = (cpf) => {
    // Remove non-numeric characters
    const cleanedCPF = cpf.replace(/\D/g, '');

    // Check if the CPF has 11 digits
    if (cleanedCPF.length !== 11) {
        return false;
    }

    // Check if all digits are the same (invalid CPFs)
    if (/^(\d)\1+$/.test(cleanedCPF)) {
        return false;
    }

    // Calculate and validate the check digits
    const cpfArray = cleanedCPF.split('').map(Number);
    const sumFirst9Digits = cpfArray.slice(0, 9).reduce((acc, digit, index) => acc + digit * (10 - index), 0);
    const firstCheckDigit = (sumFirst9Digits * 10) % 11 === 10 ? 0 : (sumFirst9Digits * 10) % 11;

    if (cpfArray[9] !== firstCheckDigit) {
        return false;
    }

    const sumFirst10Digits = cpfArray.slice(0, 10).reduce((acc, digit, index) => acc + digit * (11 - index), 0);
    const secondCheckDigit = (sumFirst10Digits * 10) % 11 === 10 ? 0 : (sumFirst10Digits * 10) % 11;

    return cpfArray[10] === secondCheckDigit;

}

const validateAge = (date) => {
    return dayjs().subtract(18, 'year').isAfter(date) && dayjs().subtract(100, 'year').isBefore(date)
}

const validateMedicalGovLicense = (medicalLicenseNumber) => {
    return RegExp(/^[1-9]\d+$/).test(medicalLicenseNumber);
}

const removeUnwantedCharacters = (subject) => {
    return subject.replace(/\D/g, '');
}

module.exports = {validatePersonalId, validateAge, validateMedicalGovLicense};