import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { PropertySchema } from '@deepkit/type';
import { trackByIndex } from '../../utils';
import { DataStructure } from '../../store';
import { arrayMoveItem } from '@deepkit/core';

@Component({
    template: `
        <ng-container *ngIf="model && valueType && keyType">
            <div class="item" *ngFor="let item of model.children; trackBy: trackByIndex; let i = index; let last = last">
                <api-console-input style="margin-right: 5px;" [property]="keyType" [model]="item.getProperty(keyType.name)"
                                   (modelChange)="emit()" (keyDown)="keyDown.emit($event)"></api-console-input>
                <api-console-input [property]="valueType" [model]="item.getProperty(valueType.name)"
                                   (modelChange)="emit()" (keyDown)="keyDown.emit($event)"></api-console-input>
                <dui-icon clickable name="arrow_up" [disabled]="i === 0" (click)="up(item)"></dui-icon>
                <dui-icon clickable name="arrow_down" [disabled]="last" (click)="down(item)"></dui-icon>
                <dui-icon clickable name="garbage" (click)="remove(i)"></dui-icon>
            </div>
        </ng-container>
        <div class="actions">
            <dui-button square icon="add" (click)="add()"></dui-button>
        </div>
    `,
    styles: [`
        .actions {
            margin-top: 6px;
        }
        .item {
            padding: 2px 0;
            display: flex;
        }

        .item > * {
            flex: 1;
        }

        .item dui-icon {
            flex: 0;
        }
    `]
})
export class MapInputComponent implements OnInit, OnChanges {
    trackByIndex = trackByIndex;
    @Input() model!: DataStructure;
    @Output() modelChange = new EventEmitter();
    @Input() property!: PropertySchema;
    @Output() keyDown = new EventEmitter<KeyboardEvent>();

    keyType?: PropertySchema;
    valueType?: PropertySchema;

    emit() {
        this.modelChange.emit(this.model);
    }

    ngOnChanges(): void {
        this.keyType = this.property.templateArgs[0];
        this.valueType = this.property.getSubType();
    }

    ngOnInit(): void {
        this.keyType = this.property.templateArgs[0];
        this.valueType = this.property.getSubType();
    }

    up(i: DataStructure) {
        arrayMoveItem(this.model.children, i, -1);
        this.model.children = this.model.children.slice(0);
        this.emit();
    }

    down(i: DataStructure) {
        arrayMoveItem(this.model.children, i, +1);
        this.model.children = this.model.children.slice(0);
        this.emit();
    }

    remove(i: number) {
        this.model.children.splice(i, 1);
        this.model.children = this.model.children.slice(0);
        this.emit();
    }

    add() {
        this.model.children.push(new DataStructure(undefined));
        this.model.children = this.model.children.slice(0);
        this.emit();
    }
}
