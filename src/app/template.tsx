"use client";

import React, { ReactNode } from 'react';
import MotionWrapper from '@/components/Animation/MotionWrapper';

interface TemplateProps {
    children: ReactNode;
}

const Template: React.FC<TemplateProps> = ({ children }) => {
    return (
        <MotionWrapper>
            {children}
        </MotionWrapper>
    );
};

export default Template;
