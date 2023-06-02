/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react';
import CryptoJS from 'crypto-js';
import { ToastContainer, toast } from 'react-toastify';
import HurList from '../../assets/reference-data/step3-hur-list.json';
import { DataContext } from '../../hooks/data-manager/DataContext';
import { getData } from '../../utils/util';

const StepThreeSelectionHur = (props) => {
    const { selectedAnswered, setSelectedAnswered, activeSteps, setActiveSteps, tabs, setTabs } = useContext(DataContext);
    const [hurList, setHurList] = useState(HurList.hurDetails);
    const [nextClick, setNextClick] = useState(true);

    useEffect(() => {
        let contextData = getData();

        if (contextData === null) {
            props.history.push({
                pathname: '/stepOne'
            });
        }

        setActiveSteps(2);

        if (contextData !== null && contextData?.stepThreeSelectedHur.length > 0) {
            let newStateHurList = hurList;
            let selectedHur = contextData.stepThreeSelectedHur;

            newStateHurList.forEach(item1 => {
                let itemFromSelectedHur = selectedHur.find(item2 => item2.id === item1.id);

                if (itemFromSelectedHur) {
                    item1.selected = itemFromSelectedHur.selected;
                }
            }
            )

            setHurList([...newStateHurList]);
        }
        setTabs({
            ...tabs,
            0: false,
            1: false,
            2: false
        });
    }, []);

    useEffect(() => {
        if (hurList.some(item => item.selected === true)) {
            setNextClick(false);
        } else {
            setNextClick(true);
        }
    }, [hurList]);

    const handleSelectedHurOption = (val) => {
        let newStateHurList = hurList;

        newStateHurList.forEach(item => {
            if (item.id === val.id) {
                if (item.selected === false && (hurList.filter(item => item.selected === true)).length < 4)
                    item.selected = true;
                else if (item.selected === true)
                    item.selected = false;
                else
                    toast.warning("Du kan välja högst fyra objekt.");
                // setNextButton(true);
            }
        });
        setHurList([...newStateHurList]);
    };

    const handleBack = () => {
        setActiveSteps(activeSteps - 1);

        props.history.push({
            pathname: '/stepTwo'
        });
    };

    const handleNext = () => {
        let selectedHur = hurList.filter(item => item.selected === true);

        if (selectedHur.length > 0) {
            let stepThreeSelectedHur = selectedAnswered.stepThreeSelectedHur.splice(0, selectedAnswered.stepThreeSelectedHur.length, ...selectedHur);

            setSelectedAnswered({
                stepThreeSelectedHur,
                ...selectedAnswered
            });
            setTabs({
                ...tabs,
                3: false
            });

            sessionStorage.setItem("dermatom-context-data", CryptoJS.AES.encrypt(JSON.stringify(selectedAnswered), 'dermatom-dsk').toString());
            setActiveSteps(activeSteps + 1);

            props.history.push({
                pathname: '/stepFour'
            });
        }
    };

    return (
        <>
            <main>
                <div className="container h-100">
                    <div className="row h-100">
                        <div className="col-12 h-100 d-flex flex-column">
                            <p className="font-34 mb-5">3. Hur gör  det ont?</p>
                            <div className="row d-flex flex-grow-1">
                                {
                                    hurList.length > 0 &&
                                    hurList.map((item, index) => (
                                        <div className="col-3 pb-3" key={index}>
                                            <div className={`w-100 h-100 card-nar d-flex flex-column justify-content-center text-center ${item.selected ? "selected" : ""}`} onClick={() => handleSelectedHurOption(item)}>
                                                <img src={item.img} alt={item.title} className="d-flex flex-grow-1" />
                                                <p className="font-16 pb-0 d-flex align-self-center mt-1 mb-2 flex-shrink-0">{item.title}</p>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <footer className="d-flex align-items-end">
                <div className="container">
                    <div className="row">
                        <div className="col-4">
                            <button className="btn btn-back d-flex" onClick={handleBack}><span className="arrow_carrot-left font-26 me-3"></span> Tillbaka</button>
                        </div>
                        <div className="col-4 d-flex justify-content-center align-items-center">
                            <span>Framtaget i samarbete med Jan Rickard Norrefalk</span>
                        </div>
                        <div className="col-4">
                            <button className="btn btn-primary d-flex pe-0 w-130px justify-content-between ms-auto" onClick={handleNext} disabled={nextClick}>Nästa <span className="arrow_carrot-right font-26 mr--10px"></span></button>
                        </div>
                    </div>
                </div>
            </footer>
            <ToastContainer toastStyle={{ backgroundColor: "#F4791E" }} />
        </>
    );
};

export default StepThreeSelectionHur;