import React from 'react';
import axios, {AxiosResponse} from 'axios';
import {decryptJava, encryptJava, encrypt} from '../encryption/AES';
import {getLanguage, l} from '../locale';
import {Redirect} from 'react-router';
import {emiyaJ, url} from '../api';
import {StyleRules, Theme, WithStyles} from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import AddIcon from '@material-ui/icons/Add';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import Remove from '@material-ui/icons/Remove';
import Close from '@material-ui/icons/Close';
import Tooltip from '@material-ui/core/Tooltip';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Comment from '@material-ui/icons/Comment';
import {Villager} from 'animal-crossing/lib/types/Villager';
import {
    getColorByColor,
    getHobby,
    getMotto,
    getName,
    getPersonality,
    getPhrase,
    getSpecies,
    getStyle
} from './Locales';
import CommentDialog from './CommentDialog';
import {Data} from '../repsonseBody';
import {Clothes} from './interfaces';

const style = (): StyleRules => ({
    root: {
        margin: 0
    },
    bottom: {
        backgroundColor: '#4caf50'
    },
    action: {
        color: '#fff'
    }
});

interface VillagerDetailProps extends WithStyles<typeof style> {
    removeVillager: (v: Villager) => Promise<string>;
    code: string;
    fromParam?: boolean;
    handleClose?: () => void;
    addVillager: (villager: string) => Promise<string>;
    data: Villager[];
}

interface VillagerDetailState {
    selected: Villager;
    clothesName: string;
    clothesColor: string;
    clothesFilename: string;
    snackbar: boolean;
    snackbarMessage: string;
    snackbarType: 'success' | 'information' | 'warning' | 'error' | 'none';
    commentDialog: boolean;
}

class VillagerDetail extends React.Component<VillagerDetailProps, VillagerDetailState> {
    constructor(props: VillagerDetailProps) {
        super(props);
        this.state = {
            selected: this.getVillagerFromCode(this.props.code),
            clothesName: l('villagers.detail.loadingclothesname'),
            clothesColor: '',
            clothesFilename: '',
            snackbarMessage: '',
            snackbarType: 'none',
            snackbar: false,
            commentDialog: false
        }
        this.getClothesName(this.state.selected.defaultClothingInternalId);
    }

   /* componentDidMount() {

    }

    componentDidUpdate(prevProps: Readonly<VillagerDetailProps>, prevState: Readonly<VillagerDetailState>, snapshot?: any) {
        if (prevProps.code !== this.props.code && prevState.selected.code != this.state.selected.code) {
            this.getClothesName(this.state.selected.defaultClothes);
        }
    } */

    getVillagerFromCode = (code: string): Villager => {
        const villager = this.props.data.find((item: Villager) => {
            return item.filename === code;
        });
        if (villager != null) {
            return villager;
        } else {
            return this.props.data[0];
        }
    }

    handleDelete = (): void => {
        this.closeSnackbar();
        const { selected } = this.state;
        void this.props.removeVillager(selected).then(c => {
            this.setState({snackbar: true, snackbarMessage: c});
        })
    }

    getClothesImage = (filename: string): JSX.Element => {
        if (filename != null) {
            return (
                <>
                    <img src={`https://acnhcdn.com/latest/FtrIcon/${filename}.png`} alt={filename.toString()}/>
                    <p id={'detailClothesName'}>{this.state.clothesName}</p>
                    <p id={'detailClothesColor'}>{this.state.clothesColor}</p>
                </>
            )
        } else {
            return <></>
        }
    }

    getClothesName = (filename: number): void => {
        const data = encryptJava(Date.now().toString() + '<>' + filename.toString());
        axios.post(url(emiyaJ, 'clothes', 'search', 'id'), {data})
            .then((r: AxiosResponse<Data>) => {
                const clothes = JSON.parse(decryptJava(r.data.data)) as Clothes;
                const name = (getLanguage() === 'ko_KR') ? clothes.nameKorean : clothes.name
                this.setState({clothesName: `${name}`, clothesColor: `(${l('villagers.colors.'+clothes.color1.toLowerCase())}/${l('villagers.colors.'+clothes.color2.toLowerCase())})`, clothesFilename: clothes.filename})
            })
            .catch(() => {
                this.setState({clothesName: l('villagers.detail.loadingclothesname')});
            })
    }

    getCloseButton(): JSX.Element {
        if (this.props.fromParam === true) {
            return <></>
        } else {
            return <BottomNavigationAction label={l('villagers.detail.close')} icon={<Close />} className={this.props.classes.action} onClick={this.props.handleClose}/>
        }
    }

    handleClose = (): void => {
        if (this.props.handleClose != null) {
            this.props.handleClose();
        }
    }

    handleAdd = (): void => {
        this.closeSnackbar();
        const { code } = this.props;
        void this.props.addVillager(code)
            .then(comment => {
                this.setState({snackbar: true, snackbarMessage: comment});
            })
    }

    handleComment = (): void => {
        this.setState({commentDialog: true});
    }

    openSnackbar = (): void => {
        this.setState({snackbar: true});
    }

    closeSnackbar = (event?: React.SyntheticEvent, reason?: string): void => {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({snackbar: false});
    }

    render(): React.ReactElement {
        const v: Villager = this.state.selected;
        const cardColor = '#ffd2cf';
        const cardStyle: React.CSSProperties = {
            borderWidth: '3px',
            width: '100%',
            // width: '250px',
            backgroundColor: '#ffd2cf',
            borderColor: cardColor,
            borderStyle: 'solid'
        }

        const cardContent: React.CSSProperties = {
            backgroundColor: 'white',
            textAlign: 'center',
            borderBottomColor: cardColor,
            height: '256px'
        }

        const cardFooter: React.CSSProperties = {
            backgroundColor: cardColor
        }

        const profileStyle: React.CSSProperties = {
            backgroundColor: 'white',
            border: 'gray 1px solid',
            borderRadius: '50%',
            padding: '10px',
            borderColor: cardColor,
            float: 'left'
        }

        const tdStyle: React.CSSProperties = {
            backgroundColor: 'white',
            borderColor: cardColor,
            borderTopWidth: '2px',
            borderTopStyle: 'solid',
            borderBottomWidth: '2px',
            borderBottomStyle: 'solid',
            height: '35px',
            borderRadius: '12px'
        }

        const thStyle: React.CSSProperties = {
            borderColor: cardColor,
            borderTopWidth: '1px',
            borderTopStyle: 'solid',
            borderBottomWidth: '1px',
            borderBottomStyle: 'solid',
            borderRightWidth: '1px',
            borderRightStyle: 'solid',
            textAlign: 'right',
            width: '23%'
        }

        const trStyle: React.CSSProperties = {
            lineHeight: '1px'
        }
        if (v == null) {
            return (<Redirect to={'/villagers'} />)
        } else {
            if (v.filename == null) {
                return <h1/>
            }
            type item = {title: string; description: string | JSX.Element}
            const detailItems: item[] = []
            detailItems.push({title: l('villagers.my.phrase'), description: getPhrase(v)})
            detailItems.push({title: l('villagers.my.species'), description: getSpecies(v.species)})
            detailItems.push({title: l('villagers.my.personality'), description: getPersonality(v.personality) + ` (${v.subtype})`})
            detailItems.push({title: l('villagers.my.hobby'), description: getHobby(v.hobby)})
            detailItems.push({title: l('villagers.detail.style'), description: `${getStyle(v, 0)} / ${getStyle(v, 1)}`})
            detailItems.push({title: l('villagers.detail.color'), description: `${getColorByColor(v.colors[0])} / ${getColorByColor(v.colors[1])}`})
            detailItems.push({title: l('villagers.my.birthday'), description: <><span>{v.birthday}</span> <a href={'/cal/' + v.filename} style={{textDecoration: 'none'}}>({l('villagers.detail.addcalendar')})</a></>})
            // detailItems.push({l('villagers.my.voicetone'), v.voicetone.toString()})
            detailItems.push({title: l('villagers.my.code'), description: v.filename})
            return (
                <>
                    <Snackbar open={this.state.snackbar} autoHideDuration={3000} onClose={this.closeSnackbar} message={this.state.snackbarMessage} action={
                        <IconButton size="small" color="inherit" onClick={this.closeSnackbar}>
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    } />
                    <div>
                        <div style={cardStyle}>
                        <div id={'cardHeader'} style={{display: 'inline-block'}}>
                            <img src={v.iconImage} alt={v.filename} style={profileStyle}/>
                            <h4 className={'flow-text'} style={{
                                display: 'inline-block',
                                margin: 0,
                                float: 'right',
                                marginLeft: '15px',
                                lineHeight: '150px'
                            }}>{getName(v)}</h4>
                        </div>
                        <div id={'cardContent'} style={cardContent}>
                            <img src={v.photoImage} alt={v.filename} style={{height: 256, width: 256}}/>
                        </div>
                        <div id={'cardFooter'} style={cardFooter}>
                            <table style={{marginBottom: '0', width: '100%'}}>
                                <tbody>
                                {detailItems.map((elements) => {
                                    return (
                                        <tr style={trStyle} key={elements.title}>
                                            <th style={thStyle}>{elements.title}</th>
                                            <td style={tdStyle}>{elements.description}</td>
                                        </tr>
                                    )
                                })}
                                <tr style={trStyle}>
                                    <th style={thStyle}>{l('villagers.my.defaultclothes')}</th>
                                    <td style={tdStyle}>{this.getClothesImage(this.state.clothesFilename)}</td>
                                </tr>
                                </tbody>

                            </table>
                            <p style={{
                                padding: 0,
                                margin: 0,
                                textAlign: 'right',
                                marginRight: '5px',
                                marginBottom: '3px'
                            }}>{getMotto(v)}</p>
                        </div>
                        </div>
                        <div>
                            <BottomNavigation showLabels className={this.props.classes.bottom}>
                                <Tooltip title={l('villagers.tooltip.addtomyvillagers')}>
                                    <BottomNavigationAction label={l('villagers.detail.add')} icon={<AddIcon />} className={this.props.classes.action} onClick={this.handleAdd} />
                                </Tooltip>
                                <Tooltip title={l('villagers.tooltip.deletemyvillagers')}>
                                    <BottomNavigationAction label={l('villagers.detail.delete')} icon={<Remove />} className={this.props.classes.action} onClick={this.handleDelete} />
                                </Tooltip>
                                <Tooltip title={l('villagers.tooltip.comments')}>
                                    <BottomNavigationAction label={l('villagers.detail.comments')} icon={<Comment />} className={this.props.classes.action} onClick={this.handleComment} />
                                </Tooltip>
                                {this.getCloseButton()}
                            </BottomNavigation>
                        </div>
                    </div>
                    <CommentDialog code={this.props.code} open={this.state.commentDialog} handleClose={(): void => this.setState({commentDialog: false})} />
                </>

            )
        }
    }
}

export default withStyles(style)(VillagerDetail);
