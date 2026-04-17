import React, { useEffect, useState } from 'react'
import './menu.css'
import { useNavigate } from "react-router-dom";
function menu() {
    var menuOpened = false
    const navigate = useNavigate();
    useEffect(() => {
        document.getElementById('ham').addEventListener('click', () => {
            // console.log(menuOpened);
            if (menuOpened) {
                document.getElementById('menulist').style.display = 'none'
                const menuBody = document.getElementById('menuBody')
                menuBody.style.width = '40px'
                menuBody.style.height = '40px'
                menuBody.style.borderRadius = '20px'
                document.getElementById('ham').style.top = '2px'
                document.getElementById('ham').style.right = '4px'
                setTimeout(() => {
                    menuBody.style.border = "2px solid white"
                    document.getElementById('menutxt').style.display = 'flex'
                    menuOpened = false
                }, 500);
            }
            else {
                const menuBody = document.getElementById('menuBody')
                document.getElementById('menutxt').style.display = 'none'
                menuBody.style.width = '325px'
                menuBody.style.height = '610px'
                menuBody.style.borderRadius = '20px'
                menuBody.style.border = "none"
                document.getElementById('ham').style.top = '4px'
                document.getElementById('ham').style.right = '6px'
                setTimeout(() => {
                    document.getElementById('menulist').style.display = 'flex'
                    menuOpened = true
                }, 500);
            }
            // console.log(menuOpened);

        })
    }, [])
    return (
        <div className='menuWrap'>
            <div id='menutxt' className="menutxt">MENU</div>
            <div className="menuBody" id='menuBody'>
                <label id='ham' className="hamburger">
                    <input type="checkbox" />
                    <svg viewBox="0 0 32 32">
                        <path className="line line-top-bottom" d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22" />
                        <path className="line" d="M7 16 27 16" />
                    </svg>
                </label>
                <ul id='menulist' className='menulist'>
                    <li id='list1' onClick={() => { window.scrollTo({ top: 0, behavior: "smooth" }) }} >Home</li>
                    <li id='list2'>
                        <a 
                            href="https://tedxoist.in" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="external-menu-link"
                        >
                            TEDx
                        </a>
                    </li>
                    <li id='list3' onClick={() => { document.getElementById('eventSection').scrollIntoView({ behavior: 'smooth' }) }} >Events</li>
                    <li id='list4' onClick={() => { document.getElementById('galleryWrap').scrollIntoView({ behavior: 'smooth' }) }} >Gallery</li>
                    <li id='list5' onClick={() => { document.getElementById('projectCover').scrollIntoView({ behavior: 'smooth' }) }} >Editions</li>
                    <li id='list6' onClick={() => { document.getElementById('branding').scrollIntoView({ behavior: 'smooth' }) }} >Members</li>
                    <li id='list7' onClick={() => { navigate('/magazine') }} >Magazine</li>
                    <li id='list8' onClick={() => { navigate('/cypher') }} >Cypher 30</li>
                </ul>
            </div>
        </div>
    )
}

export default menu

