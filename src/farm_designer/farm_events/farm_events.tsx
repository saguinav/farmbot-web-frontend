import * as React from "react";
import { Link } from "react-router";
import { FBSelect, Row, Col } from "../../ui";
import { connect } from "react-redux";
import { t } from "i18next";
import * as moment from "moment";
import { mapStateToProps, FarmEventProps } from "./map_state_to_props";

@connect(mapStateToProps)
export class FarmEvents extends React.Component<FarmEventProps, {}> {
  renderCalendarRows() {
    return this.props.calendarRows.map(function (item) {
      return <div className="farm-event-wrapper col-xs-12" key={item.timestamp}>

        <div className="farm-event-date col-xs-2">
          <div className="farm-event-date-month">
            {item.month}
          </div>
          <div className="farm-event-date-day">
            {item.day}
          </div>
        </div>

        <div className="col-xs-10 events">
          {item.list.map(function (farmEvent) {
            let start = moment(item.timestamp).format("hh:mma");
            return <div className={`farm-event col-xs-12`}
              key={farmEvent.id}>
              <div className="event-time col-xs-3">
                {start}
              </div>
              <div className="event-title col-xs-9">
                ({farmEvent.id || 0}) {item.executableName}
              </div>
              <Link to={`/app/designer/farm_events/` +
                (farmEvent.id || "UNSAVED_EVENT").toString()}>
                <i className="fa fa-pencil-square-o edit-icon"></i>
              </Link>
            </div>;
          })}
        </div>
      </div>;
    });
  }

  render() {

    return <div className="panel-container magenta-panel">
      <div className="panel-header magenta-panel">
        <div className="panel-tabs">
          <Link to="/app/designer" className="mobile-only">
            {t("Designer")}
          </Link>
          <Link to="/app/designer/plants">
            {t("Plants")}
          </Link>
          <Link to="/app/designer/farm_events" className="active">
            {t("Farm Events")}
          </Link>
        </div>
      </div>

      <div className="panel-content events">

        <Row>
          <i className="col-xs-2 fa fa-calendar"></i>

          <Col xs={10}>
            <FBSelect list={[]}
              onChange={(selectedOption) => {
                this.props.push("/app/designer/farm_events/" + selectedOption.value);
              }}
            />
          </Col>

          <div className="farm-events row">
            {this.renderCalendarRows()}
          </div>
        </Row>

        <Link to="/app/designer/farm_events/add">
          <div className="plus-button add-event button-like"
            data-toggle="tooltip" title="Add event">
            <i className="fa fa-2x fa-plus" />
          </div>
        </Link>

      </div>
    </div>;
  }
}
