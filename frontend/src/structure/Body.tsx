import React from 'react';

import { GlobalCxt, IContext } from '../context/GlobalContext';
import { View } from '../context/GlobalViewContext';
import Dashboard from '../views/Dashboard';

interface Props {}
interface State {}

/**
 * A layout component which allows you to switch between the two important views meeting and server
 *
 * @export
 * @param {Props} props
 * @return {*}
 */
export default class Body extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {};
    }

    showView(globalView: View) {
        let context: IContext = this.context as IContext;
        switch (globalView) {
            case 'dashboard': {
                return <Dashboard />;
            }
        }
    }
    static contextType = GlobalCxt;
    render() {
        let context: IContext = this.context as IContext;
        return <>{this.showView(context.viewContext.view)}</>;
    }
}
