/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react';
import CryptoJS from 'crypto-js';
import { ToastContainer, toast } from 'react-toastify';
import NarList from '../../assets/reference-data/step1-nar-list.json';
import { DataContext } from '../../hooks/data-manager/DataContext';
import { getData } from '../../utils/util';

const StepOneSelectionNar = (props) => {
    const { selectedAnswered, setSelectedAnswered, activeSteps, setActiveSteps, tabs, setTabs } = useContext(DataContext);
    const [narList, setNarList] = useState(NarList.narDetails);
    const [nextClick, setNextClick] = useState(true);

    useEffect(() => {
        let contextData = getData();

        if (contextData !== null && contextData.stepOneSelectedNar.length > 0) {
            let newStateNarList = narList;
            let selectedNar = contextData.stepOneSelectedNar;

            newStateNarList.forEach(item1 => {
                let itemFromSelectedNar = selectedNar.find(item2 => item2.id === item1.id);

                if (itemFromSelectedNar) {
                    item1.selected = itemFromSelectedNar.selected;
                }
            }
            )
            setNarList([...newStateNarList]);
        }
        setActiveSteps(0);
    }, []);

    useEffect(() => {
        if (narList.some(item => item.selected === true)) {
            setNextClick(false);
        } else {
            setNextClick(true);
        }
    }, [narList]);

    const handleSelectedNarOption = (val) => {
        let newStateNarList = narList;

        newStateNarList.forEach(item => {
            if (item.id === val.id) {
                if (item.selected === false && (narList.filter(item => item.selected === true)).length < 4)
                    item.selected = true;
                else if (item.selected === true)
                    item.selected = false;
                else
                    toast.warning("Du kan välja högst fyra objekt.");
            }
        });

        setNarList([...newStateNarList]);
    };

    const handleNext = () => {
        let selectedNar = narList.filter(item => item.selected === true);

        if (selectedNar.length > 0) {
            let stepOneSelectedNar = selectedAnswered.stepOneSelectedNar.splice(0, selectedAnswered.stepOneSelectedNar.length, ...selectedNar);

            setSelectedAnswered({
                stepOneSelectedNar,
                ...selectedAnswered
            });
            setTabs({
                ...tabs,
                1: false
            });

            sessionStorage.setItem("dermatom-context-data", CryptoJS.AES.encrypt(JSON.stringify(selectedAnswered), 'dermatom-dsk').toString());

            setActiveSteps(activeSteps + 1);
            props.history.push({
                pathname: '/stepTwo'
            });
        }
    }

    return (
        <>
            <main>
                <div className="container h-100">
                    <div className="row h-100">
                        <div className="col-12 h-100 d-flex flex-column">
                            <p className="font-34 mb-5">1. När har du ont?</p>
                            <div className="row d-flex flex-grow-1">
                                {
                                    narList.length > 0 &&
                                    narList.map((item, index) => (
                                        <div className="col-3 pb-3" key={index}>
                                            <div className={`w-100 h-100 card-nar d-flex flex-column justify-content-center text-center ${item.selected ? "selected" : ""}`} onClick={() => handleSelectedNarOption(item)}>
                                                <img src={item.img} alt={item.title} className="d-flex flex-grow-1" />
                                                <p className="font-20 pb-0 d-flex align-self-center mt-3 mb-0 flex-shrink-0">{item.title}</p>
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
                            <button className="btn btn-back d-flex"><span className="arrow_carrot-left font-26 me-3"></span> Tillbaka</button>
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

export default StepOneSelectionNar;