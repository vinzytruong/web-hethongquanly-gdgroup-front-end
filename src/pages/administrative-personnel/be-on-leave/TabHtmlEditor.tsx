import React, { useCallback, useEffect, useRef, useState } from 'react';
import { markup, tabs, tabLabel } from './data';
import { Box, Typography, Button, useTheme, Stack, Grid } from '@mui/material';
import { StyledButton } from '@/components/styled-button';
import { IconPrinter } from '@tabler/icons-react';
import ReactToPrint from "react-to-print";
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import HtmlEditor, {
    Toolbar,
    MediaResizing,
    ImageUpload,
    Item,
} from 'devextreme-react/html-editor';

const sizeValues = ['8pt', '10pt', '12pt', '14pt', '18pt', '24pt', '36pt'];
const fontValues = [
    'Arial',
    'Courier New',
    'Georgia',
    'Impact',
    'Lucida Console',
    'Tahoma',
    'Times New Roman',
    'Verdana',
];
const headerValues = [false, 1, 2, 3, 4, 5];
const fontSizeOptions = {
    inputAttr: {
        'aria-label': 'Font size',
    },
};
const fontFamilyOptions = {
    inputAttr: {
        'aria-label': 'Font family',
    },
};
const headerOptions = {
    inputAttr: {
        'aria-label': 'Font family',
    },
};

const TabHtmlEditor = () => {
    const [isMultiline, setIsMultiline] = useState(true);
    const [currentTab, setCurrentTab] = useState(tabs[2].value);
    const theme = useTheme()
    const [html, setHtml] = useState(markup)

    const printFile = () => {
        // Tính toán kích thước cửa sổ in
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        // Tạo một cửa sổ in mới và đặt kích thước sao cho nó toàn màn hình
        const printWindow = window.open('', '', `width=${windowWidth},height=${windowHeight},left=0,top=0`);
        if (printWindow) {
            // Viết nội dung HTML vào cửa sổ in
            printWindow.document.write(html);
            // Đóng việc viết và in cửa sổ in
            printWindow.document.close();
            // Chỉ in nội dung cửa sổ, không in các phần khác của trang
            printWindow.print();
        }
    };
    console.log(html);

    const componentRef = useRef(null);

    const onBeforeGetContentResolve = useRef<any>(null);

    const [loading, setLoading] = useState(false);
    const [text, setText] = useState("old boring text");

    const handleAfterPrint = useCallback(() => {
        console.log("`onAfterPrint` called");
    }, []);

    const handleBeforePrint = useCallback(() => {
        console.log("`onBeforePrint` called");
    }, []);

    const handleOnBeforeGetContent = useCallback(() => {
        console.log("`onBeforeGetContent` called");
        setLoading(true);
        setText("Loading new text...");

        return new Promise<void>((resolve) => {
            onBeforeGetContentResolve.current = resolve;

            setTimeout(() => {
                setLoading(false);
                setText("New, Updated Text!");
                resolve();
            }, 2000);
        });
    }, [setLoading, setText]);

    useEffect(() => {
        if (
            text === "New, Updated Text!" &&
            typeof onBeforeGetContentResolve.current === "function"
        ) {
            onBeforeGetContentResolve.current();
        }
    }, [text]);

    const reactToPrintContent = useCallback(() => {
        return componentRef.current;
    }, []);

    const reactToPrintTrigger = useCallback(() => {
        return (
            <StyledButton
                startIcon={<IconPrinter stroke={2} />}
                variant="contained" size='large'>In đơn
            </StyledButton>
        )
    }, []);


    return (
        <Box width='100%' bgcolor={theme.palette.background.default}>

            <Box display='flex' alignItems='flex-start' justifyContent='space-between' bgcolor={theme.palette.background.default} gap={3} >
                <Box width='50%' bgcolor={theme.palette.background.paper}>
                    <Box>
                        <HtmlEditor height="65vh" defaultValue={markup} onValueChange={(e) => setHtml(e)}>
                            <MediaResizing enabled={true} />
                            <ImageUpload tabs={currentTab} fileUploadMode="base64" />
                            <Toolbar multiline={isMultiline} >
                                <Item name="undo" />
                                <Item name="redo" />
                                <Item name="separator" />
                                <Item name="size" acceptedValues={sizeValues} options={fontSizeOptions} />
                                <Item name="font" acceptedValues={fontValues} options={fontFamilyOptions} />
                                <Item name="separator" />
                                <Item name="bold" />
                                <Item name="italic" />
                                <Item name="strike" />
                                <Item name="underline" />
                                <Item name="separator" />
                                <Item name="alignLeft" />
                                <Item name="alignCenter" />
                                <Item name="alignRight" />
                                <Item name="alignJustify" />
                                <Item name="separator" />
                                <Item name="orderedList" />
                                <Item name="bulletList" />
                                <Item name="separator" />
                                <Item name="header" acceptedValues={headerValues} options={headerOptions} />
                                <Item name="separator" />
                                <Item name="color" />
                                <Item name="background" />
                                <Item name="separator" />
                                <Item name="link" />
                                <Item name="image" />
                                <Item name="separator" />
                                <Item name="clear" />
                                <Item name="codeBlock" />
                                <Item name="blockquote" />
                                <Item name="separator" />
                                <Item name="insertTable" />
                                <Item name="deleteTable" />
                                <Item name="insertRowAbove" />
                                <Item name="insertRowBelow" />
                                <Item name="deleteRow" />
                                <Item name="insertColumnLeft" />
                                <Item name="insertColumnRight" />
                                <Item name="deleteColumn" />
                            </Toolbar>
                        </HtmlEditor>




                    </Box>
                </Box>
                <Box width='50%' bgcolor={theme.palette.background.paper} p={3} display='flex' flexDirection='column' gap={3}>
                    <Box display='flex' alignItems='center' justifyContent='space-between'  >
                        <Typography>Nội dung in</Typography>
                        <ReactToPrint
                            content={reactToPrintContent}
                            documentTitle="In đơn xin nghỉ phép"
                            onAfterPrint={handleAfterPrint}
                            onBeforeGetContent={handleOnBeforeGetContent}
                            onBeforePrint={handleBeforePrint}
                            removeAfterPrint
                            trigger={reactToPrintTrigger}


                        />
                    </Box>

                    {loading && <p className="indicator">Loading...</p>}
                    <Box border={`1px solid ${theme.palette.text.secondary}`}>
                        <div ref={componentRef} dangerouslySetInnerHTML={{ __html: html }} />
                    </Box>

                </Box>
            </Box>

        </Box>
    )
}
export default TabHtmlEditor