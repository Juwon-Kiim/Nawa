package com.ssafy.five.controller.dto.req;

import com.ssafy.five.domain.entity.Report;
import lombok.Getter;

@Getter
public class ReportReqDto {

    private String reportFrom;
    private String reportTo;
    private String reportContent;

    public Report reported() {
        return Report.builder()
                .reportFrom(this.reportFrom)
                .reportTo(this.reportTo)
                .reportContent(this.reportContent)
                .build();
    }
}