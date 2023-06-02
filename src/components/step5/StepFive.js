/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react';
import { DataContext } from '../../hooks/data-manager/DataContext';
import { getData } from '../../utils/util';

const StepFive = (props) => {
    const { activeSteps, setActiveSteps, tabs, setTabs } = useContext(DataContext);
    const [nextClick, setNextClick] = useState(true);
    // const [onToggleChange, setOnToggleChange] = useState(false);

    useEffect(() => {
        let contextData = getData();

        if (contextData === null) {
            props.history.push({
                pathname: '/stepOne'
            });
        }
        setNextClick(false);
        setActiveSteps(4);
    }, []);

    // useEffect(() => {
    //     const frontEle = document.getElementById('myresult-step5');
    //     if (frontEle) {
    //         frontEle.style.opacity = 1;
    //         imageZoom("myimage-step5", "myresult-step5");
    //     }

    // }, [onToggleChange]);

    const handleBack = () => {
        setActiveSteps(activeSteps - 1);
        props.history.push({
            pathname: '/stepFour'
        });
    };

    const handleNext = async () => {
        setTabs({
            ...tabs,
            5: false
        });
        props.history.push({
            pathname: '/summaryReport'
        });
    };

    // function imageZoom(imgID, resultID) {
    //     let img, lens, result, cx, cy;
    //     img = document.getElementById(imgID);
    //     result = document.getElementById(resultID);
    //     /*create lens:*/
    //     lens = document.createElement("DIV");
    //     lens.setAttribute("id", "img-zoom-lens-step5");
    //     /*insert lens:*/
    //     img.parentElement.insertBefore(lens, img);
    //     img.style.cursor = "pointer";
    //     /*calculate the ratio between result DIV and lens:*/
    //     cx = result.offsetWidth / lens.offsetWidth;
    //     cy = result.offsetHeight / lens.offsetHeight;
    //     /*set background properties for the result DIV:*/
    //     result.style.backgroundImage = "url('" + img.src + "')";
    //     result.style.backgroundSize = (img.width * cx) + "px " + (img.height * cy) + "px";
    //     /*execute a function when someone moves the cursor over the image, or the lens:*/
    //     lens.addEventListener("mousemove", moveLens);
    //     img.addEventListener("mousemove", moveLens);
    //     /*and also for touch screens:*/
    //     lens.addEventListener("touchmove", moveLens);
    //     img.addEventListener("touchmove", moveLens);

    //     function moveLens(e) {
    //         let pos, x, y;
    //         /*prevent any other actions that may occur when moving over the image:*/
    //         e.preventDefault();
    //         /*get the cursor's x and y positions:*/
    //         pos = getCursorPos(e);
    //         /*calculate the position of the lens:*/
    //         x = pos.x - (lens.offsetWidth / 2);
    //         y = pos.y - (lens.offsetHeight / 2);
    //         /*prevent the lens from being positioned outside the image:*/
    //         if (x > img.width - lens.offsetWidth) {
    //             x = img.width - lens.offsetWidth;
    //         }
    //         if (x < 0) {
    //             x = 0;
    //         }
    //         if (y > img.height - lens.offsetHeight) {
    //             y = img.height - lens.offsetHeight;
    //         }
    //         if (y < 0) {
    //             y = 0;
    //         }
    //         /*set the position of the lens:*/
    //         lens.style.left = x + "px";
    //         lens.style.top = y + "px";
    //         /*display what the lens "sees":*/
    //         result.style.backgroundPosition = "-" + (x * cx) + "px -" + (y * cy) + "px";
    //     }

    //     function getCursorPos(e) {
    //         let a, x = 0,
    //             y = 0;
    //         e = e || window.event;
    //         /*get the x and y positions of the image:*/
    //         a = img.getBoundingClientRect();
    //         /*calculate the cursor's x and y coordinates, relative to the image:*/
    //         x = e.pageX - a.left;
    //         y = e.pageY - a.top;
    //         /*consider any page scrolling:*/
    //         x = x - window.pageXOffset;
    //         y = y - window.pageYOffset;
    //         return {
    //             x: x,
    //             y: y
    //         };
    //     }
    // }

    // const show = () => {
    //     setOnToggleChange(true);
    // }

    // const onMouseToggle = () => {
    //     if (onToggleChange) {
    //         const zoomElement = document.getElementById("img-zoom-lens-step5");
    //         if (zoomElement) zoomElement.remove();
    //     }
    //     setOnToggleChange(false);
    // }

    return (
        <>
            <main className="bg-white">
                <div className="container h-100">
                    <div className="row h-100">
                        <div className="col-12 h-100 d-flex flex-column">
                            <p className="font-34 mb-4">5. Varför?</p>
                            <div className="row d-flex">
                                <span style={{ fontSize: '18px' }}>Framgångsrik handläggning av smärta har en positiv betydelse för patienten. Ju tidigare diagnosen ställs, desto fler möjligheter finns det att förbättra prognosen och behandlingsresultatet.</span>
                                <div className="col-6 h-100 text-end" style={{ width: '100%' }}>
                                    <div className="step-5-img">
                                        <img id="myimage-step5" src="./images/dermatom-step5.svg" width="550" height="550" />
                                    </div>
                                </div>
                                {/*{onToggleChange === true && <div className="col-6 h-100 text-start ps-6 img-zoom-container">
                                    <div id="myresult-step5" className="img-zoom-result" ></div>
                                </div>} */}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <footer className="d-flex align-items-end bg-white">
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
        </>
    );
};

export default StepFive;