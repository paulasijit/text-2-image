import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import MailIcon from '@mui/icons-material/Mail';
import { Link, Button, styled, ListSubheader, Badge } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/action';
import ExitToAppTwoToneIcon from '@mui/icons-material/ExitToAppTwoTone';
import FilterTwoToneIcon from '@mui/icons-material/FilterTwoTone';
import AssessmentTwoToneIcon from '@mui/icons-material/AssessmentTwoTone';
import AnalyticsTwoToneIcon from '@mui/icons-material/AnalyticsTwoTone';
import GTranslateTwoToneIcon from '@mui/icons-material/GTranslateTwoTone';

const drawerWidth = 280;

const MenuWrapper = styled(Box)(
    ({ theme }) => `
    .MuiList-root {
      padding: ${theme.spacing(1)};
      backgroud: black;
      & > .MuiList-root {
        padding: 0 ${theme.spacing(0)} ${theme.spacing(1)};
      }
    }
  
      .MuiListSubheader-root {
        text-transform: uppercase;
        font-weight: bold;
        font-size: ${theme.typography.pxToRem(12)};
        color: white;
        padding: ${theme.spacing(0, 2.5)};
        line-height: 1.4;
      }
  `
);

const SubMenuWrapper = styled(Box)(
    () => `
      .MuiList-root {
  
        .MuiListItem-root {
          padding: 1px 0;
  
          .MuiBadge-root {
            position: absolute;
            right: 3.2;
  
            .MuiBadge-standard {
              background: #282c34;
              font-size: 10px;
              font-weight: bold;
              color: #ffffff;
            }
          }
      
          .MuiButton-root {
            display: flex;
            color: #ffffffb3;
            text-transform: none;
            background-color: transparent;
            font-weight: 500;
            width: 100%;
            font-size: 0.95rem;
            line-height: 1.75;
            justify-content: flex-start;
            padding: 10.799999999999999px 27px;
            border-radius: 10px;
            .MuiButton-startIcon,
            .MuiButton-endIcon {
              transition: #ffffffb3;
  
              .MuiSvgIcon-root {
                font-size: inherit;
                transition: none;
              }
            }
  
            .MuiButton-startIcon {
              color: #ffffffb3;
              font-size: 20;
              margin-right: 1;
            }
            
            .MuiButton-endIcon {
              color:#ffffffb3;
              margin-left: auto;
              opacity: .8;
              font-size: 20;
            }
  
            &.active,
            &:hover {
                background-color: rgba(255, 255, 255, 0.06);
                color: #ffffff
  
              .MuiButton-startIcon,
              .MuiButton-endIcon {
                color: #ffffff;
              }
            }
          }
        }
      }
  `
);


export default function Sidebar() {
    const location = useLocation();
    const currentRoute = location.pathname
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const handleLogout = () => {
        dispatch(logout());
    };
    return (
        <Box sx={{ display: 'flex', background: "red", }}>
            <CssBaseline />
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        background: "#0f141b",
                        boxShadow: "0px 0px 2px #42494d",
                    },
                }}
                variant="permanent"
                anchor="left"
            >
                <Toolbar>
                    <Link href="/" underline="none">
                        <Badge
                            sx={{
                                '.MuiBadge-badge': {
                                    fontSize: "14px",
                                    right: -15,
                                    top: 28,
                                    background: "#4daa2a",
                                    color: "white"
                                }
                            }}
                            overlap="circular"
                            badgeContent="1.0"
                        >
                            <img src="/new_logo.png" alt="Logo" style={{ width: 80 }} />
                        </Badge>
                    </Link>
                </Toolbar>
                <Divider
                    sx={{
                        mx: 2,
                        background: "#42494d",
                    }}
                />
                <MenuWrapper>
                    <List
                        component="div"
                        subheader={
                            <ListSubheader
                                component="div"
                                disableSticky
                                style={{ color: "#91c7c6", fontWeight: 800, fontStyle: 14 }}
                            >
                                Language AI
                            </ListSubheader>
                        }
                    >
                        <SubMenuWrapper>
                            <List component="div">
                                <ListItem component="div">
                                    <Link href="/translation" underline="none" sx={{ width: "100%" }}>
                                        <Button
                                            className={
                                                currentRoute === "/translation" ? "active" : ""
                                            }
                                            disableRipple
                                            component="a"
                                            startIcon={<GTranslateTwoToneIcon />}
                                        >
                                            Translation
                                        </Button>
                                    </Link>
                                </ListItem>
                                <ListItem component="div">
                                    <Link href="/semantic-analysis" underline="none" sx={{ width: "100%" }}>
                                        <Button
                                            className={
                                                currentRoute === "/semantic-analysis" ? "active" : ""
                                            }
                                            disableRipple
                                            component="a"
                                            startIcon={<AnalyticsTwoToneIcon />}
                                        >
                                            Semantic Analysis
                                        </Button>
                                    </Link>
                                </ListItem>
                                <ListItem component="div">
                                    <Link href="/content-analysis" underline="none" sx={{ width: "100%" }}>
                                        <Button
                                            className={
                                                currentRoute === "/content-analysis" ? "active" : ""
                                            }
                                            disableRipple
                                            component="a"
                                            startIcon={<AssessmentTwoToneIcon />}
                                        >
                                            Content Analysis
                                        </Button>
                                    </Link>
                                </ListItem>
                            </List>
                        </SubMenuWrapper>
                    </List>
                </MenuWrapper>
                <Divider
                    sx={{
                        mx: 2,
                        background: "#42494d",
                    }}
                />
                <MenuWrapper>
                    <List
                        component="div"
                        subheader={
                            <ListSubheader
                                component="div"
                                disableSticky
                                style={{ color: "#91c7c6", fontWeight: 800, fontStyle: 14 }}
                            >
                                Image AI
                            </ListSubheader>
                        }
                    >
                        <SubMenuWrapper>
                            <List component="div">
                                <ListItem component="div">
                                    <Link href="/image-generator" underline="none" sx={{ width: "100%" }}>
                                        <Button
                                            className={
                                                currentRoute === "/image-generator" ? "active" : ""
                                            }
                                            disableRipple
                                            component="a"
                                            startIcon={<FilterTwoToneIcon />}
                                        >
                                            Image Generator
                                        </Button>
                                    </Link>
                                </ListItem>
                            </List>
                        </SubMenuWrapper>
                    </List>
                </MenuWrapper>
                <Divider
                    sx={{
                        mx: 2,
                        background: "#42494d",
                    }}
                />
                <MenuWrapper>
                    <List
                        component="div"
                        subheader={
                            <ListSubheader
                                component="div"
                                disableSticky
                                style={{ color: "#91c7c6", fontWeight: 800, fontStyle: 14 }}
                            >
                                {user.email}
                            </ListSubheader>
                        }
                    >
                        <SubMenuWrapper>
                            <List component="div">
                                <ListItem component="div">
                                    <Link href="/auth" underline="none" sx={{ width: "100%" }}>
                                        <Button
                                            className={
                                                currentRoute === "/auth" ? "active" : ""
                                            }
                                            disableRipple
                                            component="a"
                                            startIcon={<ExitToAppTwoToneIcon />}
                                            onClick={handleLogout}
                                        >
                                            Logout
                                        </Button>
                                    </Link>
                                </ListItem>
                            </List>
                        </SubMenuWrapper>
                    </List>
                </MenuWrapper>
            </Drawer>
        </Box>
    );
}
