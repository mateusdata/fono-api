function filename(prefix, pacient){
    return `${prefix}_${pacient?.person?.first_name}_${pacient?.person?.cpf}.pdf`.toLowerCase();
}

function personalIdType(id) {
    if (RegExp(/^\d{11}$/).test(id)) {
        return 'CPF';
    }

    if (RegExp(/^\d{14}$/).test(id)) {
        return 'CNPJ';
    }

    return 'CRFa';
}

function formatPersonalId(id) {
    if (RegExp(/^\d{11}$/).test(id)) {
        return id.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
    }

    if (RegExp(/^\d{14}$/).test(id)) {
        return id.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{1})$/, '$1.$2.$3/$4-$5');
    }

    return id;
}

function formatPhoneNumber(phone_number){
    return  phone_number.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
}

function reportUrl(hash){
    return `${process.env.APP_URL}/download-report?file=${hash}`
}

module.exports = { formatPersonalId, personalIdType, filename, formatPhoneNumber, reportUrl };