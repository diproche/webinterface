import React from "react";
import styles from "./proofEditor.module.scss";
import { checkProof } from "../../util/proofChecker";

export interface Props {

}

interface State {
    text: string;
}

export class ProofEditor extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            text: "",
        };
    }

    public render() {
        return <div className={styles.proofEditor}>
            <textarea
                className={styles.textInput}
                value={this.state.text}
                onChange={ev => this.setState({ text: ev.target.value })}
            />
            <div className={styles.buttons}>
                <button onClick={this.checkInput}>
                    Prüfen
                </button>
                <button onClick={() => { alert("Toller HInweis"); } }>
                    Hinweis
                </button>
            </div>
        </div>;
    }

    private readonly checkInput = () => {
        const errors = checkProof(this.state.text);
        alert(errors);
    } 
}
