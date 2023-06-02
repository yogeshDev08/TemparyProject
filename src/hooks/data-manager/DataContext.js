import React, { useEffect, useState } from 'react';
import CryptoJS from 'crypto-js';

export const DataContext = React.createContext();

const DataContextProvider = (props) => {
    const [selectedAnswered, setSelectedAnswered] = useState({
        stepOneSelectedNar: [],
        stepTwoSelectedTid: [],
        stepThreeSelectedHur: [],
        stepFourSelectedVar: {
            frontImageCordinates: [],
            backImageCordinates: []
        }
    });
    const [tabs, setTabs] = useState({
        0: false,
        1: true,
        2: true,
        3: true,
        4: true,
        5: true
    });
    const [activeSteps, setActiveSteps] = useState(0);

    useEffect(() => {
        let data = sessionStorage.getItem("dermatom-context-data");
        let decryptedData;

        if (data !== null) {
            let bytes = CryptoJS.AES.decrypt(data, 'dermatom-dsk');
            decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
            setSelectedAnswered(decryptedData);
            return decryptedData;
        }
        // if (contextData !== null) {
        //     setSelectedAnswered(contextData);
        // }
    }, []);



    return (
        <DataContext.Provider value={{ selectedAnswered, activeSteps, tabs, setSelectedAnswered, setActiveSteps, setTabs }}>
            {props.children}
        </DataContext.Provider>
    );
};

export default DataContextProvider;