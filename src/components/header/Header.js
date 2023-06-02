/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { DataContext } from '../../hooks/data-manager/DataContext';
import { getData } from '../../utils/util';

const Header = (props) => {
    let history = useHistory();
    const { activeSteps, setActiveSteps, tabs, setTabs } = useContext(DataContext);
    const steps = ["1. När?", "2. Tid?", "3. Hur?", "4. Var?", "5. Varför?"];

    useEffect(() => {
        (async () => {
            let data = await getData();

            if (data !== null) {

                setTabs({
                    ...tabs,
                    0: data.stepOneSelectedNar.length > 0 ? false : true,
                    1: (data.stepOneSelectedNar.length > 0) || (data.stepTwoSelectedTid.length > 0) ? false : true,
                    2: (data.stepTwoSelectedTid.length > 0) || (data.stepThreeSelectedHur.length > 0) ? false : true,
                    3: (data.stepThreeSelectedHur.length > 0) || (data.stepFourSelectedVar.frontImageCordinates.length > 0 || data.stepFourSelectedVar.backImageCordinates.length > 0) ? false : true,
                    4: (data.stepOneSelectedNar.length > 0 &&
                        data.stepTwoSelectedTid.length > 0 &&
                        data.stepThreeSelectedHur.length > 0 &&
                        (data.stepFourSelectedVar.frontImageCordinates.length > 0 || data.stepFourSelectedVar.backImageCordinates.length > 0)) ? false : true,
                    5: (data.stepOneSelectedNar.length > 0 &&
                        data.stepTwoSelectedTid.length > 0 &&
                        data.stepThreeSelectedHur.length > 0 &&
                        (data.stepFourSelectedVar.frontImageCordinates.length > 0 || data.stepFourSelectedVar.backImageCordinates.length > 0)) ? false : true
                });
            }
        })()
    }, []);

    useEffect(() => {
        changePage();
    }, [activeSteps && tabs]);

    const changePage = () => {
        if (tabs) {
            const falseCount = Object.values(tabs).filter(item => item === false).length;
            if (tabs[activeSteps]) pageChange(falseCount - 1);
        }
    };

    const pageChange = async (index) => {
        let data = await getData();
        switch (index) {
            case 0:
                history.push('stepOne');
                break;
            case 1:
                if (data?.stepOneSelectedNar.length > 0 || false) {
                    history.push('stepTwo');
                }
                break;
            case 2:
                if ((data?.stepOneSelectedNar.length > 0 && data?.stepTwoSelectedTid.length > 0) || false) {
                    history.push('stepThree');
                }
                break;
            case 3:
                if (!tabs[3]) {
                    history.push('stepFour');
                }
                break;
            case 4:
                if (!tabs[4]) {
                    history.push('stepFive');
                }
                break;
            case 5:
                if (!tabs[5]) {
                    history.push('summaryReport');
                }
                break;
            default:
                history.push('stepOne');
                break;
        }
    }


    const handleChange = (index) => async (e) => {
        setActiveSteps(index);
        let data = await getData();

        switch (index) {
            case 0:
                history.push('stepOne');
                break;
            case 1:
                if (data?.stepOneSelectedNar.length > 0 || false) {
                    history.push('stepTwo');
                }
                break;
            case 2:
                if ((data?.stepOneSelectedNar.length > 0 && data?.stepTwoSelectedTid.length > 0) || false) {
                    history.push('stepThree');
                }
                break;
            case 3:
                if (!tabs[3]) {
                    history.push('stepFour');
                }
                break;
            case 4:
                if (!tabs[4]) {
                    history.push('stepFive');
                }
                break;
            case 5:
                if (!tabs[5]) {
                    history.push('summaryReport');
                }
                break;
            default:
                history.push('stepOne');
                break;
        }
    };

    const handleRestart = () => {
        sessionStorage.removeItem("dermatom-context-data");
        history.push('stepOne');
        window.location.reload();
    };

    return (
        <>
            <header>
                <div className="h-100 d-flex align-items-center">
                    <div className="container">
                        <div className="row">
                            <div className="col-12 d-flex">
                                <nav className="d-flex align-items-center font-20 flex-grow-1">
                                    <a href="#" onClick={handleRestart}><img src="images/haleon-logo.png" alt="GSK" /></a>
                                    <ul className={`d-flex list-unstyled mb-0 justify-content-between w-100 ${activeSteps === 5 ? "finish" : ""}`}>
                                        {
                                            steps && steps.map((item, key) => {
                                                return (
                                                    <React.Fragment key={key} >
                                                        <li className="d-flex ms-auto align-items-center" >
                                                            <a className={`${(activeSteps >= key && !tabs[key]) ? "active" : ""}`}
                                                                disabled={tabs[key]} onClick={handleChange(key)}>{item}</a>
                                                        </li>
                                                        {
                                                            key === steps.length - 1 ?
                                                                <li className="d-flex ms-auto align-items-center">
                                                                    <button className="btn btn-primary ms-auto" disabled={tabs[5]} onClick={handleChange(key + 1)}>Sammanfattning</button>
                                                                </li> : ""
                                                        }
                                                    </React.Fragment>
                                                )
                                            })
                                        }
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
};

export default Header;