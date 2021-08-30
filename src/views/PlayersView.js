import { useEffect, useState } from "react";
import { DataGrid } from '@material-ui/data-grid';

export default function Scoreboard(props) {
    const [playerList, setPlayerList] = useState([]);

    const handleChange = e => {
      const fileReader = new FileReader();
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = e => {
        console.log("e.target.result", e.target.result);
        props.loadSave(JSON.parse(e.target.result));
      };
    };

    useEffect(() => {
        setPlayerList(props.playersList);
    }, [props.playersList]);

    return (
        <div style={{ height: 800, width: '100%' }}>
            <a
                href={`data:text/json;charset=utf-8,${encodeURIComponent(
                    JSON.stringify(playerList)
                )}`}
                download="save.json"
            >
                {`Download Save State`}
            </a>
            <br />
            Import Save State: <input type="file" onChange={handleChange} />
        </div>
    );
}
