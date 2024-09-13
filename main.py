#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import streamlit as st
import random

fifty = random.sample(range(1, 51), 5)

twelve = random.sample(range(1, 13), 2)

if st.button(label='davaj cisla', type='primary'):
    st.write(', '.join(map(str, sorted(fifty))), ' a este ',
             ', '.join(map(str, sorted(twelve))))
