import React from "react";
import Loader from "./Loader";

interface State {
  component: React.ComponentType<any> | null;
}

interface Props {}

export default function asyncComponent(
  importComponent: () => Promise<{ default: React.ComponentType<any> }>
) {
  class AsyncComponent extends React.Component<Props, State> {
    constructor(props: Props) {
      super(props);

      this.state = {
        component: null,
      };
    }

    async componentDidMount() {
      const { default: component } = await importComponent();

      this.setState({
        component: component,
      });
    }

    render() {
      const C = this.state.component;

      return C ? <C {...this.props} /> : <Loader />;
    }
  }

  return AsyncComponent;
}
