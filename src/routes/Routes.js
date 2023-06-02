import React from 'react';
import { Route, Switch } from 'react-router-dom';
import StepFive from '../components/step5/StepFive';
import NotFound from '../components/not-found/NotFound';
import StepOneSelectionNar from '../components/step1-select-nar/StepOneSelectionNar';
import StepTwoSelectionTid from '../components/step2-select-tid/StepTwoSelectionTid';
import StepThreeSelectionHur from '../components/step3-select-hur/StepThreeSelectionHur';
import StepFourSelectionVar from '../components/step4-select-var/StepFourSelectionVar';
import SummaryReport from '../components/summary-report/SummaryReport';

const Routes = () => {
    return (
        <Switch>
            <Route path='/' exact component={StepOneSelectionNar} />
            <Route path='/stepOne' exact component={StepOneSelectionNar} />
            <Route path='/stepTwo' exact component={StepTwoSelectionTid} />
            <Route path='/stepThree' exact component={StepThreeSelectionHur} />SummaryReport
            <Route path='/stepFour' exact component={StepFourSelectionVar} />
            <Route path='/stepFive' exact component={StepFive} />
            <Route path='/summaryReport' exact component={SummaryReport} />
            <Route path="*" component={NotFound} />
        </Switch>
    )
};

export default Routes;