/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react';
import CryptoJS from 'crypto-js';
import { ToastContainer, toast } from 'react-toastify';
import TidList from '../../assets/reference-data/step2-tid-list.json';
import { DataContext } from '../../hooks/data-manager/DataContext';
import { getData } from '../../utils/util';

const StepTwoSelectionTid = (props) => {
    const { selectedAnswered, setSelectedAnswered, activeSteps, setActiveSteps, tabs, setTabs } = useContext(DataContext);
    const [tidList, setTidList] = useState(TidList.tidDetails);
    const [nextClick, setNextClick] = useState(true);

    useEffect(() => {
        let contextData = getData();

        if (contextData === null) {
            props.history.push({
                pathname: '/stepOne'
            });
        }

        if (contextData !== null && contextData.stepTwoSelectedTid.length > 0) {
            let newStateTidList = tidList;
            let selectedTid = contextData.stepTwoSelectedTid;

            // newStateTidList.forEach(item => {
            //     if (item.id !== selectedTid.id) {
            //         item.selected = false;
            //     } else {
            //         item.selected = true;
            //     }
            // });
            newStateTidList.forEach(item1 => {
                let itemFromSelectedTid = selectedTid.find(item2 => item2.id === item1.id);

                if (itemFromSelectedTid) {
                    item1.selected = itemFromSelectedTid.selected;
                }
            }
            )
            setTidList([...newStateTidList]);
        }
        setActiveSteps(1);
        setTabs({
            ...tabs,
            0: false,
            1: false
        });
    }, []);

    useEffect(() => {
        if (tidList.some(item => item.selected === true)) {
            setNextClick(false);
        } else {
            setNextClick(true);
        }
    }, [tidList]);

    const handleSelectedTidOption = (val) => {
        let newStateTidList = tidList;

        newStateTidList.forEach(item => {
            if (item.id === val.id) {
                if (item.selected === false && (tidList.filter(item => item.selected === true)).length < 2)
                    item.selected = true;
                else if (item.selected === true)
                    item.selected = false;
                else
                    toast.warning("Du kan välja högst två objekt.");
            }
        });

        setTidList([...newStateTidList]);
    };

    const handleBack = () => {
        setActiveSteps(activeSteps - 1);

        props.history.push({
            pathname: '/stepOne'
        });
    };

    const handleNext = () => {
        let selectedTid = tidList.filter(item => item.selected === true);

        if (selectedTid.length > 0) {
            let stepTwoSelectedTid = selectedAnswered.stepTwoSelectedTid.splice(0, selectedAnswered.stepTwoSelectedTid.length, ...selectedTid);

            setSelectedAnswered({
                stepTwoSelectedTid,
                ...selectedAnswered
            });
            setTabs({
                ...tabs,
                2: false
            });

            sessionStorage.setItem("dermatom-context-data", CryptoJS.AES.encrypt(JSON.stringify(selectedAnswered), 'dermatom-dsk').toString());
            setActiveSteps(activeSteps + 1);

            props.history.push({
                pathname: '/stepThree'
            });
        }
        // if (tidList.some(item => item.selected === true)) {
        //     sessionStorage.setItem("dermatom-context-data", JSON.stringify(selectedAnswered));
        //     //setActiveSteps(activeSteps + 1);
        //     props.history.push({
        //         pathname: '/stepThree'
        //     });
        // }
    };

    return (
        <>
            <main>
                <div className="container h-100">
                    <div className="row h-100">
                        <div className="col-12 h-100 d-flex flex-column">
                            <p className="font-34 mb-5">2. Vilken tid på dygnet har du ont?</p>
                            <div className="row d-flex flex-grow-1">
                                {
                                    tidList.length > 0 &&
                                    tidList.map((item, index) => (
                                        <div className="col-3" key={index}>
                                            <div className={`w-100 h-100 card-tid d-flex flex-column justify-content-center text-center ${item.selected ? "selected" : ""}`} onClick={() => handleSelectedTidOption(item)}>
                                                <img src={item.img} alt={item.title} className="d-flex flex-grow-1" />
                                                <p className="font-20 pb-0 d-flex align-self-center mt-auto flex-shrink-0">{item.title}</p>
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

export default StepTwoSelectionTid;