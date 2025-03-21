
import axios from "axios";

const companyHouseSecretKey=process.env.COMPANY_HOUSE_SECRET_KEY

export const companyHouse = async (path, query) => {
    try {
        const url = query ?
            `https://api.company-information.service.gov.uk${path}?${query}`
            : `https://api.company-information.service.gov.uk${path}`
        const res = await axios.get(
            url,
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "authorization": `e06d77fd-fd5c-403d-b822-9bd7f6b295c3`,
                }
            })



        // console.log(res, path);
        return (res.data)
    } catch (e) {
        console.log(e.message);
    }
}

// //console.log( await companyHouse("/company/09488156"))
// //console.log( await companyHouse("/search/companies",`q=5apart`))
// console.log(await companyHouse("/company/09488156/officers"))