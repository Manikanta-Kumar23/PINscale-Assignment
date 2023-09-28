import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector"

i18n
.use(LanguageDetector)
.use(initReactI18next)
.init({
    debug: true,
    fallbackLng: "en" ,
    interpolation: {
        escapeValue: false
    } ,
    resources: {
        "en": {
            "translation": {
                "navbar": {
                    "accounts": "Accounts" ,
                    "userTransactions": "Your Transactions" ,
                    "adminTransactions": "All Transactions" ,
                    "profile": "Profile"
                }
            }
        } ,
        "es": {
            "translation": {
                "navbar": {
                    "accounts": "Cuentas" ,
                    "userTransactions": "Tus Transacciones" ,
                    "adminTransactions": "Todas Las Transacciones" ,
                    "profile": "Perfil"

                }
            }
        } ,
        "fr": {
            "translation": {
                "navbar": {
                    "accounts": "Comptes" ,
                    "userTransactions": "Vos Transactions" ,
                    "adminTransactions": "Toutes Transactions" ,
                    "profile": "Profil"

                }
            }
        }
    }
})

export default i18n